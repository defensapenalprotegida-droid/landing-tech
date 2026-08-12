import type { LeadFormValues } from "./leadSchema";
import type { BrokerageFormValues } from "./brokerageSchema";
import type { ConsentRecord } from "./consent";
import { PRODUCTO_TO_AREA, type Producto } from "@/lib/productosJuridicos";

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
    /**
     * Registro probatorio del consentimiento. Obligatorio en cualquier
     * formulario que capture datos personales.
     */
    consent?: ConsentRecord;
  };

export interface SubmitLeadPayload {
  servicio: string;
  producto?: Producto;
  recaptchaToken: string;
  recaptchaAction: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  urgencia?: string;
  horario?: string;
  [key: string]: unknown;
}

export async function submitLead(
  payload: SubmitLeadPayload
): Promise<{ ok: boolean; message: string }> {
  try {
    // Mapear producto → area si no viene area
    let body: any = { ...payload };
    if (payload.producto && !payload.area) {
      body.area = PRODUCTO_TO_AREA[payload.producto];
    }

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { ok: false, message: error.message || "Error al enviar el formulario" };
    }

    return { ok: true, message: "Lead enviado correctamente" };
  } catch (error) {
    console.error("Error en submitLead:", error);
    return { ok: false, message: "Error de conexión. Intenta de nuevo." };
  }
}
