"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, BookOpen, ArrowRight, Phone } from "lucide-react";
import { useState } from "react";

const TeamSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const team = [
    {
      name: "Patricio Aldunate",
      role: "Abogada Penalista",
      description: "Especialista en delitos económicos con más de 10 años de experiencia.",
      image: "/equipo/maria.jpg",
    },
    {
      name: "Ignacio Arteaga",
      role: "Defensor Penal Privado",
      description: "Experto en derecho procesal penal y juicios orales complejos.",
      image: "/equipo/jose.jpg",
    },
    {
      name: "Jose Pereira",
      role: "Abogada Litigante",
      description: "Destacada en defensa por Ley 20.000 y estrategias alternativas.",
      image: "/equipo/camila.jpg",
    },
  ];

  return (
    <section id="equipo" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Intro */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Nuestro Equipo</span>
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6">
            Abogados penalistas{" "}
            <span className="text-gradient-legal">expertos</span> con formación y experiencia
          </h2>

          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nuestro equipo está conformado por abogados especialistas en derecho penal con 
            amplia trayectoria en tribunales chilenos y formación académica de excelencia.
          </p>
        </div>

        {/* Expertise Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 text-center hover-lift shadow-card-soft border-0 bg-gradient-to-br from-legal-primary/5 to-white">
            <div className="w-16 h-16 bg-legal-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-legal-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Experiencia Comprobada
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Más de 30 años de experiencia en defensa penal, con casos exitosos en 
              todas las áreas del derecho criminal.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                <span>500+ casos resueltos</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                <span>85% casos favorables</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center hover-lift shadow-card-soft border-0 bg-gradient-to-br from-accent/5 to-white">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Formación Académica
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Formación en prestigiosas universidades chilenas y especializaciones 
              en derecho penal y procesal penal.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Postgrados en derecho penal</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Capacitación permanente</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center hover-lift shadow-card-soft border-0 bg-gradient-to-br from-legal-primary/5 to-white">
            <div className="w-16 h-16 bg-legal-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-legal-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
              Trabajo en Equipo
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Enfoque colaborativo que aprovecha la experiencia colectiva para 
              ofrecer la mejor defensa posible.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                <span>Análisis conjunto de casos</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-legal-primary rounded-full"></div>
                <span>Estrategias multidisciplinarias</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Philosophy */}
        <div className="bg-gradient-legal-soft rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="font-heading text-2xl lg:text-3xl font-bold text-legal-dark mb-6">
            "La experiencia y la humanidad van de la mano"
          </h3>
          <p className="font-body text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Creemos que la excelencia técnica debe ir acompañada de un trato humano y personalizado. 
            Cada cliente es único y merece una defensa diseñada específicamente para su situación. 
            Nuestro compromiso va más allá del aspecto legal: te acompañamos en todo el proceso 
            con transparencia, empatía y profesionalismo.
          </p>

          <Button variant="legal" size="xl" onClick={scrollToContact} className="group">
            Conoce personalmente a nuestro equipo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Team Members Grid */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-legal-dark text-center mb-12">
            Nuestro Equipo 
          </h3>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="relative group p-[2px] rounded-xl bg-transparent transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#A12341] hover:to-[#0F3B47] hover:bg-[length:200%_200%] hover:shadow-xl hover:-translate-y-2 w-full max-w-sm"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center rounded-xl px-4 text-center">
                  <p className="text-black text-sm font-medium">{member.description}</p>
                </div>

                <div className="bg-white rounded-[10px] h-full w-full relative z-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A12341] to-[#0F3B47] mx-auto mb-4 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-legal-dark mb-1">{member.name}</h4>
                    <p className="text-[#A12341] font-semibold">{member.role}</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
