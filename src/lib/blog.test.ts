import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog loader", () => {
  it("carga los 3 artículos semilla", () => {
    expect(getAllPosts().length).toBeGreaterThanOrEqual(3);
  });
  it("ordena por fecha descendente", () => {
    const posts = getAllPosts();
    expect(posts[0].date >= posts[1].date).toBe(true);
  });
  it("obtiene un post por slug con contenido", () => {
    const post = getPostBySlug("citado-a-declarar");
    expect(post?.title).toContain("Diferencias entre ser testigo");
    expect(post?.content.length).toBeGreaterThan(0);
    expect(post?.category).toBe("Derecho Penal");
  });
  it("cada artículo publicado tiene imagen de portada existente y alt", () => {
    for (const p of getAllPosts()) {
      expect(p.image, p.slug).toMatch(/^\/blog\/.+\.webp$/);
      expect(existsSync(`public${p.image}`), p.image).toBe(true);
      expect(p.imageAlt, p.slug).toBeTruthy();
    }
  });
  it("devuelve undefined para slug inexistente", () => {
    expect(getPostBySlug("no-existe")).toBeUndefined();
  });
});
