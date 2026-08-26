import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const teamImages = [
  { id: 1, src: "/EquipoReunido/team-reunion-1.webp", alt: "Equipo reunido - Sesión 1" },
  { id: 2, src: "/EquipoReunido/team-reunion-2.webp", alt: "Equipo reunido - Sesión 2" },
  { id: 3, src: "/EquipoReunido/team-reunion-3.webp", alt: "Equipo reunido - Sesión 3" },
  { id: 4, src: "/EquipoReunido/team-reunion-4.webp", alt: "Equipo reunido - Sesión 4" },
  { id: 5, src: "/EquipoReunido/team-reunion-5.webp", alt: "Equipo reunido - Sesión 5" },
  { id: 6, src: "/EquipoReunido/team-reunion-6.webp", alt: "Equipo reunido - Sesión 6" },
];

const TeamGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? teamImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === teamImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden bg-muted border border-border shadow-soft"
      >
        {/* Carrusel de imágenes */}
        <div className="relative aspect-video overflow-hidden bg-black/5">
          <motion.img
            key={currentIndex}
            src={teamImages[currentIndex].src}
            alt={teamImages[currentIndex].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />

          {/* Botones de navegación */}
          <button
            onClick={goToPrevious}
            aria-label="Imagen anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Siguiente imagen"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-foreground transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicador de posición */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white/90 text-sm font-medium">
              {currentIndex + 1} / {teamImages.length}
            </span>
          </div>
        </div>

        {/* Miniaturas de navegación */}
        <div className="bg-background p-4 border-t border-border">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {teamImages.map((image, index) => (
              <motion.button
                key={image.id}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/50 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Descripción */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center text-muted-foreground text-sm mt-4"
      >
        Momentos del equipo trabajando unidos por la excelencia jurídica
      </motion.p>
    </div>
  );
};

export default TeamGallery;
