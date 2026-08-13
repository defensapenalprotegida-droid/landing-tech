import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetServicioParaPruebas,
  acceptAll,
  getConsent,
  getPreferences,
  hasConsent,
  hasResponded,
  rejectAll,
  resetConsent,
  setConsent,
  subscribe,
} from "./consentService";
import { CONSENT_STORAGE_KEY, readConsent } from "./storage";
import { CONSENT_VERSION } from "./categories";

beforeEach(() => {
  window.localStorage.clear();
  __resetServicioParaPruebas();
});

describe("visitante nuevo", () => {
  it("no tiene decisión guardada", () => {
    expect(hasResponded()).toBe(false);
    expect(getConsent()).toBeNull();
  });

  it("no consiente ninguna categoría opcional", () => {
    expect(hasConsent("functional")).toBe(false);
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });

  it("siempre permite las necesarias", () => {
    expect(hasConsent("necessary")).toBe(true);
  });
});

describe("aceptar todo", () => {
  it("guarda las tres categorías como aceptadas", () => {
    acceptAll();

    expect(hasConsent("functional")).toBe(true);
    expect(hasConsent("analytics")).toBe(true);
    expect(hasConsent("marketing")).toBe(true);
    expect(hasResponded()).toBe(true);
  });

  it("persiste con la versión y la marca de tiempo", () => {
    acceptAll();

    const guardado = readConsent();
    expect(guardado?.version).toBe(CONSENT_VERSION);
    expect(guardado?.necessary).toBe(true);
    expect(() => new Date(guardado!.timestamp).toISOString()).not.toThrow();
  });
});

describe("rechazar", () => {
  it("deja solo las necesarias", () => {
    rejectAll();

    expect(hasResponded()).toBe(true);
    expect(hasConsent("necessary")).toBe(true);
    expect(hasConsent("functional")).toBe(false);
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });
});

describe("configuración personalizada", () => {
  it("habilita únicamente lo elegido", () => {
    setConsent({ functional: true, analytics: false, marketing: false });

    expect(getPreferences()).toEqual({
      functional: true,
      analytics: false,
      marketing: false,
    });
  });
});

describe("visitante recurrente", () => {
  it("no vuelve a preguntar mientras el consentimiento sea válido", () => {
    setConsent({ functional: false, analytics: true, marketing: false });

    // Simula una recarga: el servicio olvida todo y relee el storage.
    __resetServicioParaPruebas();

    expect(hasResponded()).toBe(true);
    expect(hasConsent("analytics")).toBe(true);
  });
});

describe("cambio de CONSENT_VERSION", () => {
  it("descarta el consentimiento otorgado bajo otra versión", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: "version-antigua",
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );

    expect(hasResponded()).toBe(false);
    expect(hasConsent("analytics")).toBe(false);
  });
});

describe("almacenamiento inservible", () => {
  it("se comporta como primera visita si el contenido está corrupto", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{no es json");

    expect(hasResponded()).toBe(false);
  });

  it("se comporta como primera visita si faltan categorías", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        necessary: true,
        analytics: true,
        timestamp: new Date().toISOString(),
      })
    );

    expect(hasResponded()).toBe(false);
  });
});

describe("retirada de consentimiento", () => {
  it("pasar de aceptar a rechazar deja de autorizar", () => {
    acceptAll();
    expect(hasConsent("marketing")).toBe(true);

    rejectAll();
    expect(hasConsent("marketing")).toBe(false);
    expect(readConsent()?.marketing).toBe(false);
  });

  it("resetConsent devuelve al estado de primera visita", () => {
    acceptAll();
    resetConsent();

    expect(hasResponded()).toBe(false);
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
  });
});

describe("suscripción", () => {
  it("notifica el estado actual al suscribirse y en cada cambio", () => {
    const oyente = vi.fn();
    const desuscribir = subscribe(oyente);

    expect(oyente).toHaveBeenCalledWith(null);

    acceptAll();
    expect(oyente).toHaveBeenLastCalledWith(
      expect.objectContaining({ analytics: true })
    );

    desuscribir();
    rejectAll();
    expect(oyente).toHaveBeenCalledTimes(2);
  });
});
