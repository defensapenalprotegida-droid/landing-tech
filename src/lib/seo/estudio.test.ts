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

  it("las redes son URLs canónicas, sin parámetros de tracking", () => {
    // Un sameAs con "#" o con ?utm_source= es peor que omitirlo: el buscador
    // compara la URL exacta para confirmar la entidad.
    expect(ESTUDIO.redes.length).toBeGreaterThan(0);
    for (const red of ESTUDIO.redes) {
      expect(red.url).toMatch(/^https:\/\//);
      expect(red.url).not.toMatch(/[?&]/);
    }
  });

  it("declara las áreas de práctica", () => {
    expect(ESTUDIO.areas).toContain("Derecho Penal");
    expect(ESTUDIO.areas.length).toBe(7);
  });
});
