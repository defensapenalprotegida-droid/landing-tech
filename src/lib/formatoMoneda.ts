/**
 * Montos en pesos chilenos para los formularios.
 *
 * Sin formato, el campo mostraba `89899080980`: ilegible, y con un dígito de
 * más nadie lo nota. Los separadores hacen visible el error mientras se
 * escribe, que es cuando se puede corregir.
 *
 * Se trabaja siempre sobre dígitos: el estado del formulario guarda el número
 * limpio y el formato es solo presentación, así que nunca se envía un monto
 * con puntos que luego haya que interpretar.
 */

/** Deja únicamente los dígitos de un texto escrito o pegado. */
export function soloDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

/**
 * Escribe el monto como se lee en Chile: `$1.234.567`.
 *
 * Devuelve vacío cuando no hay monto, incluido el caso de solo ceros: un "$"
 * suelto en un campo vacío se lee como un fallo de la página.
 */
export function formatearPesos(valor: string | number): string {
  const digitos = soloDigitos(String(valor)).replace(/^0+/, "");
  if (!digitos) return "";

  return `$${digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
