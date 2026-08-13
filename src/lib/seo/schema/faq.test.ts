import { describe, expect, it } from "vitest";
import { faqSchema } from "./faq";
import { breadcrumbSchema } from "./breadcrumb";

describe("faqSchema", () => {
  it("convierte pares q/a en Question y Answer", () => {
    const schema = faqSchema([{ q: "¿Cuánto demora?", a: "Entre 3 y 6 meses." }]);

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0]["@type"]).toBe("Question");
    expect(schema.mainEntity[0].name).toBe("¿Cuánto demora?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Entre 3 y 6 meses.");
  });

  it("devuelve null sin preguntas, para no emitir un FAQPage vacío", () => {
    expect(faqSchema([])).toBeNull();
  });
});

describe("breadcrumbSchema", () => {
  it("numera las posiciones desde 1 y usa URLs absolutas", () => {
    const schema = breadcrumbSchema([
      { nombre: "Inicio", path: "/" },
      { nombre: "Servicios", path: "/servicios" },
    ]);

    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toBe(
      "https://arteagayaldunate.cl/servicios"
    );
  });
});
