import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Navega a una sección del home desde cualquier ruta.
 *
 * Estando en "/" hace scroll directo. Desde /blog o las páginas legales un
 * getElementById no encuentra nada (esas secciones no están montadas), así que
 * primero volvemos al home con el hash y `useScrollToHash` completa el scroll.
 */
export function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (id: string) => {
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${id}`);
      }
    },
    [navigate, pathname],
  );
}
