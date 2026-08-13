import { useCallback, useEffect, useState } from "react";
import type { ConsentCategory, CookiePreferences } from "@/lib/cookies/categories";
import {
  acceptAll,
  getConsent,
  rejectAll,
  setConsent,
  subscribe,
} from "@/lib/cookies/consentService";
import type { StoredConsent } from "@/lib/cookies/storage";

/**
 * Acceso al consentimiento de cookies desde React.
 *
 * `montado` no es un detalle de implementación: el sitio se prerenderiza, y
 * en el servidor no hay `localStorage`. Sin este flag, el HTML estático
 * incluiría el banner y se lo mostraría también a quien ya decidió, con un
 * parpadeo feo hasta que la hidratación lo quitara.
 */
export interface CookieConsentApi {
  /** `false` hasta que hidrata en el cliente. Nada debe renderizarse antes. */
  montado: boolean;
  consent: StoredConsent | null;
  /** `true` si hay decisión válida bajo la versión vigente. */
  hasResponded: boolean;
  hasConsent: (categoria: ConsentCategory) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (preferencias: CookiePreferences) => void;
}

export function useCookieConsent(): CookieConsentApi {
  const [montado, setMontado] = useState(false);
  const [consent, setConsentState] = useState<StoredConsent | null>(null);

  useEffect(() => {
    setMontado(true);
    setConsentState(getConsent());
    return subscribe(setConsentState);
  }, []);

  return {
    montado,
    consent,
    hasResponded: consent !== null,
    // Se responde desde el estado de React, no desde el módulo: así el valor
    // queda atado al render y no puede adelantarse a lo que el componente ve.
    hasConsent: useCallback(
      (categoria: ConsentCategory) =>
        categoria === "necessary" ? true : Boolean(consent?.[categoria]),
      [consent]
    ),
    acceptAll: useCallback(() => {
      acceptAll();
    }, []),
    rejectAll: useCallback(() => {
      rejectAll();
    }, []),
    save: useCallback((preferencias: CookiePreferences) => {
      setConsent(preferencias);
    }, []),
  };
}
