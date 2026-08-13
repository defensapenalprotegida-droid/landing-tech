import { describe, expect, it } from "vitest";
import {
  getAllProductos,
  getProductoBySlug,
  getProductosPublicados,
} from "./productosJuridicos";

describe("publicación por tandas", () => {
  it("solo publica productos con bloque seo completo", () => {
    // Un producto sin `seo` no puede generar ruta: una página sin contenido
    // revisado posiciona peor que no existir.
    for (const producto of getProductosPublicados()) {
      expect(producto.seo).toBeDefined();
      expect(producto.seo!.slug).toBeTruthy();
      expect(producto.seo!.resumen.length).toBeGreaterThan(80);
      expect(producto.seo!.faq.length).toBeGreaterThan(0);
    }
  });

  it("no publica productos marcados como no revisados", () => {
    const sinRevisar = getAllProductos().filter(
      (p) => p.seo && p.seo.revisadoPorAbogado === false
    );
    const slugsPublicados = getProductosPublicados().map((p) => p.seo!.slug);

    for (const producto of sinRevisar) {
      expect(slugsPublicados).not.toContain(producto.seo!.slug);
    }
  });

  it("los slugs publicados son únicos", () => {
    const slugs = getProductosPublicados().map((p) => p.seo!.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProductoBySlug", () => {
  it("encuentra un producto publicado por su slug", () => {
    const producto = getProductoBySlug("cobra-tu-pension");
    expect(producto?.id).toBe("cobra-pension");
  });

  it("devuelve undefined para un slug inexistente", () => {
    expect(getProductoBySlug("no-existe")).toBeUndefined();
  });
});
