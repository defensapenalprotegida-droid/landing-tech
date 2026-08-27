import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Phone, Mail, Linkedin, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM, type TeamMember } from "@/lib/team";
// import TeamGallery from "@/components/TeamGallery";

const TeamSection = () => {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? TEAM.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === TEAM.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="equipo" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto container-padding">
        <div className="text-center mb-12">
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
            Profesionales
          </p>

          <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Nuestro Equipo
          </h3>
        </div>

        {/* <TeamGallery /> */}

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
                <Card className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                  <button
                    type="button"
                    onClick={() => setSelected(TEAM[currentIndex])}
                    aria-label={`Ver detalle de ${TEAM[currentIndex].name}`}
                    className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={TEAM[currentIndex].image}
                        alt={`${TEAM[currentIndex].name}, ${TEAM[currentIndex].role}`}
                        loading="lazy"
                        width={480}
                        height={640}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-legal-dark/55 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-legal-dark">
                          <Plus className="w-3 h-3" /> Ver detalle
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-serif text-base font-semibold text-foreground leading-tight">
                        {TEAM[currentIndex].name}
                      </h4>
                      <p className="font-sans text-sm text-primary font-medium mt-1">
                        {TEAM[currentIndex].role}
                      </p>
                    </div>
                  </button>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Controles de carrusel */}
            <div className="mt-6 space-y-4">
              {/* Botones de navegación */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={goToPrevious}
                  aria-label="Profesional anterior"
                  className="rounded-lg bg-primary/10 p-3 transition-all hover:bg-primary/20 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>

                <span className="text-center text-sm font-medium text-muted-foreground">
                  {currentIndex + 1} / {TEAM.length}
                </span>

                <button
                  onClick={goToNext}
                  aria-label="Siguiente profesional"
                  className="rounded-lg bg-primary/10 p-3 transition-all hover:bg-primary/20 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </div>

              {/* Dots de navegación */}
              <div className="flex justify-center gap-2 flex-wrap">
                {TEAM.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Ir al profesional ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50 cursor-pointer"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-5">
          {TEAM.map((member) => (
            <Card
              key={member.slug}
              className="group overflow-hidden rounded-xl border border-border bg-card
              shadow-soft transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
            >
              <button
                type="button"
                onClick={() => setSelected(member)}
                aria-label={`Ver detalle de ${member.name}`}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    loading="lazy"
                    width={480}
                    height={640}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0 bg-legal-dark/55 opacity-0 group-hover:opacity-100
                    group-focus-within:opacity-100 transition-opacity duration-300
                    flex items-end justify-center pb-4"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-legal-dark">
                      <Plus className="w-3 h-3" /> Ver detalle
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-serif text-sm font-semibold text-foreground leading-tight">
                    {member.name}
                  </h4>
                  <p className="font-sans text-xs text-primary font-medium mt-0.5">
                    {member.role}
                  </p>
                </div>
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={selected.image}
                    alt=""
                    width={480}
                    height={640}
                    className="w-20 h-[6.7rem] shrink-0 rounded-lg object-cover bg-muted"
                  />
                  <div className="text-left">
                    <DialogTitle className="font-serif text-xl text-foreground">
                      {selected.name}
                    </DialogTitle>
                    <DialogDescription className="text-primary font-medium">
                      {selected.role}
                    </DialogDescription>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selected.areas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                <section>
                  <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Experiencia profesional
                  </h5>
                  <p className="font-body text-sm text-foreground/85 leading-relaxed">
                    {selected.bio}
                  </p>
                </section>

                <section>
                  <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Formación académica
                  </h5>
                  <ul className="space-y-1.5">
                    {selected.formacion.map((item) => (
                      <li
                        key={item}
                        className="font-body text-sm text-foreground/85 leading-relaxed pl-4 relative
                        before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1
                        before:rounded-full before:bg-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Contacto
                  </h5>
                  <div className="flex flex-col gap-2">
                    {selected.contacto.telefono && (
                      <a
                        href={`tel:${selected.contacto.telefono.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        {selected.contacto.telefono}
                      </a>
                    )}
                    {selected.contacto.correo && (
                      <a
                        href={`mailto:${selected.contacto.correo}`}
                        className="inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors break-all"
                      >
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        {selected.contacto.correo}
                      </a>
                    )}
                    {selected.contacto.linkedin && (
                      <a
                        href={selected.contacto.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-body text-sm text-foreground/85 hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-primary shrink-0" />
                        Perfil de LinkedIn
                      </a>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TeamSection;
