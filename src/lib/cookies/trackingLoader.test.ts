import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetTrackingParaPruebas,
  initTracking,
  registerProvider,
} from "./trackingLoader";
import {
  __resetServicioParaPruebas,
  acceptAll,
  rejectAll,
  setConsent,
} from "./consentService";

beforeEach(() => {
  window.localStorage.clear();
  __resetTrackingParaPruebas();
  __resetServicioParaPruebas();
  delete window.dataLayer;
  delete window.gtag;
});

describe("bloqueo previo", () => {
  it("no carga ningún proveedor sin consentimiento", () => {
    const cargar = vi.fn();
    registerProvider({ id: "ga", category: "analytics", load: cargar });

    initTracking();

    expect(cargar).not.toHaveBeenCalled();
  });

  it("deja los permisos de Google en denied antes de cualquier decisión", () => {
    initTracking();

    const porDefecto = window.dataLayer?.find(
      (entrada) => Array.isArray(entrada) && entrada[1] === "default"
    ) as unknown[] | undefined;

    expect(porDefecto?.[2]).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });
});

describe("carga tras el consentimiento", () => {
  it("carga solo los proveedores de las categorías autorizadas", () => {
    const analitica = vi.fn();
    const marketing = vi.fn();
    registerProvider({ id: "ga", category: "analytics", load: analitica });
    registerProvider({ id: "px", category: "marketing", load: marketing });

    initTracking();
    setConsent({ functional: false, analytics: true, marketing: false });

    expect(analitica).toHaveBeenCalledTimes(1);
    expect(marketing).not.toHaveBeenCalled();
  });

  it("no vuelve a cargar un proveedor ya cargado", () => {
    const cargar = vi.fn();
    registerProvider({ id: "ga", category: "analytics", load: cargar });

    initTracking();
    acceptAll();
    acceptAll();

    expect(cargar).toHaveBeenCalledTimes(1);
  });
});

describe("retirada de consentimiento", () => {
  it("llama a unload y borra las cookies declaradas", () => {
    document.cookie = "_ga_TEST=abc; path=/";
    const descargar = vi.fn();
    registerProvider({
      id: "ga",
      category: "analytics",
      load: vi.fn(),
      unload: descargar,
      cookies: ["_ga"],
    });

    initTracking();
    acceptAll();
    rejectAll();

    expect(descargar).toHaveBeenCalledTimes(1);
    expect(document.cookie).not.toContain("_ga_TEST");
  });

  it("actualiza los permisos de Google a denied", () => {
    initTracking();
    acceptAll();
    rejectAll();

    const ultimo = window.dataLayer?.at(-1) as unknown[] | undefined;
    expect(ultimo?.[1]).toBe("update");
    expect(ultimo?.[2]).toMatchObject({ analytics_storage: "denied" });
  });
});
