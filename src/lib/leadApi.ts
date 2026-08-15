import type { LeadFormValues } from "./leadSchema";

export type LeadPayload = Partial<LeadFormValues> & {
  name: string; email: string; message: string;
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
