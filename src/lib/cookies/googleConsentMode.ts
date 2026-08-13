import type { CookiePreferences } from "./categories";

/**
 * Puente con el Consent Mode v2 de Google.
 *
 * Hoy el sitio no tiene GA ni GTM. Aun así esto se ejecuta desde el arranque,
 * y no es código muerto: el valor por defecto `denied` tiene que estar en el
 * `dataLayer` ANTES de que cargue cualquier etiqueta de Google. Si se instala
 * GTM más adelante y este bloque no estuviera ya puesto, la etiqueta entraría
 * con el permiso concedido de fábrica y habría recolectado datos antes de que
 * nadie aceptara nada. Sembrar el `denied` ahora es lo que hace que ese futuro
 * despliegue sea seguro por omisión.
 */

type ArgumentosGtag = unknown[];

declare global {
  interface Window {
    dataLayer?: ArgumentosGtag[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]): void {
  // El snippet oficial empuja el objeto `arguments`. Un array normal es
  // equivalente para GTM (lo recorre por índice) y evita depender de
  // `arguments` dentro de una función con parámetros rest.
  window.dataLayer!.push(args);
}

function asegurarDataLayer(): void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) window.gtag = gtag;
}

/** Deniega todos los permisos opcionales. Debe correr lo antes posible. */
export function initGoogleConsentMode(): void {
  if (typeof window === "undefined") return;
  asegurarDataLayer();

  window.gtag!("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    // La seguridad (reCAPTCHA, antifraude) no requiere consentimiento.
    security_storage: "granted",
    wait_for_update: 500,
  });
}

/** Traduce las preferencias a una actualización de permisos. */
export function updateGoogleConsentMode(
  preferencias: CookiePreferences
): void {
  if (typeof window === "undefined") return;
  asegurarDataLayer();

  const conceder = (permitido: boolean) => (permitido ? "granted" : "denied");

  window.gtag!("consent", "update", {
    ad_storage: conceder(preferencias.marketing),
    ad_user_data: conceder(preferencias.marketing),
    ad_personalization: conceder(preferencias.marketing),
    analytics_storage: conceder(preferencias.analytics),
    functionality_storage: conceder(preferencias.functional),
    personalization_storage: conceder(preferencias.functional),
    security_storage: "granted",
  });
}
