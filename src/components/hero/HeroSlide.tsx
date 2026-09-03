import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { HeroSlideData } from "@/lib/heroSlides";

const WHATSAPP_PHONE = "56995336140";

const STATS = [
  { num: "32+", label: "Años de experiencia" },
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
    <div className="relative isolate h-full lg:min-h-[950px] flex flex-col lg:flex-row lg:items-center overflow-hidden bg-background">
      {/*
        En móvil la foto (1920x1080, horizontal) recortada a pantalla vertical
        queda pixelada y el texto encima se lee mal. Por eso abajo de lg se
        muestra como franja superior con fundido, y el contenido va sobre
        fondo sólido. La versión a pantalla completa solo existe desde lg.
      */}
      <div className="relative lg:hidden h-52 sm:h-72 w-full">
        <img src={slide.image} alt="" aria-hidden className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <img src={slide.image} alt="" aria-hidden className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
      </div>

      {/* Círculos decorativos */}
      <div className="absolute inset-0 overflow-hidden -z-10 hidden lg:block">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.03]" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-12 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
                <FontAwesomeIcon icon={slide.icon} className="inline-block w-5 h-5 mr-2 text-legal-primary" />
                {slide.eyebrow}
              </p>

              <Titular className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 lg:mb-6">
                {slide.title}
              </Titular>

              <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mb-6 lg:mb-10 leading-relaxed">
                {slide.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() =>
                  document.getElementById(slide.ctaTarget)?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
              >
                <Phone className="w-5 h-5" />
                {slide.ctaLabel}
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(slide.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border-[2px] border-[#25D366] bg-background text-foreground px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-secondary transition shadow-soft"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 lg:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{s.num}</p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;
