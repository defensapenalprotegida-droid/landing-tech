/**
 * reCAPTCHA Enterprise en modo invisible: no muestra desafíos, solo genera un
 * token por envío que el servidor puede evaluar.
 *
 * La clave de sitio es pública por diseño — viaja en el HTML —, así que vivir
 * en el bundle no es una filtración. Lo secreto es la credencial del servidor.
 */
const SITE_KEY = "6Lcr_X0tAAAAAHwVugJ_3FfKkFFQoFl_znVgRP4U";

/** Acción declarada por formulario, para poder distinguirlos en las métricas. */
export const RECAPTCHA_ACTIONS = {
  heroLegal: "hero_legal",
  heroCorretaje: "hero_corretaje",
  contacto: "contacto",
} as const;

export type RecaptchaAction =
  (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS];

interface GrecaptchaEnterprise {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: { enterprise?: GrecaptchaEnterprise };
  }
}

/**
 * Devuelve un token para la acción indicada, o `undefined` si reCAPTCHA no
 * está disponible.
 *
 * Nunca lanza ni bloquea: el script es `async defer` y puede no haber cargado,
 * o estar bloqueado por una extensión o por la red corporativa del visitante.
 * En ese caso el formulario debe enviarse igual — perder un cliente real por
 * un antibot que no cargó es mucho peor que dejar pasar un spam.
 */
export async function getRecaptchaToken(
  action: RecaptchaAction
): Promise<string | undefined> {
  const enterprise = window.grecaptcha?.enterprise;
  if (!enterprise) return undefined;

  try {
    await new Promise<void>((resolve) => enterprise.ready(resolve));
    return await enterprise.execute(SITE_KEY, { action });
  } catch {
    return undefined;
  }
}
