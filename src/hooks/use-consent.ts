import { useState } from "react";
import {
  buildConsentRecord,
  CONSENT_REQUIRED_MESSAGE,
  type ConsentRecord,
  type ConsentSource,
} from "@/lib/consent";

export interface ConsentState {
  source: ConsentSource;
  aceptado: boolean;
  setAceptado: (v: boolean) => void;
  marketing: boolean;
  setMarketing: (v: boolean) => void;
  error?: string;
  /** Valida antes de enviar. Devuelve false y marca el error si falta. */
  validar: () => boolean;
  /** Registro probatorio para adjuntar al lead. Llamar tras validar. */
  registro: () => ConsentRecord;
  /** Deja los checkboxes en blanco tras un envío exitoso. */
  reset: () => void;
}

/**
 * Estado del consentimiento de un formulario.
 *
 * Se expone como hook para que sumar consentimiento a un formulario nuevo sean
 * tres líneas —`useConsent`, `validar()` y `<PrivacyConsent />`— en vez de
 * reimplementar checkboxes y validación en cada uno. Con nueve formularios en
 * el hero, repetirlo a mano garantiza que al décimo se olvide.
 */
export function useConsent(source: ConsentSource): ConsentState {
  const [aceptado, setAceptado] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  return {
    source,
    aceptado,
    setAceptado: (v: boolean) => {
      setAceptado(v);
      if (v) setError(undefined);
    },
    marketing,
    setMarketing,
    error,
    validar: () => {
      if (!aceptado) {
        setError(CONSENT_REQUIRED_MESSAGE);
        return false;
      }
      setError(undefined);
      return true;
    },
    // El instante se captura aquí, al enviar, no al montar el formulario.
    registro: () => buildConsentRecord(source, marketing),
    reset: () => {
      setAceptado(false);
      setMarketing(false);
      setError(undefined);
    },
  };
}
