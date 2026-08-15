/**
 * Subida de adjuntos a S3 mediante URLs firmadas.
 *
 * El flujo tiene tres pasos y los tres importan:
 *   1. Pedir al backend una URL firmada por archivo.
 *   2. Subir el archivo a esa URL con el mismo Content-Type que se firmó.
 *   3. Devolver la URL del objeto SIN la query de firma.
 *
 * El paso 3 es el que se solía olvidar: la URL firmada trae
 * `?X-Amz-Signature=...`, y el backend valida el adjunto haciendo `HeadObject`
 * con todo lo que sigue al dominio. Si se le manda la firma, busca un objeto
 * llamado `demanda.pdf?X-Amz-Signature=…`, no lo encuentra, y rechaza el envío
 * completo.
 */

export type EstadoAdjunto = "subiendo" | "listo" | "error";

export interface ProgresoAdjunto {
  filename: string;
  estado: EstadoAdjunto;
}

export type ResultadoSubida = { urls: string[] } | { error: string };

interface UrlFirmada {
  filename: string;
  url: string;
}

/** Quita la firma para quedarse con la URL del objeto. */
function urlDelObjeto(urlFirmada: string): string {
  return urlFirmada.split("?")[0];
}

async function pedirUrlsFirmadas(
  files: File[]
): Promise<{ urls: UrlFirmada[] } | { error: string }> {
  // Los nombres de estos campos son los que lee el backend: `filename` y
  // `mimeType`. Enviando `name`/`type` los recibía como undefined.
  const peticion = {
    files: files.map((file) => ({
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    })),
  };

  const respuesta = await fetch("/api/presigned-urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(peticion),
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    return {
      error: datos?.message ?? "No se pudieron preparar los archivos.",
    };
  }

  return { urls: (datos?.urls ?? []) as UrlFirmada[] };
}

/**
 * Sube los archivos y devuelve las URLs listas para enviar con el formulario.
 *
 * Se detiene en el primer fallo: si un documento no llegó, es preferible
 * decirlo antes de enviar la consulta que mandarla incompleta sin avisar.
 */
export async function subirAdjuntos(
  files: File[],
  onProgreso?: (progreso: ProgresoAdjunto) => void
): Promise<ResultadoSubida> {
  if (files.length === 0) return { urls: [] };

  try {
    const firmadas = await pedirUrlsFirmadas(files);
    if ("error" in firmadas) return firmadas;

    const urls: string[] = [];

    for (const file of files) {
      const firmada = firmadas.urls.find((u) => u.filename === file.name);

      if (!firmada) {
        return {
          error: `No se pudo preparar la carga de ${file.name}.`,
        };
      }

      onProgreso?.({ filename: file.name, estado: "subiendo" });

      const subida = await fetch(firmada.url, {
        method: "PUT",
        // S3 firma la URL junto con el Content-Type: si no coincide con el
        // declarado al pedirla, rechaza la subida.
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!subida.ok) {
        onProgreso?.({ filename: file.name, estado: "error" });
        return { error: `No se pudo subir ${file.name}. Inténtalo de nuevo.` };
      }

      onProgreso?.({ filename: file.name, estado: "listo" });
      urls.push(urlDelObjeto(firmada.url));
    }

    return { urls };
  } catch {
    // Nunca devolver éxito ante un fallo de red: el formulario enviaría la
    // consulta dando por hecho que los documentos llegaron.
    return {
      error: "No se pudieron subir los archivos. Revisa tu conexión.",
    };
  }
}
