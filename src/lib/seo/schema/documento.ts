import { ESTUDIO_ID, SITE } from "../estudio";
import { urlDescarga, type DocumentoDescargable } from "@/lib/documentos";

/**
 * Una plantilla descargable, atribuida al estudio.
 *
 * DigitalDocument es el tipo de schema.org para documentos electrónicos.
 * `encoding` apunta al .docx real para que el archivo quede asociado a la
 * página que lo describe y no aparezca suelto en los resultados.
 */
export function documentoSchema(doc: DocumentoDescargable) {
  return {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "@id": `${SITE}/documentos/${doc.slug}#documento`,
    name: doc.h1,
    description: doc.resumen,
    url: `${SITE}/documentos/${doc.slug}`,
    inLanguage: "es-CL",
    isAccessibleForFree: true,
    author: { "@id": ESTUDIO_ID },
    publisher: { "@id": ESTUDIO_ID },
    encoding: {
      "@type": "MediaObject",
      contentUrl: `${SITE}${urlDescarga(doc)}`,
      encodingFormat:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  };
}
