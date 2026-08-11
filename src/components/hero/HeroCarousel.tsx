import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlide from "./HeroSlide";
import type { HeroSlideData } from "@/lib/heroSlides";

interface Props {
  slides: Array<{ data: HeroSlideData; form: React.ReactNode }>;
  /** Milisegundos que un slide permanece visible. 0 desactiva la rotación. */
  intervaloMs?: number;
}

const CAMPOS_DE_TEXTO = ["INPUT", "TEXTAREA", "SELECT"];

/** Hay alguien escribiendo o eligiendo dentro de un campo del hero. */
const hayCampoEnfocado = (contenedor: HTMLElement | null) => {
  const foco = document.activeElement as HTMLElement | null;
  if (!foco || !CAMPOS_DE_TEXTO.includes(foco.tagName)) return false;
  // Solo cuentan los campos del propio carrusel, no los del resto de la página.
  return contenedor?.contains(foco) ?? false;
};

const HeroCarousel = ({ slides, intervaloMs = 8000 }: Props) => {
  // Arranca siempre en el primer slide: es el que Google indexa.
  const [activo, setActivo] = useState(0);
  const total = slides.length;
  const ir = (i: number) => setActivo((i + total) % total);

  const seccionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!intervaloMs || total < 2) return;

    // Respeta a quien pidió menos movimiento en su sistema: para esas personas
    // un carrusel que se mueve solo es directamente hostil.
    const prefiereMenosMovimiento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefiereMenosMovimiento) return;

    const id = window.setInterval(() => {
      // Si hay un campo con el cursor puesto, se salta el turno en vez de
      // cortar la rotación: cambiar de slide mientras alguien escribe le
      // arrebataría el formulario a medio llenar.
      if (hayCampoEnfocado(seccionRef.current)) return;
      setActivo((i) => (i + 1) % total);
    }, intervaloMs);

    return () => window.clearInterval(id);
  }, [intervaloMs, total]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // No interferir con el cursor de texto dentro de campos del formulario.
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

    if (e.key === "ArrowLeft") ir(activo - 1);
    else if (e.key === "ArrowRight") ir(activo + 1);
  };

  // Deslizar con el dedo: único control táctil disponible en móvil, ya que
  // ahí las flechas están ocultas.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const UMBRAL_SWIPE = 50;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    // Si el desplazamiento vertical domina, es scroll de página: no tocar.
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < UMBRAL_SWIPE) return;

    if (dx < 0) ir(activo + 1);
    else ir(activo - 1);
  };

  return (
    <section
      ref={seccionRef}
      id="hero"
      aria-roledescription="carousel"
      aria-label="Servicios del estudio"
      className="relative overflow-hidden"
      onKeyDown={onKeyDown}
    >
      <div
        className="flex items-start transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${activo * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map(({ data, form }, i) => (
          <div
            key={data.id}
            data-slide={data.id}
            className="w-full flex-shrink-0"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            // El slide oculto no debe ser tabulable ni audible: sin esto, el
            // teclado cae en un formulario invisible.
            {...(i === activo ? {} : { inert: "" })}
          >
            <HeroSlide slide={data} isFirst={i === 0}>
              {form}
            </HeroSlide>
          </div>
        ))}
      </div>

      {/*
        En móvil el hero mide bastante más que una pantalla (texto + stats +
        formulario apilados), así que top-1/2 no cae en el centro visual sino
        sobre el formulario. Las flechas laterales solo son seguras desde md
        (layout de dos columnas, centro vertical libre de formulario). En
        móvil solo quedan los puntos indicadores de abajo.
      */}
      <button
        type="button"
        onClick={() => ir(activo - 1)}
        aria-label="Servicio anterior"
        className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => ir(activo + 1)}
        aria-label="Servicio siguiente"
        className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map(({ data }, i) => (
          <button
            key={data.id}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ver ${data.eyebrow}`}
            aria-current={i === activo}
            className={`h-2 rounded-full transition-all ${
              i === activo ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
