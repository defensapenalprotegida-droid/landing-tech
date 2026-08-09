import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import PracticeAreas from "./PracticeAreas";
import { focusArea, consumePendingArea } from "@/lib/areaFocus";

// El panel de detalle vive dentro de un AnimatePresence con mode="wait", que
// en jsdom no completa la animación de salida, así que el intercambio no se
// observa. El estado real se lee en la lista lateral, donde el área abierta es
// la que tiene aria-expanded.
const areaAbierta = () => {
  const abierto = screen
    .getAllByRole("button", { expanded: true })
    .at(0);
  return abierto?.textContent ?? "";
};

describe("PracticeAreas — selección desde el menú", () => {
  afterEach(() => {
    cleanup();
    consumePendingArea(); // que no se filtre a otro test
  });

  it("abre Derecho Penal por defecto", () => {
    render(<PracticeAreas />);
    expect(areaAbierta()).toContain("Derecho Penal");
  });

  it("abre el área que se eligió en el menú, no siempre la primera", () => {
    render(<PracticeAreas />);

    act(() => focusArea("inmobiliario"));
    expect(areaAbierta()).toContain("Derecho Inmobiliario");

    act(() => focusArea("tributario"));
    expect(areaAbierta()).toContain("Derecho Tributario");
  });

  it("aplica el área elegida desde otra ruta, cuando la sección aún no existía", () => {
    // Simula el clic en el menú estando en /blog: no hay sección montada.
    focusArea("familia");

    // Al llegar al home, la sección se monta y debe abrir esa área.
    render(<PracticeAreas />);
    expect(areaAbierta()).toContain("Derecho de Familia");
  });

  it("no reabre un área pendiente ya consumida en un montaje posterior", () => {
    focusArea("laboral");
    render(<PracticeAreas />);
    expect(areaAbierta()).toContain("Derecho Laboral");

    cleanup();
    render(<PracticeAreas />);
    expect(areaAbierta()).toContain("Derecho Penal");
  });
});
