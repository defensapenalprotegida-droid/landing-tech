import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getAllPostsIncludingDrafts,
  getCategories,
  getRelatedPosts,
} from "./blog";
import { TEAM } from "./team";

describe("motor del blog", () => {
  it("no publica los borradores", () => {
    const publicados = getAllPosts();
    expect(publicados.every((p) => !p.draft)).toBe(true);

    // Un artículo jurídico sin revisar no debe llegar a un cliente: los
    // borradores existen en el repositorio pero quedan fuera del sitio.
    const borradores = getAllPostsIncludingDrafts().filter((p) => p.draft);
    for (const b of borradores) {
      expect(publicados.find((p) => p.slug === b.slug)).toBeUndefined();
    }
  });

  it("los artículos ya publicados no se convierten en borradores por omisión", () => {
    // Los .md existentes no traen el campo `draft`; si el parser lo
    // interpretara mal, el blog se vaciaría de golpe.
    expect(getAllPosts().length).toBeGreaterThan(0);
  });

  it("agrupa por categoría para armar los clusters", () => {
    const categorias = getCategories();
    expect(categorias.length).toBeGreaterThan(0);

    const totalPorCategoria = categorias.reduce((n, c) => n + c.count, 0);
    expect(totalPorCategoria).toBe(getAllPosts().length);
  });

  it("relaciona primero los de la misma categoría", () => {
    const posts = getAllPosts();
    const conHermanos = posts.find(
      (p) => posts.filter((o) => o.category === p.category).length > 1
    );
    if (!conHermanos) return; // aún no hay dos de la misma categoría

    const relacionados = getRelatedPosts(conHermanos.slug);
    expect(relacionados[0].category).toBe(conHermanos.category);
  });

  it("nunca se relaciona un artículo consigo mismo", () => {
    for (const p of getAllPosts()) {
      expect(getRelatedPosts(p.slug).some((r) => r.slug === p.slug)).toBe(false);
    }
  });

  it("el autor y el revisor deben existir en el equipo", () => {
    // Una firma que no corresponde a nadie del estudio destruye justamente la
    // confianza que la autoría busca construir.
    const nombres = TEAM.map((m) => m.name);
    for (const p of getAllPostsIncludingDrafts()) {
      if (p.author && p.author !== "Arteaga & Aldunate") {
        expect(nombres).toContain(p.author);
      }
      if (p.reviewer) expect(nombres).toContain(p.reviewer);
    }
  });

  it("la fecha de actualización nunca es anterior a la de publicación", () => {
    for (const p of getAllPostsIncludingDrafts()) {
      if (p.updated) expect(p.updated >= p.date).toBe(true);
    }
  });
});
