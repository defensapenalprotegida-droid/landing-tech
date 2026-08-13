import { describe, expect, it } from "vitest";
import { legalServiceSchema } from "./organizacion";
import { servicioSchema } from "./servicio";
import { ESTUDIO_ID } from "../estudio";
import { getProductosPublicados } from "@/lib/productosJuridicos";

const schemaAJson = (schema: object) => JSON.parse(JSON.stringify(schema));

describe("legalServiceSchema", () => {
  it("es JSON serializable y del tipo correcto", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema["@type"]).toBe("LegalService");
    expect(schema["@id"]).toBe(ESTUDIO_ID);
  });

  it("incluye el NAP que necesita el paquete local", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema.telephone).toBeTruthy();
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressLocality).toBe("Santiago");
  });

  it("declara las áreas y los productos", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema.knowsAbout).toHaveLength(7);
    expect(schema.hasOfferCatalog["@type"]).toBe("OfferCatalog");
  });

  it("nunca emite calificaciones", () => {
    const texto = JSON.stringify(legalServiceSchema());
    expect(texto).not.toContain("AggregateRating");
    expect(texto).not.toContain("Review");
  });

  it("omite sameAs mientras no haya redes reales", () => {
    const schema = schemaAJson(legalServiceSchema());
    if ("sameAs" in schema) {
      expect(schema.sameAs.length).toBeGreaterThan(0);
    }
  });
});

describe("servicioSchema", () => {
  it("cuelga del @id del estudio", () => {
    const producto = getProductosPublicados()[0];
    const schema = schemaAJson(servicioSchema(producto));

    expect(schema["@type"]).toBe("Service");
    expect(schema.provider["@id"]).toBe(ESTUDIO_ID);
  });

  it("usa el resumen del producto como descripción", () => {
    const producto = getProductosPublicados()[0];
    const schema = schemaAJson(servicioSchema(producto));
    expect(schema.description).toBe(producto.seo!.resumen);
  });
});
