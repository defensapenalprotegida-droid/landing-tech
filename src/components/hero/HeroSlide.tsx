import { Phone, MessageCircle } from "lucide-react";
import type { HeroSlideData } from "@/lib/heroSlides";

const WHATSAPP_PHONE = "56995336140";

const STATS = [
  { num: "15+", label: "Años de experiencia" },
  { num: "2.000+", label: "Casos resueltos" },
  { num: "98%", label: "Satisfacción" },
];

interface Props {
  slide: HeroSlideData;
  /** Solo el primer slide lleva el h1 del documento. */
  isFirst: boolean;
  children: React.ReactNode;
}

const HeroSlide = ({ slide, isFirst, children }: Props) => {
  const Titular = isFirst ? "h1" : "h2";

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={slide.image} alt="" aria-hidden className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
              {slide.eyebrow}
            </p>

            <Titular className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              {slide.title}
            </Titular>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  document.getElementById(slide.ctaTarget)?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
              >
                <Phone className="w-5 h-5" />
                {slide.ctaLabel}
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(slide.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border-[2px] border-[#25D366] bg-background text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary transition shadow-soft"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{s.num}</p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;
