import {
  ALLOW_ALL,
  DENY_ALL,
  type ConsentCategory,
  type CookiePreferences,
} from "./categories";
import { clearStoredConsent, readConsent, writeConsent } from "./storage";
import type { StoredConsent } from "./storage";

/**
 * Fuente única de verdad del consentimiento de cookies.
 *
 * Es un módulo y no un contexto de React a propósito: los cargadores de
 * scripts de terceros no viven dentro del árbol de React y necesitan poder
 * preguntar `hasConsent("analytics")` desde cualquier parte, incluso antes de
 * que monte el primer componente.
 */

type Oyente = (consentimiento: StoredConsent | null) => void;

let estado: StoredConsent | null = null;
let hidratado = false;
const oyentes = new Set<Oyente>();

/**
 * Carga el estado desde el storage la primera vez que se consulta.
 *
 * Perezoso porque durante el prerender SSG no hay `window`: si se leyera al
 * importar el módulo, el estado quedaría congelado en `null` dentro del HTML
 * generado y ninguna hidratación posterior lo corregiría.
 */
function hidratar(): void {
  if (hidratado) return;
  if (typeof window === "undefined") return;
  estado = readConsent();
  hidratado = true;
}

/** Registro vigente, o `null` si la persona todavía no ha decidido. */
export function getConsent(): StoredConsent | null {
  hidratar();
  return estado;
}

/**
 * `true` si hay una decisión válida bajo la versión actual.
 *
 * Es lo que decide si el banner aparece o no.
 */
export function hasResponded(): boolean {
  return getConsent() !== null;
}

/**
 * ¿Está autorizada esta categoría?
 *
 * Sin decisión guardada devuelve `false` para todo lo opcional. Esa es la
 * regla completa: no responder no es consentir.
 */
export function hasConsent(categoria: ConsentCategory): boolean {
  if (categoria === "necessary") return true;
  const actual = getConsent();
  return actual ? actual[categoria] : false;
}

/** Preferencias actuales, listas para pintar los toggles. */
export function getPreferences(): CookiePreferences {
  const actual = getConsent();
  if (!actual) return { ...DENY_ALL };
  return {
    functional: actual.functional,
    analytics: actual.analytics,
    marketing: actual.marketing,
  };
}

function emitir(): void {
  for (const oyente of oyentes) oyente(estado);
}

/**
 * Escucha cambios de consentimiento.
 *
 * Devuelve la función para darse de baja. Al suscribirse se recibe el estado
 * actual de inmediato, así quien llega tarde no se queda esperando un cambio
 * que ya ocurrió.
 */
export function subscribe(oyente: Oyente): () => void {
  hidratar();
  oyentes.add(oyente);
  oyente(estado);
  return () => {
    oyentes.delete(oyente);
  };
}

/** Guarda una elección concreta y la aplica de inmediato. */
export function setConsent(preferencias: CookiePreferences): StoredConsent {
  hidratar();
  estado = writeConsent(preferencias);
  hidratado = true;
  emitir();
  return estado;
}

export function acceptAll(): StoredConsent {
  return setConsent({ ...ALLOW_ALL });
}

/** Rechaza todo lo opcional. Es también lo que hace cerrar el modal con la X. */
export function rejectAll(): StoredConsent {
  return setConsent({ ...DENY_ALL });
}

/**
 * Borra la decisión y vuelve al estado de primera visita.
 *
 * Se usa en las pruebas y queda disponible por si hace falta forzar una nueva
 * solicitud sin subir `CONSENT_VERSION`.
 */
export function resetConsent(): void {
  clearStoredConsent();
  estado = null;
  hidratado = typeof window !== "undefined";
  emitir();
}

/** Solo para pruebas: descarta el estado en memoria y los oyentes. */
export function __resetServicioParaPruebas(): void {
  estado = null;
  hidratado = false;
  oyentes.clear();
}
