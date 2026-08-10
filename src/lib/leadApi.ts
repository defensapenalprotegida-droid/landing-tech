import type { LeadFormValues } from "./leadSchema";
import type { BrokerageFormValues } from "./brokerageSchema";

export type Servicio = "legal" | "corretaje";

/**
 * El endpoint es el mismo para ambos formularios, así que el payload es la
 * unión de los dos, con los tres campos que el backend siempre exige.
 */
export type LeadPayload = Partial<LeadFormValues> &
  Partial<BrokerageFormValues> & {
    name: string;
    email: string;
    message: string;
    servicio?: Servicio;
    /** Token de reCAPTCHA Enterprise. Ausente si el script no cargó. */
    recaptchaToken?: string;
    recaptchaAction?: string;
  };

export async function submitLead(
  payload: LeadPayload
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, message: data.message || "No se pudo enviar tu consulta." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Error de conexión. Intenta nuevamente." };
  }
}
