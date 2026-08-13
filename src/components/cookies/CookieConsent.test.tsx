import { beforeEach, describe, expect, it } from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CookieConsent from "./CookieConsent";
import {
  __resetServicioParaPruebas,
  acceptAll,
  getPreferences,
  hasResponded,
} from "@/lib/cookies/consentService";
import { openCookiePreferences } from "@/lib/cookies/preferencesBus";

const montar = () =>
  render(
    <MemoryRouter>
      <CookieConsent />
    </MemoryRouter>
  );

/** El banner solo aparece tras hidratar, así que siempre hay que esperarlo. */
const esperarBanner = () =>
  screen.findByRole("dialog", { name: /valoramos tu privacidad/i });

beforeEach(() => {
  window.localStorage.clear();
  __resetServicioParaPruebas();
});

describe("primera visita", () => {
  it("muestra el banner", async () => {
    montar();
    expect(await esperarBanner()).toBeInTheDocument();
  });

  it("enlaza la política de cookies", async () => {
    montar();
    await esperarBanner();

    expect(
      screen.getByRole("link", { name: /política de cookies/i })
    ).toHaveAttribute("href", "/cookies");
  });
});

describe("aceptar todo", () => {
  it("guarda las tres categorías y cierra", async () => {
    montar();
    await esperarBanner();

    fireEvent.click(screen.getByRole("button", { name: "Aceptar todo" }));

    expect(getPreferences()).toEqual({
      functional: true,
      analytics: true,
      marketing: true,
    });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});

describe("rechazar", () => {
  it("deja solo las necesarias y cierra", async () => {
    montar();
    await esperarBanner();

    fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));

    expect(hasResponded()).toBe(true);
    expect(getPreferences()).toEqual({
      functional: false,
      analytics: false,
      marketing: false,
    });
  });
});

describe("centro de preferencias", () => {
  it("los toggles opcionales arrancan apagados", async () => {
    montar();
    await esperarBanner();
    fireEvent.click(screen.getByRole("button", { name: "Configurar" }));

    for (const nombre of [/funcionales/i, /analítica/i, /marketing/i]) {
      expect(screen.getByRole("switch", { name: nombre })).toHaveAttribute(
        "aria-checked",
        "false"
      );
    }
  });

  it("las cookies necesarias no tienen interruptor", async () => {
    montar();
    await esperarBanner();
    fireEvent.click(screen.getByRole("button", { name: "Configurar" }));

    expect(screen.getAllByRole("switch")).toHaveLength(3);
    expect(screen.getByText("Siempre activas")).toBeInTheDocument();
  });

  it("guarda únicamente las categorías activadas", async () => {
    montar();
    await esperarBanner();
    fireEvent.click(screen.getByRole("button", { name: "Configurar" }));
    fireEvent.click(screen.getByRole("switch", { name: /analítica/i }));
    fireEvent.click(
      screen.getByRole("button", { name: "Guardar preferencias" })
    );

    expect(getPreferences()).toEqual({
      functional: false,
      analytics: true,
      marketing: false,
    });
  });
});

describe("visitante recurrente", () => {
  it("no muestra el banner si ya decidió", async () => {
    acceptAll();
    montar();

    // Se le da margen a la hidratación: si el banner fuera a salir, saldría acá.
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("puede reabrir el centro de preferencias desde fuera", async () => {
    acceptAll();
    montar();
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );

    // Se dispara fuera de React (lo hace el footer), asi que hay que dejar
    // que el re-render ocurra dentro de act.
    act(() => openCookiePreferences());

    const modal = await screen.findByRole("dialog", {
      name: /preferencias de privacidad/i,
    });
    // Refleja lo ya aceptado, no el estado por defecto.
    expect(
      within(modal).getByRole("switch", { name: /analítica/i })
    ).toHaveAttribute("aria-checked", "true");
  });
});

describe("cerrar con la X", () => {
  it("equivale a rechazar cuando aún no hay decisión", async () => {
    montar();
    await esperarBanner();

    fireEvent.click(
      screen.getByRole("button", { name: /cerrar y continuar/i })
    );

    expect(hasResponded()).toBe(true);
    expect(getPreferences().analytics).toBe(false);
  });

  it("no altera una decisión previa al reabrir desde el footer", async () => {
    acceptAll();
    montar();
    // Se dispara fuera de React (lo hace el footer), asi que hay que dejar
    // que el re-render ocurra dentro de act.
    act(() => openCookiePreferences());
    await screen.findByRole("dialog", { name: /preferencias de privacidad/i });

    fireEvent.click(
      screen.getByRole("button", { name: /cerrar y continuar/i })
    );

    expect(getPreferences().analytics).toBe(true);
  });
});
