import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("descripción de la home", () => {
  it("describe el estudio como integral, no solo penal", () => {
    // Google ya describe al estudio como integral, sacando el dato de
    // Instagram. La fuente canónica tiene que ser el sitio.
    const fuente = readFileSync("src/pages/Index.tsx", "utf8");
    const descripcion = fuente.match(/description="([^"]+)"/)?.[1] ?? "";

    expect(descripcion).toMatch(/laboral/i);
    expect(descripcion).toMatch(/familia/i);
  });

  it("enlaza los servicios publicados desde la home", () => {
    const fuente = readFileSync("src/pages/Index.tsx", "utf8");
    expect(fuente).toContain("ServiciosDestacados");
  });
});
