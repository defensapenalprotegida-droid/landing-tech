/**
 * Categorías de cookies y versión del consentimiento.
 *
 * Ojo: esto NO es lo mismo que `src/lib/consent.ts`. Aquel registra el
 * consentimiento de tratamiento de datos que la persona da al enviar un
 * formulario (prueba documental que viaja con el lead). Esto de acá es el
 * consentimiento de cookies/tecnologías de seguimiento del navegador. Son
 * finalidades distintas, con almacenamiento y ciclo de vida distintos, y
 * mezclarlas haría imposible acreditar cualquiera de las dos.
 */

/**
 * Versión del consentimiento de cookies vigente.
 *
 * CÓMO CAMBIARLA: editar este string (formato fecha ISO corta). Al desplegar,
 * todo consentimiento guardado con una versión distinta se considera caducado
 * y el banner vuelve a aparecer para todo el mundo.
 *
 * CUÁNDO CAMBIARLA: al incorporar un proveedor nuevo, al cambiar la finalidad
 * de una categoría, o al modificar sustantivamente la Política de Cookies.
 * NO hace falta subirla por correcciones de redacción que no alteren qué se
 * trata ni para qué.
 */
export const CONSENT_VERSION = "2026-08-12";

/** Categorías que la persona puede activar o desactivar. */
export const OPTIONAL_CATEGORIES = [
  "functional",
  "analytics",
  "marketing",
] as const;

export type OptionalCategory = (typeof OPTIONAL_CATEGORIES)[number];

/** Todas las categorías, incluida la que no es negociable. */
export type ConsentCategory = "necessary" | OptionalCategory;

/** Elección de la persona sobre las categorías opcionales. */
export type CookiePreferences = Record<OptionalCategory, boolean>;

/**
 * Estado inicial y también el resultado de rechazar.
 *
 * Privacidad por defecto: lo que no se autorizó expresamente está denegado.
 * Este objeto se congela porque se usa como valor por defecto en varios sitios
 * y una mutación accidental convertiría el "denegado" en "aceptado" global.
 */
export const DENY_ALL: CookiePreferences = Object.freeze({
  functional: false,
  analytics: false,
  marketing: false,
});

export const ALLOW_ALL: CookiePreferences = Object.freeze({
  functional: true,
  analytics: true,
  marketing: true,
});

export interface CategoryInfo {
  id: ConsentCategory;
  title: string;
  description: string;
  /** Las necesarias no se pueden desactivar. */
  alwaysOn: boolean;
}

/** Texto que se muestra en el centro de preferencias y en /cookies. */
export const CATEGORIES: readonly CategoryInfo[] = [
  {
    id: "necessary",
    title: "Cookies estrictamente necesarias",
    description:
      "Permiten funciones esenciales como seguridad, navegación y funcionamiento básico del sitio.",
    alwaysOn: true,
  },
  {
    id: "functional",
    title: "Cookies funcionales",
    description:
      "Permiten recordar determinadas preferencias y mejorar funcionalidades del sitio.",
    alwaysOn: false,
  },
  {
    id: "analytics",
    title: "Cookies de analítica",
    description:
      "Nos ayudan a comprender cómo se utiliza el sitio mediante información estadística y agregada.",
    alwaysOn: false,
  },
  {
    id: "marketing",
    title: "Cookies de marketing",
    description:
      "Pueden utilizarse para medir campañas o mostrar contenido y publicidad relevante.",
    alwaysOn: false,
  },
] as const;
