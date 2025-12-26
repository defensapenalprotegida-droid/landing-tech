import { Card } from "@/components/ui/card";
import { Lock, FileSearch, Gavel, Heart } from "lucide-react";

const ApproachSection = () => {
  const pillars = [
    {
      icon: Lock,
      title: "Confidencialidad Absoluta",
      description: "Tu información y caso se mantienen bajo estricta confidencialidad profesional. El secreto profesional es sagrado en nuestra práctica.",
      color: "legal-primary"
    },
    {
      icon: FileSearch,
      title: "Estrategia Basada en Evidencia",
      description: "Analizamos meticulosamente cada evidencia, testimonio y procedimiento para construir la defensa más sólida posible.",
      color: "accent"
    },
    {
      icon: Gavel,
      title: "Representación Activa en Juicio",
      description: "Te representamos con firmeza y profesionalismo en todas las etapas del proceso, desde la investigación hasta el juicio oral.",
      color: "legal-primary"
    },
    {
      icon: Heart,
      title: "Acompañamiento Humano",
      description: "Entendemos la carga emocional de un proceso penal. Te acompañamos con empatía, transparencia y comunicación constante.",
      color: "accent"
    }
  ];

  return (
    <section id="enfoque" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gavel className="w-4 h-4" />
            <span>Nuestro Enfoque</span>
          </div>
          
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6">
            Cuatro pilares fundamentales de{" "}
            <span className="text-gradient-legal">nuestra defensa</span>
          </h2>
          
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nuestra metodología se basa en principios sólidos que garantizan una defensa 
            efectiva, ética y centrada en la protección de tus derechos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <Card key={index} className="p-6 text-center hover-lift shadow-card-soft border-0 bg-white group">
                <div className={`w-16 h-16 bg-${pillar.color}/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 text-${pillar.color}`} />
                </div>
                
                <h3 className="font-heading text-lg font-bold text-legal-dark mb-4 leading-tight">
                  {pillar.title}
                </h3>
                
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Process Timeline */}
        <div className="mt-16 pt-16 border-t border-border">
          <h3 className="font-heading text-2xl font-bold text-legal-dark text-center mb-12">
            Proceso de trabajo paso a paso
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-legal opacity-30"></div>
            
            {[
              { step: "01", title: "Consulta inicial", desc: "Evaluación gratuita de tu caso" },
              { step: "02", title: "Análisis estratégico", desc: "Revisión detallada de evidencias" },
              { step: "03", title: "Defensa activa", desc: "Representación en todas las etapas" },
              { step: "04", title: "Seguimiento", desc: "Acompañamiento hasta la resolución" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-legal rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg relative z-10">
                  {item.step}
                </div>
                <h4 className="font-heading text-lg font-bold text-legal-dark mb-2">
                  {item.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;