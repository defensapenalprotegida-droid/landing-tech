import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { POLICY_STATUS } from "@/lib/consent";

const fuente = readFileSync(resolve(__dirname, "./Privacidad.tsx"), "utf8");

// Los comentarios del archivo mencionan a propósito qué se decidió NO
// publicar; solo interesa lo que llega al visitante.
const politica = fuente
  .replace(/\/\*\*[\s\S]*?\*\//g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

describe("Política de privacidad — resguardos", () => {
  it("no afirma que los datos no se comparten con terceros", () => {
    // La versión anterior lo decía y era falso: los leads pasan por AWS,
    // Google y Vercel. Afirmarlo en una política es una declaración incorrecta
    // frente a quien entrega sus datos.
    expect(politica).not.toMatch(/no se comparten con terceros/i);
  });

  it("individualiza al responsable y ofrece un canal de derechos", () => {
    expect(politica).toMatch(/responsable del tratamiento/i);
    expect(politica).toMatch(/Bombero Salas/);
    expect(politica).toMatch(/abogados@arteagayaldunate\.cl/);
  });

  it("no publica datos que se decidió mantener fuera", () => {
    expect(politica).not.toMatch(/\bRUT\b/);
    expect(politica).not.toMatch(/privacidad@arteagayaldunate\.cl/);
  });

  it("declara a los encargados del tratamiento y la salida del país", () => {
    expect(politica).toMatch(/Amazon Web Services/);
    expect(politica).toMatch(/Google/);
    expect(politica).toMatch(/Vercel/);
    expect(politica).toMatch(/fuera de Chile/i);
  });

  it("si la política está vigente, no puede tener marcadores pendientes", () => {
    if (POLICY_STATUS !== "vigente") {
      // Sigue en borrador: los [POR DEFINIR] son esperables.
      expect(politica).toMatch(/\[POR DEFINIR/);
      return;
    }
    expect(politica).not.toMatch(/\[POR DEFINIR/);
  });
});
