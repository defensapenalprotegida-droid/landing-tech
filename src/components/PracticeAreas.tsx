import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Scale, AlertTriangle, Briefcase, Building2, Handshake, ChevronRight } from "lucide-react";

const areas = [
  {
    icon: Heart, title: "Familia",
    desc: "Divorcios, pensión de alimentos, custodia, adopciones y violencia intrafamiliar.",
    services: ["Divorcio de mutuo acuerdo y unilateral", "Pensión de alimentos", "Cuidado personal de hijos", "Régimen de visitas", "Adopción"],
  },
  {
    icon: Scale, title: "Civil",
    desc: "Contratos, obligaciones, indemnizaciones y responsabilidad extracontractual.",
    services: ["Incumplimiento de contratos", "Indemnización de perjuicios", "Cobro de deudas", "Sucesiones y herencias"],
  },
  {
    icon: AlertTriangle, title: "Penal",
    desc: "Defensa penal integral en todas las etapas del proceso criminal.",
    services: ["Defensa en juicio oral", "Recursos de apelación y nulidad", "Salidas alternativas", "Querella criminal"],
  },
  {
    icon: Briefcase, title: "Laboral",
    desc: "Despido injustificado, acoso laboral, negociaciones colectivas.",
    services: ["Despido injustificado", "Tutela laboral", "Accidentes de trabajo", "Negociación colectiva"],
  },
  {
    icon: Building2, title: "Bienes raíces",
    desc: "Compraventa, arriendos, regularización de títulos y posesiones efectivas.",
    services: ["Compraventa de inmuebles", "Contratos de arriendo", "Regularización de títulos", "Posesión efectiva"],
  },
  {
    icon: Handshake, title: "Arbitraje",
    desc: "Resolución alternativa de conflictos, mediación y arbitraje comercial.",
    services: ["Mediación familiar", "Arbitraje comercial", "Negociación directa", "Conciliación judicial"],
  },
];

const PracticeAreas = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="areas" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
      <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
  Áreas de práctica
</p>

<h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
  Especialización que marca la diferencia
</h2>

<div className="text-muted-foreground text-lg leading-relaxed space-y-5 max-w-4xl mx-auto">
  <p>
    Nuestra práctica se concentra en la litigación de casos complejos en las áreas
    de Derecho de Familia, arbitrajes civiles, Derecho Penal y negociaciones con
    componentes de diversa índole.
  </p>

  <p>
    El valor agregado de nuestro trabajo radica en la conformación de equipos
    especializados y en la dedicación puesta en cada causa, lo que nos permite
    entregar soluciones oportunas, integrales y satisfactorias a conflictos que
    abarcan diversos ámbitos del ejercicio profesional.
  </p>
</div>

        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-background rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                active === i ? "border-primary/30 shadow-hover" : "border-border shadow-soft hover:shadow-hover"
              }`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-muted transition-transform duration-300 ${
                      active === i ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{area.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{area.desc}</p>
              </div>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-7 pb-7 pt-2 border-t border-border/50">
                      <ul className="space-y-2">
                        {area.services.map((s) => (
                          <li key={s} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {s}
                          </li>
                        ))}
                      </ul>
                      <a href="#contacto" className="inline-block mt-4 text-primary text-sm font-semibold hover:underline">
                        Consultar →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
