import type { Campo } from "./productosJuridicos";
import { formatearPesos } from "./formatoMoneda";

/** Par etiqueta-valor listo para mostrarse a una persona. */
export interface CampoProducto {
  label: string;
  value: string;
}

/**
 * Convierte las respuestas del formulario en pares legibles para el correo.
 *
 * Se envían etiqueta y valor ya resueltos, no los nombres técnicos, para que
 * el backend no necesite conocer los productos. Si mandáramos `mesesMora: "6"`,
 * el backend tendría que declarar cada campo de cada producto y redesplegarse
 * con cada cambio del formulario; el día que alguien lo olvidara, el dato se
 * perdería en silencio, que es exactamente lo que pasaba antes.
 */
export function construirCamposProducto(
  campos: Campo[],
  respuestas: Record<string, unknown>
): CampoProducto[] {
  // Se recorre la definición del producto y no las respuestas: así el orden
  // del correo es el mismo que vio la persona al completar el formulario, y
  // se descarta cualquier dato ajeno que venga en el mismo objeto.
  return campos.reduce<CampoProducto[]>((acumulado, campo) => {
    const respuesta = respuestas[campo.name];

    if (respuesta === undefined || respuesta === null || respuesta === "") {
      return acumulado;
    }

    const bruto = String(respuesta);
    // En selects y radios el valor guardado es un código ("si"); la etiqueta
    // es lo único que se entiende al leer el correo.
    const opcion = campo.options?.find((o) => o.value === bruto);
    // Los montos viajan formateados: el correo debe decir "$2.400.000", no
    // "2400000", que es donde el estudio pierde tiempo contando ceros.
    const valor = campo.moneda ? formatearPesos(bruto) : (opcion?.label ?? bruto);

    acumulado.push({ label: campo.label, value: valor });
    return acumulado;
  }, []);
}
