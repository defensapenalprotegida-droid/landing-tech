import { Link } from "react-router-dom";
import { CONSENT_TEXT, MARKETING_TEXT } from "@/lib/consent";
import type { ConsentState } from "@/hooks/use-consent";

/**
 * Casillas de consentimiento para cualquier formulario de captación.
 *
 * La versión de la política NO es una prop: la toma siempre de `consent.ts`.
 * Si se pudiera pasar por fuera, tarde o temprano alguien copiaría un
 * formulario con una versión vieja escrita a mano y el registro quedaría
 * mintiendo sobre qué texto se aceptó.
 */
const PrivacyConsent = ({
  aceptado,
  setAceptado,
  marketing,
  setMarketing,
  error,
  source,
}: ConsentState) => {
  const idBase = `consent-${source}`;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <input
          id={idBase}
          type="checkbox"
          // Sin `defaultChecked`: el consentimiento debe ser un acto de la
          // persona. Una casilla premarcada no es consentimiento.
          checked={aceptado}
          onChange={(e) => setAceptado(e.target.checked)}
          aria-describedby={error ? `${idBase}-error` : undefined}
          aria-invalid={Boolean(error)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-primary"
        />
        <label
          htmlFor={idBase}
          className="font-body text-xs leading-relaxed text-muted-foreground"
        >
          {CONSENT_TEXT}{" "}
          <Link
            to="/privacidad"
            target="_blank"
            className="text-primary underline underline-offset-2"
          >
            Ver Política de Privacidad
          </Link>
        </label>
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${idBase}-marketing`}
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-primary"
        />
        <label
          htmlFor={`${idBase}-marketing`}
          className="font-body text-xs leading-relaxed text-muted-foreground"
        >
          {MARKETING_TEXT}{" "}
          <span className="text-foreground/60">(opcional)</span>
        </label>
      </div>

      {error && (
        <p
          id={`${idBase}-error`}
          role="alert"
          className="font-body text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PrivacyConsent;
