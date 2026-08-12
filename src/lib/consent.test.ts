import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildConsentRecord,
  CONSENT_TEXT,
  MARKETING_TEXT,
  PRIVACY_POLICY_VERSION,
} from "./consent";

describe("buildConsentRecord", () => {
  afterEach(() => vi.useRealTimers());

  it("deja constancia de qué se aceptó, cuándo y desde dónde", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T15:30:00.000Z"));

    const r = buildConsentRecord("hero_producto", false);

    expect(r.policyVersion).toBe(PRIVACY_POLICY_VERSION);
    expect(r.acceptedAt).toBe("2026-08-10T15:30:00.000Z");
    expect(r.source).toBe("hero_producto");
    // El texto literal viaja con el lead: el correo es el respaldo.
    expect(r.text).toBe(CONSENT_TEXT);
  });

  it("registra la autorización comercial solo cuando se otorgó", () => {
    const sin = buildConsentRecord("contacto", false);
    expect(sin.marketing).toBe(false);
    expect(sin.marketingText).toBeUndefined();

    const con = buildConsentRecord("contacto", true);
    expect(con.marketing).toBe(true);
    expect(con.marketingText).toBe(MARKETING_TEXT);
  });

  it("captura el instante del envío, no uno fijo", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T10:00:00.000Z"));
    const primero = buildConsentRecord("hero_legal", false);

    vi.setSystemTime(new Date("2026-08-10T10:05:00.000Z"));
    const segundo = buildConsentRecord("hero_legal", false);

    expect(primero.acceptedAt).not.toBe(segundo.acceptedAt);
  });

  it("el texto de consentimiento nombra al responsable y la finalidad", () => {
    // Si alguien reescribe el texto y lo deja genérico, el consentimiento
    // pierde el carácter específico que lo hace válido.
    expect(CONSENT_TEXT).toMatch(/Arteaga & Aldunate/);
    expect(CONSENT_TEXT).toMatch(/finalidad/i);
    expect(CONSENT_TEXT).toMatch(/Política de Privacidad/i);
  });

  it("la autorización comercial es separable de la consulta", () => {
    expect(MARKETING_TEXT).toMatch(/revocar/i);
    expect(MARKETING_TEXT).not.toMatch(/obligatorio/i);
  });
});
