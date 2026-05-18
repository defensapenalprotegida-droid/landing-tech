import { Card } from "@/components/ui/card";
import { Handshake, Target, Landmark, Trophy } from "lucide-react";

const reasons = [
  {
    icon: Handshake,
    title: "Cercanía",
    desc: "Cada cliente es atendido directamente por un abogado del estudio. Nada de intermediarios, nada de respuestas automáticas: usted siempre sabe con quién está hablando.",
  },
  {
    icon: Target,
    title: "Estrategia",
    desc: "No iniciamos una causa sin un plan. Evaluamos costos, plazos, probabilidades reales de éxito y alternativas extrajudiciales, para tomar decisiones informadas y rentables.",
  },
  {
    icon: Landmark,
    title: "Experiencia",
    desc: "Litigamos en todas las jurisdicciones del país: Juzgados Civiles, de Familia, Laborales, Garantía, Tribunales Tributarios y Aduaneros, Cortes de Apelaciones y Corte Suprema.",
  },
  {
    icon: Trophy,
    title: "Resultados",
    desc: "Trabajamos por objetivos concretos y medibles. Nuestro éxito se mide en el suyo: causas ganadas, acuerdos favorables, contratos blindados y patrimonios protegidos.",
  },
];

const MissionSection = () => {
  return (
    <section className="section-padding bg-gradient-legal-soft">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Target className="w-4 h-4" />
            <span>Por qué elegirnos</span>
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6 max-w-4xl mx-auto">
            Una asesoría jurídica{" "}
            <span className="text-legal-primary">directa</span>,{" "}
            <span className="text-accent">estratégica</span> y orientada a{" "}
            <span className="text-legal-primary">resultados concretos</span>
          </h2>

          <p className="font-body text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            En Arteaga y Aldunate Abogados y Asociados entendemos que cada caso
            requiere atención personalizada, análisis jurídico serio y una
            estrategia diseñada desde el primer momento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <Card
              key={reason.title}
              className="group p-8 text-center hover-lift bg-white/80 backdrop-blur-sm border-legal-primary/20 shadow-card-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-legal-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                <reason.icon className="w-8 h-8 text-legal-primary group-hover:text-accent transition-colors" />
              </div>

              <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
                {reason.title}
              </h3>

              <p className="font-body text-muted-foreground leading-relaxed text-sm">
                {reason.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;