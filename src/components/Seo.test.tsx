import { describe, expect, it } from "vitest";
import Seo from "./Seo";

describe("Seo", () => {
  it("acepta las props de imagen e indexación", () => {
    // El Head de vite-react-ssg no escribe al documento en pruebas, así que
    // esto verifica el contrato de props, no el HTML resultante. La
    // verificación real es contra dist/ en la Task 11.
    const elemento = (
      <Seo
        title="Prueba"
        description="Descripción"
        path="/prueba"
        image="/otra.png"
        noIndex
      />
    );
    expect(elemento.props.image).toBe("/otra.png");
    expect(elemento.props.noIndex).toBe(true);
  });
});
