/**
 * Canal para abrir el centro de preferencias desde cualquier parte.
 *
 * El enlace vive en el footer y el modal se monta en el Layout: no hay
 * relación padre-hijo entre ambos. Un contexto obligaría a envolver toda la
 * app solo para propagar un booleano; esto es un emisor de tres líneas.
 */
type Oyente = () => void;

const oyentes = new Set<Oyente>();

/** Abre el centro de preferencias. Seguro de llamar aunque nadie escuche. */
export function openCookiePreferences(): void {
  for (const oyente of oyentes) oyente();
}

export function onOpenCookiePreferences(oyente: Oyente): () => void {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}
