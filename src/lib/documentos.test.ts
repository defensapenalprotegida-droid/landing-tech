import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import {
  getDocumentos,
  getDocumentoByArchivo,
  getDocumentoBySlug,
  urlDescarga,
} from "./documentos";

describe("documentos descargables", () => {
  const docs = getDocumentos();

  it("cada documento apunta a un archivo que existe en public/", () => {
    for (const d of docs) {
      expect(existsSync(`public/planillasparapaginaweb/${d.archivo}`), d.archivo).toBe(true);
    }
  });

  it("los slugs son únicos y aptos para URL", () => {
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("cada documento tiene el contenido mínimo para indexarse", () => {
    for (const d of docs) {
      expect(d.metaTitle.length, d.slug).toBeLessThanOrEqual(70);
      expect(d.metaDescription.length, d.slug).toBeGreaterThan(80);
      expect(d.resumen.length, d.slug).toBeGreaterThan(100);
      expect(d.faq.length, d.slug).toBeGreaterThan(0);
    }
  });

  it("resuelve por slug y por archivo", () => {
    expect(getDocumentoBySlug("poder-simple")?.archivo).toBe("PAGINA_Poder_Simple.docx");
    expect(getDocumentoByArchivo("PAGINA_Poder_Simple.docx")?.slug).toBe("poder-simple");
    expect(urlDescarga(getDocumentoBySlug("poder-simple")!)).toBe(
      "/planillasparapaginaweb/PAGINA_Poder_Simple.docx"
    );
  });
});
