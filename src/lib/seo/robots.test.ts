import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const robots = () => readFileSync("public/robots.txt", "utf8");

describe("robots.txt", () => {
  it("declara explícitamente los rastreadores de IA", () => {
    // `User-agent: *` ya los cubriría, pero declararlos quita toda ambigüedad.
    // Google-Extended es en concreto el que gobierna la inclusión en AI
    // Overviews, y su ausencia es la que suele dejar un sitio fuera.
    for (const bot of [
      "Google-Extended",
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "ClaudeBot",
      "PerplexityBot",
    ]) {
      expect(robots()).toContain(`User-agent: ${bot}`);
    }
  });

  it("apunta al sitemap en el dominio canónico", () => {
    expect(robots()).toContain(
      "Sitemap: https://arteagayaldunate.cl/sitemap.xml"
    );
    expect(robots()).not.toContain("www.arteagayaldunate.cl");
  });

  it("no bloquea a nadie", () => {
    expect(robots()).not.toMatch(/^Disallow: \/$/m);
  });
});
