import { describe, it, expect } from "vitest";
import { leadSchema, montoAplica } from "./leadSchema";

const base = {
  name: "Juan Pérez",
  phone: "+56912345678",
  email: "juan@example.com",
  area: "penal" as const,
  urgencia: "inmediata" as const,
  horario: "cualquiera" as const,
  message: "Fui citado a declarar y necesito ayuda urgente.",
  situacionPenal: "citado" as const,
  website: "", // honeypot
};

describe("leadSchema", () => {
  it("acepta un lead penal válido con situación", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const r = leadSchema.safeParse({ ...base, email: "no-es-email" });
    expect(r.success).toBe(false);
  });

  it("rechaza mensaje demasiado corto", () => {
    const r = leadSchema.safeParse({ ...base, message: "hola" });
    expect(r.success).toBe(false);
  });

  it("exige situación penal cuando el área es penal", () => {
    const { situacionPenal, ...noSit } = base;
    const r = leadSchema.safeParse(noSit);
    expect(r.success).toBe(false);
  });

  it("exige parte y situación laboral cuando el área es laboral", () => {
    const r = leadSchema.safeParse({
      ...base,
      area: "laboral",
      situacionPenal: undefined,
    });
    expect(r.success).toBe(false);
  });

  it("montoAplica es true para civil y false para familia", () => {
    expect(montoAplica("civil")).toBe(true);
    expect(montoAplica("familia")).toBe(false);
  });
});
