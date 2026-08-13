import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { legalServiceSchema } from "@/lib/seo/schema/organizacion";

describe("entidad del estudio", () => {
  it("el schema del estudio es válido y único", () => {
    // El Layout usa el Head de vite-react-ssg, que en pruebas no escribe al
    // documento. Lo que sí se puede verificar aquí es que el schema que el
    // Layout emite esté bien formado; que llegue al HTML se comprueba en la
    // Task 11, contra dist/.
    const schema = legalServiceSchema();
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
    expect(schema["@id"]).toBe("https://arteagayaldunate.cl/#estudio");
  });

  it("el Layout monta sin romper", async () => {
    const { default: Layout } = await import("./Layout");
    // Head (Helmet) necesita un HelmetProvider ancestro; en la app real lo
    // monta vite-react-ssg, así que en la prueba hay que proveerlo a mano.
    expect(() =>
      render(
        <HelmetProvider>
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        </HelmetProvider>
      )
    ).not.toThrow();
  });
});
