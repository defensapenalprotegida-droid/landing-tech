import { describe, expect, it } from "vitest";
import { formatearPesos, soloDigitos } from "./formatoMoneda";

/**
 * En el formulario el monto se escribía como `89899080980`: nadie puede leer
 * eso de un vistazo ni detectar que se coló un dígito de más. Con separadores
 * el error salta a la vista mientras se escribe.
 */

describe("formatearPesos", () => {
  it("agrupa los miles con punto, como se escribe en Chile", () => {
    expect(formatearPesos("89899080980")).toBe("$89.899.080.980");
  });

  it("no agrupa por debajo de mil", () => {
    expect(formatearPesos("999")).toBe("$999");
  });

  it("agrupa justo en el millón", () => {
    expect(formatearPesos("1000000")).toBe("$1.000.000");
  });

  it("devuelve vacío si no hay nada escrito", () => {
    // Un "$" solo en un campo vacío parece un error de la página.
    expect(formatearPesos("")).toBe("");
  });

  it("ignora lo que ya venga formateado y no duplica símbolos", () => {
    expect(formatearPesos("$1.234")).toBe("$1.234");
  });

  it("descarta ceros a la izquierda", () => {
    expect(formatearPesos("0001500")).toBe("$1.500");
  });

  it("devuelve vacío si solo hay ceros", () => {
    expect(formatearPesos("000")).toBe("");
  });
});

describe("soloDigitos", () => {
  it("conserva únicamente los números", () => {
    expect(soloDigitos("$1.234.567")).toBe("1234567");
  });

  it("descarta letras y espacios que se pegan al copiar", () => {
    expect(soloDigitos(" 2.500.000 pesos ")).toBe("2500000");
  });

  it("no admite negativos ni decimales", () => {
    // Los montos del formulario son deudas y sueldos: enteros y positivos.
    expect(soloDigitos("-1.500,75")).toBe("150075");
  });
});
