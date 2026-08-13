/**
 * Borrado de cookies de terceros al retirar el consentimiento.
 *
 * Importante entender el límite: solo se pueden borrar cookies del propio
 * dominio y sus superdominios. Las que un tercero puso en su propio dominio
 * (por ejemplo `.doubleclick.net`) son inalcanzables desde acá; lo único que
 * está en nuestra mano es dejar de cargar el script que las crea.
 */

/** Nombre exacto o prefijo (`_ga` cubre `_ga_XXXX`). */
export type PatronCookie = string;

function dominiosCandidatos(hostname: string): string[] {
  const partes = hostname.split(".");
  const dominios: string[] = [];
  // arteagayaldunate.cl y .arteagayaldunate.cl, más los superdominios. Se
  // prueban todos porque no sabemos con qué `domain` la escribió el tercero, y
  // borrar una cookie exige acertar el par (domain, path) con el que se creó.
  for (let i = 0; i < partes.length - 1; i++) {
    const dominio = partes.slice(i).join(".");
    dominios.push(dominio, `.${dominio}`);
  }
  return dominios;
}

function nombresPresentes(patrones: PatronCookie[]): string[] {
  if (typeof document === "undefined" || !document.cookie) return [];
  const existentes = document.cookie
    .split(";")
    .map((par) => par.split("=")[0]?.trim())
    .filter((nombre): nombre is string => Boolean(nombre));

  return existentes.filter((nombre) =>
    patrones.some((patron) => nombre === patron || nombre.startsWith(patron))
  );
}

/**
 * Intenta eliminar las cookies que coincidan con los patrones dados.
 *
 * "Intenta" es literal: si una cookie es `HttpOnly` o pertenece a otro
 * dominio, esto no la toca y no hay forma de saberlo desde JavaScript.
 */
export function deleteCookies(patrones: PatronCookie[]): string[] {
  if (typeof document === "undefined" || patrones.length === 0) return [];

  const objetivo = nombresPresentes(patrones);
  if (objetivo.length === 0) return [];

  const expirado = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const rutas = ["/", window.location.pathname];
  const dominios = ["", ...dominiosCandidatos(window.location.hostname)];

  for (const nombre of objetivo) {
    for (const ruta of rutas) {
      for (const dominio of dominios) {
        const sufijoDominio = dominio ? `; domain=${dominio}` : "";
        document.cookie = `${nombre}=; ${expirado}; path=${ruta}${sufijoDominio}`;
      }
    }
  }

  return objetivo;
}
