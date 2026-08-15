import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AREAS, AREA_GENERAL } from "./leadSchema";
import { getAllProductos } from "./productosJuridicos";

/**
 * Regla del proyecto: **toda consulta viaja con un área**.
 *
 * Sin ella el asunto del correo sale como "SIN ÁREA" y el lead llega sin
 * clasificar a la bandeja del estudio. El área no se le pregunta a la persona
 * salvo en el formulario largo: en los demás ya está determinada por el
 * formulario en el que está.
 *
 * Se comprueba sobre el código fuente porque lo que importa es que ningún
 * formulario quede sin el campo. Un test que montara los componentes probaría
 * un envío concreto, no la ausencia de un descuido en los otros.
 */

const FORMULARIOS = [
  "src/components/hero/LegalQuickForm.tsx",
  "src/components/hero/BrokerageQuickForm.tsx",
  "src/components/hero/ProductoForm.tsx",
  "src/components/ContactSection.tsx",
];

const fuente = (ruta: string) => readFileSync(ruta, "utf8");

describe("toda consulta lleva un área", () => {
  it.each(FORMULARIOS)("%s envía el campo area", (ruta) => {
    const codigo = fuente(ruta);
    // ContactSection lo registra como campo del formulario; el resto lo fija
    // o lo deriva al construir el payload.
    const loEnvia =
      /\barea:\s/.test(codigo) || /register\("area"\)/.test(codigo);

    expect(loEnvia).toBe(true);
  });
});

describe("valores válidos", () => {
  it("cada producto declara un área conocida", () => {
    // Es el origen del área en ProductoForm: si un producto nuevo llegara sin
    // `backendArea` válida, sus consultas volverían a caer en "SIN ÁREA".
    for (const producto of getAllProductos()) {
      expect(AREAS).toContain(producto.backendArea);
    }
  });

  it("el área general no aparece en el selector de especialidades", () => {
    // "Consulta general" es el destino de quien no eligió, no una opción que
    // se le ofrezca a quien sí está eligiendo especialidad.
    expect(AREAS).not.toContain(AREA_GENERAL);
  });

  it("corretaje se clasifica como inmobiliario", () => {
    expect(fuente("src/components/hero/BrokerageQuickForm.tsx")).toContain(
      'area: "inmobiliario"'
    );
  });
});
