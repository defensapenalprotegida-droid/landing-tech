import { describe, it, expect } from "vitest";
import { buildLeadEmail } from "./emailTemplate";

describe("buildLeadEmail", () => {
  it("arma asunto filtrable con área y URGENTE para urgencia inmediata", () => {
    const { subject } = buildLeadEmail({
      name: "Juan Pérez", phone: "+56912345678", email: "j@x.cl",
      area: "penal", urgencia: "inmediata", horario: "manana",
      message: "Detenido anoche", situacionPenal: "detenido",
    });
    expect(subject).toContain("PENAL");
    expect(subject).toContain("URGENTE");
    expect(subject).toContain("Juan Pérez");
  });

  it("sin urgencia inmediata no marca URGENTE", () => {
    const { subject } = buildLeadEmail({
      name: "Ana", phone: "1", email: "a@x.cl", area: "civil",
      urgencia: "sin_apuro", horario: "tarde", message: "consulta", monto: "1a10",
    });
    expect(subject).not.toContain("URGENTE");
    expect(subject).toContain("CIVIL");
  });

  it("incluye la clasificación (monto) y escapa HTML", () => {
    const { html, text } = buildLeadEmail({
      name: "<script>x</script>", phone: "1", email: "a@x.cl",
      area: "civil", urgencia: "semana", horario: "cualquiera",
      message: "hola", monto: "10a50",
    });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>x");
    expect(text).toContain("$10.000.000");
  });

  it("funciona con el payload mínimo legado (sin campos nuevos)", () => {
    const out = buildLeadEmail({
      name: "Legacy", phone: "", email: "l@x.cl", message: "solo mensaje",
    } as any);
    expect(out.subject).toContain("Legacy");
    expect(out.html).toContain("solo mensaje");
  });
});
