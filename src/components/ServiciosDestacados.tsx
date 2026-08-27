import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductosPublicados } from "@/lib/productosJuridicos";

/**
 * Enlaces a las páginas de servicio publicadas.
 *
 * No se renderiza si no hay ninguna: durante la publicación por tandas la
 * lista puede estar vacía, y una sección con título y nada debajo es peor que
 * ninguna sección.
 *
 * Mobile: carrusel deslizable con controles.
 * Desktop: grid de 2 columnas.
 */
const ServiciosDestacados = () => {
  const productos = getProductosPublicados();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (productos.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === productos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="servicios" className="section-padding">
      <div className="max-w-5xl mx-auto container-padding">
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Servicios con procedimiento definido
        </h2>

        {/* Carrusel en mobile, grid en desktop */}
        <div className="mt-8">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={`/servicios/${productos[currentIndex].seo!.slug}`}
                    className="block rounded-xl border border-border bg-card/60 p-6 transition-colors hover:border-legal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <h3 className="font-body text-lg font-bold text-foreground">
                      {productos[currentIndex].seo!.h1}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                      {productos[currentIndex].seo!.metaDescription}
                    </p>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Controles de carrusel */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={goToPrevious}
                  aria-label="Servicio anterior"
                  className="rounded-lg bg-primary/10 p-2 transition-all hover:bg-primary/20 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>

                {/* Indicador de posición y dots */}
                <div className="flex flex-1 items-center justify-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {currentIndex + 1} / {productos.length}
                  </span>
                </div>

                <button
                  onClick={goToNext}
                  aria-label="Siguiente servicio"
                  className="rounded-lg bg-primary/10 p-2 transition-all hover:bg-primary/20 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </div>

              {/* Dots de navegación */}
              <div className="mt-4 flex justify-center gap-2">
                {productos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Ir al servicio ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <ul className="hidden md:grid gap-4 sm:grid-cols-2">
            {productos.map((producto) => (
              <li key={producto.id}>
                <Link
                  to={`/servicios/${producto.seo!.slug}`}
                  className="block h-full rounded-xl border border-border bg-card/60 p-6 transition-colors hover:border-legal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <h3 className="font-body text-lg font-bold text-foreground">
                    {producto.seo!.h1}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                    {producto.seo!.metaDescription}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ServiciosDestacados;
