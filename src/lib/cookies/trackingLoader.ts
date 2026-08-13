import type { OptionalCategory } from "./categories";
import { deleteCookies, type PatronCookie } from "./cookieJar";
import { getPreferences, subscribe } from "./consentService";
import {
  initGoogleConsentMode,
  updateGoogleConsentMode,
} from "./googleConsentMode";

/**
 * Carga de servicios de terceros condicionada al consentimiento.
 *
 * El registro está deliberadamente vacío: hoy el sitio no tiene analítica ni
 * píxeles. Lo que existe es el mecanismo, para que el día que se agregue GA o
 * un píxel de Meta se registre acá y quede bloqueado de origen, en vez de
 * pegarlo en `index.html` (que es donde se cuela sin consentimiento).
 *
 * reCAPTCHA Enterprise sigue en `index.html` a propósito: es una medida de
 * seguridad para los formularios, cae en "estrictamente necesarias" y no
 * requiere consentimiento previo.
 */
export interface TrackingProvider {
  /** Identificador estable, usado para no cargar dos veces. */
  id: string;
  category: OptionalCategory;
  /** Inserta el script. Solo se llama con consentimiento vigente. */
  load: () => void;
  /**
   * Cookies propias o de superdominio a borrar si se retira el permiso.
   * Nombre exacto o prefijo (`_ga` cubre `_ga_ABC123`).
   */
  cookies?: PatronCookie[];
  /** Desmontaje adicional, si el proveedor lo permite. */
  unload?: () => void;
}

const proveedores = new Map<string, TrackingProvider>();
const cargados = new Set<string>();

/** Registra un proveedor. Idempotente por `id`. */
export function registerProvider(proveedor: TrackingProvider): void {
  proveedores.set(proveedor.id, proveedor);
}

/**
 * Aplica el consentimiento actual a todos los proveedores registrados.
 *
 * Los scripts ya inyectados no se pueden "descargar" de verdad; por eso al
 * retirar el permiso se borran sus cookies y se marca como no cargado, pero la
 * garantía real de que dejen de operar es la recarga de página. La primera
 * línea de defensa siempre es no haberlos cargado nunca.
 */
function aplicar(): void {
  const preferencias = getPreferences();
  updateGoogleConsentMode(preferencias);

  for (const proveedor of proveedores.values()) {
    const permitido = preferencias[proveedor.category];

    if (permitido && !cargados.has(proveedor.id)) {
      proveedor.load();
      cargados.add(proveedor.id);
      continue;
    }

    if (!permitido && cargados.has(proveedor.id)) {
      proveedor.unload?.();
      cargados.delete(proveedor.id);
    }

    if (!permitido && proveedor.cookies?.length) {
      deleteCookies(proveedor.cookies);
    }
  }
}

let desuscribir: (() => void) | null = null;

/**
 * Arranca el sistema. Se llama una sola vez, lo antes posible en el cliente.
 *
 * El orden importa: primero el `denied` por defecto de Google, y solo después
 * se lee lo que la persona haya decidido.
 */
export function initTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  if (desuscribir) return desuscribir;

  initGoogleConsentMode();
  desuscribir = subscribe(() => aplicar());
  return desuscribir;
}

/** Solo para pruebas. */
export function __resetTrackingParaPruebas(): void {
  proveedores.clear();
  cargados.clear();
  desuscribir?.();
  desuscribir = null;
}
