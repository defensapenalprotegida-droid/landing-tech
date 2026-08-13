import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Servicio from "./Servicio";
import { getProductosPublicados } from "@/lib/productosJuridicos";
import { HeroCarouselProvider } from "@/contexts/HeroCarouselContext";

// Head (Helmet) necesita un HelmetProvider ancestro y Header necesita
// HeroCarouselProvider; en la app real ambos los monta Layout, así que en la
// prueba hay que proveerlos a mano (ver Layout.test.tsx).
const montar = (slug: string) =>
  render(
    <HelmetProvider>
      <HeroCarouselProvider>
        <MemoryRouter initialEntries={[`/servicios/${slug}`]}>
          <Routes>
            <Route path="/servicios/:slug" element={<Servicio />} />
          </Routes>
        </MemoryRouter>
      </HeroCarouselProvider>
    </HelmetProvider>
  );

describe("página de servicio", () => {
  it("muestra el H1 y el resumen del producto", () => {
    const producto = getProductosPublicados()[0];
    montar(producto.seo!.slug);

    expect(
      screen.getByRole("heading", { level: 1, name: producto.seo!.h1 })
    ).toBeInTheDocument();
    expect(screen.getByText(producto.seo!.resumen)).toBeInTheDocument();
  });

  it("muestra las preguntas frecuentes", () => {
    const producto = getProductosPublicados()[0];
    montar(producto.seo!.slug);

    expect(screen.getByText(producto.seo!.faq[0].q)).toBeInTheDocument();
  });

  it("muestra el 404 para un producto no publicado", () => {
    montar("slug-inexistente");
    expect(screen.getByText(/no encontrada/i)).toBeInTheDocument();
  });
});
