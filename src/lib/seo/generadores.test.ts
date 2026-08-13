import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { getProductosPublicados } from "@/lib/productosJuridicos";

beforeAll(() => {
  execFileSync("node", ["scripts/generate-sitemap.mjs"], { stdio: "pipe" });
  execFileSync("node", ["scripts/generate-llms.mjs"], { stdio: "pipe" });
});

describe("sitemap", () => {
  it("incluye cada producto publicado", () => {
    const xml = readFileSync("public/sitemap.xml", "utf8");
    for (const producto of getProductosPublicados()) {
      expect(xml).toContain(
        `https://arteagayaldunate.cl/servicios/${producto.seo!.slug}`
      );
    }
  });
});

describe("llms.txt", () => {
  it("describe el estudio y enlaza los servicios", () => {
    const texto = readFileSync("public/llms.txt", "utf8");

    expect(texto).toContain("# Arteaga & Aldunate");
    for (const producto of getProductosPublicados()) {
      expect(texto).toContain(`/servicios/${producto.seo!.slug}`);
    }
  });

  it("incluye el resumen de cada servicio, que es lo citable", () => {
    const texto = readFileSync("public/llms.txt", "utf8");
    const producto = getProductosPublicados()[0];
    expect(texto).toContain(producto.seo!.resumen);
  });
});
