import {
  CONSENT_VERSION,
  DENY_ALL,
  OPTIONAL_CATEGORIES,
  type CookiePreferences,
} from "./categories";

/**
 * Persistencia del consentimiento de cookies.
 *
 * Se usa `localStorage` y no una cookie propia por una razón práctica: el
 * sitio es estático (prerender + CDN), no hay servidor que lea la cookie en
 * cada request, así que mandarla en cada petición solo sumaría bytes. La
 * decisión se consulta siempre en el cliente.
 */
const STORAGE_KEY = "aya_cookie_consent";

export interface StoredConsent {
  version: string;
  /** Siempre true: es la categoría que no se puede rechazar. */
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  /** ISO 8601 UTC del momento de la decisión. */
  timestamp: string;
}

/** `false` durante el prerender SSG y si el navegador bloquea el storage. */
function storageDisponible(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    // Safari en modo estricto puede lanzar al solo tocar la propiedad.
    return false;
  }
}

function esBooleano(valor: unknown): valor is boolean {
  return typeof valor === "boolean";
}

/**
 * Lee el consentimiento guardado.
 *
 * Devuelve `null` si no hay nada, si el contenido está corrupto o si fue
 * otorgado bajo una versión distinta de `CONSENT_VERSION`. Los tres casos se
 * tratan igual a propósito: sin una decisión válida y vigente, la persona no
 * ha consentido, y por lo tanto hay que volver a preguntar.
 */
export function readConsent(): StoredConsent | null {
  if (!storageDisponible()) return null;

  let crudo: string | null;
  try {
    crudo = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!crudo) return null;

  try {
    const datos = JSON.parse(crudo) as Partial<StoredConsent>;

    if (datos?.version !== CONSENT_VERSION) return null;
    if (typeof datos.timestamp !== "string") return null;
    if (OPTIONAL_CATEGORIES.some((cat) => !esBooleano(datos[cat]))) return null;

    return {
      version: CONSENT_VERSION,
      necessary: true,
      functional: datos.functional as boolean,
      analytics: datos.analytics as boolean,
      marketing: datos.marketing as boolean,
      timestamp: datos.timestamp,
    };
  } catch {
    return null;
  }
}

/**
 * Guarda la decisión y devuelve el registro resultante.
 *
 * Devuelve el registro incluso si el storage falla (incógnito con cuota cero,
 * por ejemplo): así la elección rige al menos durante la sesión en curso en
 * lugar de perderse en silencio y dejar el sitio en un estado incoherente.
 */
export function writeConsent(
  preferencias: CookiePreferences = DENY_ALL
): StoredConsent {
  const registro: StoredConsent = {
    version: CONSENT_VERSION,
    necessary: true,
    functional: preferencias.functional,
    analytics: preferencias.analytics,
    marketing: preferencias.marketing,
    timestamp: new Date().toISOString(),
  };

  if (storageDisponible()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registro));
    } catch {
      // Sin persistencia la decisión vale solo para esta sesión. Es peor
      // volver a preguntar en cada clic que aceptar esa limitación.
    }
  }

  return registro;
}

/** Borra la decisión guardada. El banner vuelve a aparecer. */
export function clearStoredConsent(): void {
  if (!storageDisponible()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nada que hacer.
  }
}

/** Expuesto solo para las pruebas y para diagnóstico. */
export const CONSENT_STORAGE_KEY = STORAGE_KEY;
