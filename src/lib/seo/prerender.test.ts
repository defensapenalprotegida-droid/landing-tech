import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Estas pruebas leen dist/ y exigen un build previo.
 *
 * Se saltan si dist/ no existe, para no romper el ciclo rápido de pruebas de
 * quien está desarrollando. En CI hay que correr `npm run build` antes.
 */
const hayBuild = existsSync("dist/index.html");
const suite = hayBuild ? describe : describe.skip;

const html = (ruta: string) => readFileSync(`dist/${ruta}`, "utf8");

const jsonLdDe = (contenido: string) =>
  // react-helmet-async (usado por el `Head` de vite-react-ssg) marca cada tag
  // que renderiza con `data-rh="true"` antes de los demás atributos, así que
  // el <script> no llega desnudo: hay que tolerar atributos extra antes de
  // `type`, no solo el `type="application/ld+json"` exacto.
  [...contenido.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
  )].map((m) => JSON.parse(m[1]));

suite("datos estructurados en el HTML estático", () => {
  it("la home emite el LegalService con el @id canónico", () => {
    const schemas = jsonLdDe(html("index.html"));
    const estudio = schemas.find((s) => s["@type"] === "LegalService");

    expect(estudio).toBeDefined();
    expect(estudio["@id"]).toBe("https://arteagayaldunate.cl/#estudio");
    expect(estudio.address.addressLocality).toBe("Santiago");
  });

  it("la página de servicio emite Service, FAQPage y BreadcrumbList", () => {
    const schemas = jsonLdDe(html("servicios/cobra-tu-pension.html"));
    const tipos = schemas.map((s) => s["@type"]);

    expect(tipos).toContain("Service");
    expect(tipos).toContain("FAQPage");
    expect(tipos).toContain("BreadcrumbList");
  });

  it("el servicio se atribuye a la misma entidad del estudio", () => {
    const schemas = jsonLdDe(html("servicios/cobra-tu-pension.html"));
    const servicio = schemas.find((s) => s["@type"] === "Service");

    expect(servicio.provider["@id"]).toBe(
      "https://arteagayaldunate.cl/#estudio"
    );
  });

  it("ninguna página emite calificaciones", () => {
    for (const ruta of ["index.html", "servicios/cobra-tu-pension.html"]) {
      expect(html(ruta)).not.toContain("AggregateRating");
    }
  });

  it("todas las páginas declaran el canónico sin www", () => {
    for (const ruta of ["index.html", "servicios/cobra-tu-pension.html"]) {
      expect(html(ruta)).toContain('rel="canonical"');
      expect(html(ruta)).not.toContain("www.arteagayaldunate.cl");
    }
  });

  it("el resumen citable está en el HTML, no solo en el schema", () => {
    // Si el texto solo viviera en el JSON-LD, un modelo que lee el cuerpo de
    // la página no lo encontraría.
    const contenido = html("servicios/cobra-tu-pension.html");
    expect(contenido).toContain("mérito ejecutivo");
  });
});
