import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Leaf, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Building2,
      title: "Delitos Económicos",
      subtitle: "Defensa especializada en delitos financieros",
      color: "legal-primary",
      items: [
        "Estafas y fraudes",
        "Apropiación indebida",
        "Delitos tributarios",
        "Lavado de activos",
        "Delitos bancarios",
        "Giro doloso de cheques"
      ]
    },
    {
      icon: Users,
      title: "Delitos Comunes",
      subtitle: "Representación en delitos contra las personas",
      color: "accent",
      items: [
        "Robos con intimidación",
        "Hurtos y robos simples",
        "Lesiones corporales",
        "Amenazas y coacciones",
        "Delitos sexuales",
        "Violencia intrafamiliar"
      ]
    },
    {
      icon: Leaf,
      title: "Ley 20.000",
      subtitle: "Defensa especializada en delitos de drogas",
      color: "legal-primary",
      items: [
        "Microtráfico de drogas",
        "Tráfico de sustancias",
        "Cultivo de cannabis",
        "Tenencia para consumo",
        "Elaboración de drogas",
        "Facilitación de drogas"
      ]
    }
  ];

  return (
    <section id="servicios" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            <span>Nuestros Servicios</span>
          </div>
          
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6">
            Defensa penal integral en{" "}
            <span className="text-gradient-legal">todas las áreas</span>
          </h2>
          
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nuestro equipo cuenta con amplia experiencia en diversas áreas del derecho penal, 
            ofreciendo representación especializada y estratégica en cada tipo de delito.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="p-8 hover-lift shadow-card-soft border-0 bg-gradient-to-br from-white to-gray-50/50">
                <div className={`w-16 h-16 bg-${service.color}/10 rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-8 h-8 text-${service.color}`} />
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-legal-dark mb-3">
                  {service.title}
                </h3>
                
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  {service.subtitle}
                </p>

                <div className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 bg-${service.color} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="font-body text-sm text-foreground leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <p className="font-body text-muted-foreground mb-6 max-w-2xl mx-auto">
            ¿Tu caso no aparece en la lista? No te preocupes. Contamos con experiencia 
            en todo tipo de delitos y procesos penales.
          </p>
          
          <Button variant="legal" size="xl" onClick={scrollToContact} className="group">
            Consulta tu caso específico
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;