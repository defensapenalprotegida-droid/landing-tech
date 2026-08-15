import { describe, expect, it } from "vitest";
import { construirCamposProducto } from "./camposProducto";
import type { Campo } from "./productosJuridicos";

const campos: Campo[] = [
  { name: "mesesMora", type: "number", label: "Meses de mora", required: true },
  {
    name: "tieneContrato",
    type: "radio",
    label: "Contrato de arriendo",
    required: true,
    options: [
      { value: "si", label: "Sí" },
      { value: "no", label: "No" },
    ],
  },
  { name: "comentario", type: "textarea", label: "Comentario", required: false },
];

describe("construirCamposProducto", () => {
  it("usa la etiqueta del formulario, no el nombre técnico", () => {
    // El correo lo lee una persona, no un programa: "Meses de mora" sirve,
    // "mesesMora" obliga a adivinar.
    const resultado = construirCamposProducto(campos, { mesesMora: "6" });

    expect(resultado).toEqual([{ label: "Meses de mora", value: "6" }]);
  });

  it("traduce el valor de las opciones a su etiqueta", () => {
    // Sin esto el correo diría "si" en vez de "Sí".
    const resultado = construirCamposProducto(campos, { tieneContrato: "si" });

    expect(resultado).toEqual([{ label: "Contrato de arriendo", value: "Sí" }]);
  });

  it("omite los campos que la persona dejó vacíos", () => {
    const resultado = construirCamposProducto(campos, {
      mesesMora: "3",
      comentario: "",
    });

    expect(resultado).toEqual([{ label: "Meses de mora", value: "3" }]);
  });

  it("respeta el orden en que aparecen en el formulario", () => {
    const resultado = construirCamposProducto(campos, {
      comentario: "urgente",
      tieneContrato: "no",
      mesesMora: "2",
    });

    expect(resultado.map((c) => c.label)).toEqual([
      "Meses de mora",
      "Contrato de arriendo",
      "Comentario",
    ]);
  });

  it("ignora datos del formulario que no son campos del producto", () => {
    // name, email o recaptchaToken viajan aparte; duplicarlos aquí sería
    // repetirlos en el correo.
    const resultado = construirCamposProducto(campos, {
      name: "Ana",
      email: "ana@ejemplo.cl",
      mesesMora: "1",
    });

    expect(resultado).toEqual([{ label: "Meses de mora", value: "1" }]);
  });

  it("convierte números a texto", () => {
    const resultado = construirCamposProducto(campos, { mesesMora: 4 });

    expect(resultado).toEqual([{ label: "Meses de mora", value: "4" }]);
  });

  it("devuelve un arreglo vacío si no se llenó ningún campo", () => {
    expect(construirCamposProducto(campos, {})).toEqual([]);
  });
});
