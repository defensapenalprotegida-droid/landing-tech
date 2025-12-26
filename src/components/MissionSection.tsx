import { Card } from "@/components/ui/card";
import { Target, Scale, Heart } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="section-padding bg-gradient-legal-soft">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            <span>Nuestra Misión</span>
          </div>
          
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6 max-w-4xl mx-auto">
            Brindamos defensa penal especializada y efectiva, con{" "}
            <span className="text-legal-primary">rapidez</span>,{" "}
            <span className="text-accent">ética</span> y conocimiento profundo del{" "}
            <span className="text-legal-primary">proceso penal chileno</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover-lift bg-white/80 backdrop-blur-sm border-legal-primary/20">
            <div className="w-16 h-16 bg-legal-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-legal-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Justicia Especializada
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Conocimiento profundo del derecho penal chileno y experiencia en todo tipo de delitos, 
              desde casos comunes hasta complejos delitos económicos.
            </p>
          </Card>

          <Card className="p-8 text-center hover-lift bg-white/80 backdrop-blur-sm border-accent/20">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Estrategia Efectiva
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Cada caso requiere un enfoque único. Desarrollamos estrategias defensivas 
              personalizadas basadas en evidencia sólida y experiencia práctica.
            </p>
          </Card>

          <Card className="p-8 text-center hover-lift bg-white/80 backdrop-blur-sm border-legal-primary/20">
            <div className="w-16 h-16 bg-legal-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-legal-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Acompañamiento Humano
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              Entendemos que enfrentar un proceso penal es estresante. Te acompañamos 
              con calidez humana, transparencia y comunicación constante.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;