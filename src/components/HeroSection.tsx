import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

import LegalQuickForm from "@/components/hero/LegalQuickForm";
import { HERO_SLIDES } from "@/lib/heroSlides";
import heroBg from "@/assets/hero-legal.jpg";

const WHATSAPP_PHONE = "56995336140"; // sin "+"
const slide = HERO_SLIDES[0];
const WHATSAPP_MESSAGE = encodeURIComponent(slide.whatsappMessage);

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Banner de fondo */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/60" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.03]" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: Texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
                {slide.eyebrow}
              </p>

              <h1 className="font-heading text-4xl md:text-6xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
               {slide.title}
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                {slide.description}
              </p>
            </motion.div>

            {/* BOTONES */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("contacto")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
              >
                <Phone className="w-5 h-5" />
                Cuéntanos tu caso
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-3 border-[2px] border-[#25D366] bg-background text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary transition shadow-soft"              >
                <MessageCircle className="w-5 h-5 "  />
                WhatsApp
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-14 grid grid-cols-3 gap-8 max-w-lg"
            >
              {[
                { num: "15+", label: "Años de experiencia" },
                { num: "2.000+", label: "Casos resueltos" },
                { num: "98%", label: "Satisfacción" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {s.num}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full"
          >
            <LegalQuickForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
