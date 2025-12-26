import { Button } from "@/components/ui/button";
import { Shield, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-legal.jpg";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center section-padding bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Defensa Penal Profesional" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Protección Legal Especializada</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-legal-dark leading-tight mb-6">
              Defensa penal{" "}
              <span className="text-gradient-legal">inmediata</span>,{" "}
              <span className="text-legal-primary">ética</span> y{" "}
              <span className="text-accent">estratégica</span>
            </h1>
            
            <p className="font-body text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Protegemos tu libertad y derechos con profesionalismo y humanidad. 
              Nuestro equipo de abogados penalistas especializados te acompaña en cada paso del proceso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="legal"
                size="xl"
                onClick={() => scrollToSection("contacto")}
                className="group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Agenda tu consulta
              </Button>
              
              <Button
                variant="legal-outline"
                size="xl"
                onClick={() => scrollToSection("servicios")}
              >
                Conoce nuestros servicios
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="font-heading text-2xl lg:text-3xl font-bold text-legal-dark">30+</div>
                <div className="font-body text-sm text-muted-foreground">Años de experiencia</div>
              </div>
              <div>
                <div className="font-heading text-2xl lg:text-3xl font-bold text-legal-dark">500+</div>
                <div className="font-body text-sm text-muted-foreground">Casos exitosos</div>
              </div>
              <div>
                <div className="font-heading text-2xl lg:text-3xl font-bold text-legal-dark">24/7</div>
                <div className="font-body text-sm text-muted-foreground">Atención inmediata</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-gradient-legal p-1 rounded-2xl shadow-elevated">
              <div className="bg-white p-8 rounded-xl">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-legal-primary mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-bold text-legal-dark mb-3">
                    Consulta Gratuita
                  </h3>
                  <p className="font-body text-muted-foreground mb-6">
                    Evaluamos tu caso sin compromiso. Primera consulta completamente gratuita.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                      <span>Atención personalizada</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Confidencialidad absoluta</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                      <span>Respuesta inmediata</span>
                    </div>
                    <Button 
  variant="secondary" 
  size="sm" 
  className="bg-green-600 text-white"
  onClick={() => window.open("https://wa.me/56995336140", "_blank")}
>
               Contactar
              </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;