// src/lib/productosJuridicos.test.ts

import { describe, it, expect } from "vitest";
import {
  PRODUCTOS_JURIDICOS,
  PRODUCTOS_LIST,
  PRODUCTO_TO_AREA,
  getProducto,
  getAllProductos,
} from "@/lib/productosJuridicos";

describe("productosJuridicos", () => {
  it("debe exportar exactamente 12 productos", () => {
    expect(PRODUCTOS_LIST).toHaveLength(12);
    expect(Object.keys(PRODUCTOS_JURIDICOS)).toHaveLength(12);
  });

  it("getProducto debe retornar el producto correcto", () => {
    const producto = getProducto("recupera-casa");
    expect(producto).toBeDefined();
    expect(producto?.nombre).toBe("Recupera tu Casa");
    expect(producto?.emoji).toBe("🏠");
  });

  it("getProducto debe retornar undefined para producto inválido", () => {
    const producto = getProducto("producto-inexistente" as any);
    expect(producto).toBeUndefined();
  });

  it("getAllProductos debe retornar array de 12 productos", () => {
    const productos = getAllProductos();
    expect(productos).toHaveLength(12);
    expect(productos.every((p) => p.id && p.nombre && p.emoji)).toBe(true);
  });

  it("cada producto debe tener estructura válida", () => {
    getAllProductos().forEach((producto) => {
      expect(producto.id).toBeDefined();
      expect(producto.nombre).toBeDefined();
      expect(producto.emoji).toBeDefined();
      expect(producto.eyebrow).toBeDefined();
      expect(producto.title).toBeDefined();
      expect(producto.description).toBeDefined();
      expect(producto.image).toBeDefined();
      expect(producto.backendArea).toBeDefined();
      expect(Array.isArray(producto.campos)).toBe(true);
      expect(producto.placeholder).toBeDefined();
      expect(producto.cta).toBeDefined();
      expect(producto.whatsappMessage).toBeDefined();
    });
  });

  it("cada producto debe mapear a un área válida", () => {
    PRODUCTOS_LIST.forEach((productoId) => {
      expect(PRODUCTO_TO_AREA[productoId]).toBeDefined();
      const area = PRODUCTO_TO_AREA[productoId];
      expect(["penal", "civil", "laboral", "familia", "corporativo", "inmobiliario", "tributario"]).toContain(
        area
      );
    });
  });

  it("campos dinámicos deben tener estructura válida", () => {
    getAllProductos().forEach((producto) => {
      producto.campos.forEach((campo) => {
        expect(campo.name).toBeDefined();
        expect(campo.type).toBeDefined();
        expect(campo.label).toBeDefined();
        expect(typeof campo.required).toBe("boolean");
      });
    });
  });

  it("recupera-casa debe tener campos específicos", () => {
    const recuperaCasa = getProducto("recupera-casa");
    const campoNames = recuperaCasa?.campos.map((c) => c.name);
    expect(campoNames).toContain("tieneContrato");
    expect(campoNames).toContain("mesesMora");
    expect(campoNames).toContain("montoTotal");
    expect(campoNames).toContain("direccionPropiedad");
  });

  it("cobra-deuda debe tener campos específicos", () => {
    const cobraDeuda = getProducto("cobra-deuda");
    const campoNames = cobraDeuda?.campos.map((c) => c.name);
    expect(campoNames).toContain("tipoDocumento");
    expect(campoNames).toContain("montoDeuda");
    expect(campoNames).toContain("nombreDeudor");
  });
});
