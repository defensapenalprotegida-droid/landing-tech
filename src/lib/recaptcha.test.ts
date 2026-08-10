import { describe, it, expect, vi, afterEach } from "vitest";
import { getRecaptchaToken, RECAPTCHA_ACTIONS } from "./recaptcha";

const conGrecaptcha = (
  execute: (siteKey: string, opts: { action: string }) => Promise<string>
) => {
  (window as unknown as Record<string, unknown>).grecaptcha = {
    enterprise: {
      ready: (cb: () => void) => cb(),
      execute,
    },
  };
};

describe("getRecaptchaToken", () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).grecaptcha;
    vi.restoreAllMocks();
  });

  it("devuelve el token y declara la acción del formulario", async () => {
    const execute = vi.fn().mockResolvedValue("token-abc");
    conGrecaptcha(execute);

    const token = await getRecaptchaToken(RECAPTCHA_ACTIONS.contacto);

    expect(token).toBe("token-abc");
    expect(execute).toHaveBeenCalledWith(expect.any(String), {
      action: "contacto",
    });
  });

  // Los tres casos siguientes son el mismo compromiso: si el antibot no está
  // disponible, el formulario debe poder enviarse igual. Perder un cliente
  // real pesa más que dejar pasar un spam.
  it("no rompe si el script no cargó", async () => {
    expect(await getRecaptchaToken(RECAPTCHA_ACTIONS.heroLegal)).toBeUndefined();
  });

  it("no rompe si execute falla", async () => {
    conGrecaptcha(vi.fn().mockRejectedValue(new Error("bloqueado por la red")));
    expect(
      await getRecaptchaToken(RECAPTCHA_ACTIONS.heroCorretaje)
    ).toBeUndefined();
  });

  it("no rompe si grecaptcha existe pero sin enterprise", async () => {
    (window as unknown as Record<string, unknown>).grecaptcha = {};
    expect(await getRecaptchaToken(RECAPTCHA_ACTIONS.contacto)).toBeUndefined();
  });
});
