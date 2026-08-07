import { describe, it, expect } from "vitest";
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
    expect(post?.title).toContain("citan a declarar");
    expect(post?.content.length).toBeGreaterThan(0);
    expect(post?.category).toBe("Derecho Penal");
  });
  it("devuelve undefined para slug inexistente", () => {
    expect(getPostBySlug("no-existe")).toBeUndefined();
  });
});
