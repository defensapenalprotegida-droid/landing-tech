type Dict = Record<string, string>;

const AREA_LABELS: Dict = {
  penal: "Derecho Penal", civil: "Derecho Civil", laboral: "Derecho Laboral",
  familia: "Derecho de Familia", corporativo: "Derecho Corporativo",
  inmobiliario: "Derecho Inmobiliario", tributario: "Derecho Tributario",
};
const URGENCIA_LABELS: Dict = {
  inmediata: "Inmediata (detenido / citado)", semana: "Esta semana", sin_apuro: "Sin apuro",
};
const HORARIO_LABELS: Dict = { manana: "Mañana", tarde: "Tarde", cualquiera: "Cualquiera" };
const MONTO_LABELS: Dict = {
  lt1: "Menos de $1.000.000", "1a10": "$1.000.000 – $10.000.000",
  "10a50": "$10.000.000 – $50.000.000", gt50: "Más de $50.000.000", na: "No aplica / no lo sé",
};
const PENAL_LABELS: Dict = {
  detenido: "Detenido", citado: "Citado a declarar", formalizado: "Formalizado",
  victima: "Soy víctima / quiero querellarme", preventiva: "Consulta preventiva",
};
const FAMILIA_LABELS: Dict = {
  divorcio: "Divorcio", alimentos: "Pensión de alimentos",
  cuidado: "Cuidado personal / visitas", vif: "Violencia intrafamiliar", otro: "Otro",
};
const LABORAL_PARTE_LABELS: Dict = { trabajador: "Trabajador", empresa: "Empresa / empleador" };
const LABORAL_SIT_LABELS: Dict = {
  despido: "Despido injustificado", autodespido: "Autodespido", tutela: "Tutela de derechos",
  prestaciones: "Cobro de prestaciones", otro: "Otro",
};

export interface LeadEmailInput {
  name: string; phone?: string; email: string; message: string;
  area?: string; urgencia?: string; horario?: string;
  situacionPenal?: string; monto?: string; materiaFamilia?: string;
  laboralParte?: string; laboralSituacion?: string;
}

function esc(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const label = (map: Dict, k?: string) => (k && map[k]) || (k ?? "");

export function buildLeadEmail(data: LeadEmailInput) {
  const areaLabel = label(AREA_LABELS, data.area) || "Consulta general";
  const urgente = data.urgencia === "inmediata" ? "URGENTE · " : "";
  const areaTag = (data.area ? label(AREA_LABELS, data.area) : "GENERAL")
    .replace("Derecho ", "").toUpperCase();
  const subject = `[${urgente}${areaTag}] Nueva consulta – ${data.name}`;

  // Filas de clasificación (solo las que aplican)
  const clasificacion: Array<[string, string]> = [];
  if (data.area) clasificacion.push(["Área", areaLabel]);
  if (data.urgencia) clasificacion.push(["Urgencia", label(URGENCIA_LABELS, data.urgencia)]);
  if (data.situacionPenal) clasificacion.push(["Situación", label(PENAL_LABELS, data.situacionPenal)]);
  if (data.materiaFamilia) clasificacion.push(["Materia", label(FAMILIA_LABELS, data.materiaFamilia)]);
  if (data.laboralParte) clasificacion.push(["Parte", label(LABORAL_PARTE_LABELS, data.laboralParte)]);
  if (data.laboralSituacion) clasificacion.push(["Situación laboral", label(LABORAL_SIT_LABELS, data.laboralSituacion)]);
  if (data.monto) clasificacion.push(["Monto involucrado", label(MONTO_LABELS, data.monto)]);

  const contacto: Array<[string, string]> = [
    ["Nombre", data.name],
    ["Teléfono", data.phone || "No informado"],
    ["Email", data.email],
    ["Mejor horario", label(HORARIO_LABELS, data.horario) || "No informado"],
  ];

  const textRows = (rows: Array<[string, string]>) =>
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const text = [
    "Nueva consulta legal desde el sitio web", "",
    "--- Contacto ---", textRows(contacto), "",
    ...(clasificacion.length ? ["--- Clasificación del caso ---", textRows(clasificacion), ""] : []),
    "--- Descripción ---", data.message || "",
  ].join("\n");

  const htmlRows = (rows: Array<[string, string]>) =>
    rows.map(([k, v]) =>
      `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap;">${esc(k)}</td>` +
      `<td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600;">${esc(v)}</td></tr>`
    ).join("");

  const html = `
  <div style="background:#f5f5f3;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#0F3B47,#A12341);padding:28px;color:#fff;">
        <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.85;">Arteaga &amp; Aldunate Abogados y Asociados</p>
        <h1 style="margin:10px 0 0;font-size:22px;">Nueva consulta legal</h1>
        <p style="margin:8px 0 0;font-size:13px;opacity:.9;">${esc(areaLabel)}${data.urgencia === "inmediata" ? " · <strong>URGENTE</strong>" : ""}</p>
      </div>
      <div style="padding:22px 26px;">
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Contacto</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">${htmlRows(contacto)}</table>
        ${clasificacion.length ? `
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Clasificación del caso</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">${htmlRows(clasificacion)}</table>` : ""}
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Descripción</h2>
        <p style="color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(data.message)}</p>
      </div>
    </div>
  </div>`;

  return { subject, text, html };
}
