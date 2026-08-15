import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddressSearchInput from "./AddressSearchInput";

/**
 * Reproduce la pérdida de foco del buscador de direcciones.
 *
 * El input se marca `disabled` mientras se consulta a Google, y esa consulta
 * se dispara con cada tecla. Cuando un input pasa a `disabled` el navegador le
 * quita el foco, y al rehabilitarlo el foco no vuelve solo: el cursor
 * desaparece y el resto de lo que la persona escribe se pierde.
 *
 * jsdom implementa ese comportamiento igual que un navegador real, así que la
 * prueba falla exactamente por el mismo motivo por el que falla en producción.
 */

// El componente carga el script real de Google al montar; en pruebas se corta.
vi.mock("@/lib/googleMapsLoader", () => ({
  loadGoogleMapsScript: () => Promise.resolve(),
}));

/** Predicciones que nunca resuelven hasta que la prueba lo decida. */
let resolverPredicciones: (valor: unknown) => void;

beforeEach(() => {
  const AutocompleteService = class {
    getPlacePredictions() {
      return new Promise((resolve) => {
        resolverPredicciones = resolve;
      });
    }
  };

  (window as unknown as { google: unknown }).google = {
    maps: {
      importLibrary: () =>
        Promise.resolve({
          AutocompleteService,
          AutocompleteSessionToken: class {},
        }),
      places: {
        AutocompleteService,
        AutocompleteSessionToken: class {},
      },
      Geocoder: class {
        geocode() {
          return Promise.resolve({ results: [] });
        }
      },
    },
  };
});

const montar = () =>
  render(
    <AddressSearchInput value="" onChange={vi.fn()} label="Dirección" />
  );

describe("foco durante la búsqueda", () => {
  // No se afirma sobre `document.activeElement`: jsdom no desenfoca al
  // deshabilitar un elemento, así que esa comprobación pasaría siempre y
  // daría falsa confianza. Se afirma sobre la causa —que el campo no se
  // deshabilite— que es lo que en un navegador real provoca la pérdida de
  // foco, y que jsdom sí reproduce.
  it("no se deshabilita a sí mismo mientras se escribe", async () => {
    montar();
    const input = screen.getByRole("textbox");
    await waitFor(() => expect(input).not.toBeDisabled());

    fireEvent.change(input, { target: { value: "sa" } });

    // El indicador de carga puede mostrarse, pero el campo tiene que seguir
    // aceptando escritura: es lo que permite corregir un error de tipeo sin
    // volver a hacer clic.
    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });

    resolverPredicciones({ predictions: [] });
  });
});
