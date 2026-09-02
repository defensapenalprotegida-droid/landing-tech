import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router no resetea el scroll al navegar: quien hace clic en un enlace
 * del footer llega a la página nueva mirando el final. Volvemos arriba en
 * cada cambio de ruta, salvo cuando hay hash (de eso se ocupa
 * useScrollToHash en el home).
 */
export function useScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}
