/**
 * Consentimiento para el tratamiento de datos personales.
 *
 * El consentimiento no es un booleano: para que sirva como prueba hay que
 * poder mostrar QUÉ texto aceptó la persona, CUÁNDO y DESDE DÓNDE. Un `true`
 * suelto no acredita nada si alguien reclama.
 *
 * Por eso cada lead viaja con un `ConsentRecord` completo, incluido el texto
 * literal: así el correo que recibe el estudio ES el respaldo, sin depender de
 * ir a buscar qué decía la política en esa fecha.
 */

/**
 * Versión de la política de privacidad vigente.
 *
 * IMPORTANTE: al cambiar el texto de `/privacidad` hay que subir esta versión.
 * Es lo que permite saber, años después, qué aceptó exactamente cada persona.
 */
export const PRIVACY_POLICY_VERSION = "2026-08-10";

/** Formulario desde el que se otorgó el consentimiento. */
export const CONSENT_SOURCES = [
  "hero_legal",
  "hero_corretaje",
  "hero_producto",
  "contacto",
] as const;

export type ConsentSource = (typeof CONSENT_SOURCES)[number];

export const CONSENT_SOURCE_LABELS: Record<ConsentSource, string> = {
  hero_legal: "Formulario legal del hero",
  hero_corretaje: "Formulario de corretaje del hero",
  hero_producto: "Formulario de producto del hero",
  contacto: "Formulario de contacto",
};

/**
 * Texto que la persona acepta. Se envía junto con el lead, así que cambiarlo
 * obliga a subir `PRIVACY_POLICY_VERSION`.
 */
export const CONSENT_TEXT =
  "Autorizo a Arteaga & Aldunate Abogados y Asociados a tratar los datos " +
  "personales de este formulario, incluidos los antecedentes de mi caso, con " +
  "la finalidad de evaluar mi consulta y contactarme. He leído la Política de " +
  "Privacidad.";

/** Finalidad distinta y separable: no condiciona la respuesta a la consulta. */
export const MARKETING_TEXT =
  "Además, quiero recibir contenidos y novedades legales del estudio. " +
  "Puedo revocar esta autorización en cualquier momento.";

export const CONSENT_REQUIRED_MESSAGE =
  "Necesitamos tu autorización para tratar tus datos y poder responderte.";

export interface ConsentRecord {
  /** Versión de la política vigente al momento de aceptar. */
  policyVersion: string;
  /** Instante de la aceptación, en ISO 8601 UTC. */
  acceptedAt: string;
  /** Formulario de origen. */
  source: ConsentSource;
  /** Texto literal que se mostró y se aceptó. */
  text: string;
  /** Autorización separada para comunicaciones comerciales. */
  marketing: boolean;
  /** Texto de la autorización comercial, solo si se otorgó. */
  marketingText?: string;
}

/** Construye el registro probatorio en el momento del envío. */
export function buildConsentRecord(
  source: ConsentSource,
  marketing: boolean
): ConsentRecord {
  return {
    policyVersion: PRIVACY_POLICY_VERSION,
    acceptedAt: new Date().toISOString(),
    source,
    text: CONSENT_TEXT,
    marketing,
    ...(marketing ? { marketingText: MARKETING_TEXT } : {}),
  };
}
