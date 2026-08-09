import { describe, it, expect } from "vitest";
import { brokerageSchema } from "./brokerageSchema";

const valido = {
  name: "Juan Pérez",
  phone: "+56 9 1234 5678",
  email: "juan@example.com",
  operacion: "vender",
  message: "Hola!",
};

describe("brokerageSchema", () => {
  it("acepta el mínimo válido", () => {
    const r = brokerageSchema.safeParse(valido);
    expect(r.success).toBe(true);
  });

  it("exige nombre, teléfono, correo, operación y mensaje", () => {
    for (const campo of ["name", "phone", "email", "operacion", "message"]) {
      const sinCampo = { ...valido };
      delete (sinCampo as Record<string, unknown>)[campo];
      expect(brokerageSchema.safeParse(sinCampo).success).toBe(false);
    }
  });

  it("exige al menos 5 caracteres en el mensaje, igual que el formulario legal", () => {
    expect(brokerageSchema.safeParse({ ...valido, message: "hola" }).success).toBe(false);
    expect(brokerageSchema.safeParse({ ...valido, message: "hola!" }).success).toBe(true);
  });

  it("acepta los campos opcionales de propiedad", () => {
    const r = brokerageSchema.safeParse({
      ...valido,
      tipoPropiedad: "departamento",
      comuna: "Providencia",
      temaLegal: "si",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza cuando el honeypot viene lleno", () => {
    expect(brokerageSchema.safeParse({ ...valido, website: "bot" }).success).toBe(false);
  });
});
