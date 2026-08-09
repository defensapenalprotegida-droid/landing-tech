import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlide from "./HeroSlide";
import type { HeroSlideData } from "@/lib/heroSlides";

interface Props {
  slides: Array<{ data: HeroSlideData; form: React.ReactNode }>;
}

const HeroCarousel = ({ slides }: Props) => {
  // Arranca siempre en el slide legal: es el que Google indexa.
  const [activo, setActivo] = useState(0);
  const total = slides.length;
  const ir = (i: number) => setActivo((i + total) % total);

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Servicios del estudio"
      className="relative overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activo * 100}%)` }}
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

      <button
        type="button"
        onClick={() => ir(activo - 1)}
        aria-label="Servicio anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => ir(activo + 1)}
        aria-label="Servicio siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
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
