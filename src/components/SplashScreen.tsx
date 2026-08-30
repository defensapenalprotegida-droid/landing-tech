import { useEffect, useRef, useState } from "react";
import logoIntro from "@/assets/videos/logo-intro.mp4";

const STORAGE_KEY = "splash-vista";
// Si el video no llega a reproducirse (ahorro de datos, autoplay bloqueado),
// el overlay no puede quedarse tapando el sitio: se retira solo.
const TIMEOUT_MS = 5000;

/**
 * Overlay de carga inicial con la animación del logo. Se muestra una sola
 * vez por sesión; en el prerender de SSG no se renderiza (se activa recién
 * en el cliente vía useEffect, lo que además evita mismatch de hidratación).
 */
const SplashScreen = () => {
  const [visible, setVisible] = useState(false);
  const [desvaneciendo, setDesvaneciendo] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // sessionStorage bloqueado: mejor no mostrar el splash en cada carga.
      return;
    }
    setVisible(true);
    timeoutRef.current = window.setTimeout(ocultar, TIMEOUT_MS);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ocultar = () => {
    window.clearTimeout(timeoutRef.current);
    setDesvaneciendo(true);
    window.setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${
        desvaneciendo ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        src={logoIntro}
        autoPlay
        muted
        playsInline
        onEnded={ocultar}
        onError={ocultar}
        className="w-full max-w-md px-6"
      />
    </div>
  );
};

export default SplashScreen;
