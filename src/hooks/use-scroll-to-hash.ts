import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// El home es largo y con imágenes: la posición de una sección cambia a medida
// que cargan. Reaplicamos el scroll unas pocas veces para absorber ese
// reacomodo en vez de confiar en un único frame.
const REINTENTOS_MS = [0, 150, 400, 800];

/**
 * Al llegar al home con un hash (p. ej. /#areas desde el footer del blog),
 * posiciona la vista en esa sección una vez montada.
 */
export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);

    // Salto instantáneo: es una navegación entre páginas, no un scroll dentro
    // de la misma vista, así que el desplazamiento animado no aporta.
    const timers = REINTENTOS_MS.map((ms) =>
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
      }, ms),
    );

    return () => timers.forEach(clearTimeout);
  }, [hash]);
}
