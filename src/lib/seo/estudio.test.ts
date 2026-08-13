import { describe, expect, it } from "vitest";
import { ESTUDIO, ESTUDIO_ID, SITE } from "./estudio";

describe("identidad del estudio", () => {
  it("usa el dominio canónico sin www", () => {
    expect(SITE).toBe("https://arteagayaldunate.cl");
    expect(ESTUDIO_ID).toBe("https://arteagayaldunate.cl/#estudio");
  });

  it("tiene el NAP completo", () => {
    expect(ESTUDIO.nombre).toBeTruthy();
    expect(ESTUDIO.telefono).toMatch(/^\+56/);
    expect(ESTUDIO.direccion.calle).toBeTruthy();
    expect(ESTUDIO.direccion.ciudad).toBe("Santiago");
    expect(ESTUDIO.direccion.pais).toBe("CL");
  });

  it("no expone redes con href de relleno", () => {
    // El footer las tiene como "#". Un sameAs con "#" es peor que omitirlo:
    // le pide al buscador que confíe en un enlace roto.
    for (const url of ESTUDIO.redes) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("declara las áreas de práctica", () => {
    expect(ESTUDIO.areas).toContain("Derecho Penal");
    expect(ESTUDIO.areas.length).toBe(7);
  });
});
