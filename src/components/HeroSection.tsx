import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, Send } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const WHATSAPP_PHONE = "56995336140"; // sin "+"
const WHATSAPP_MESSAGE = encodeURIComponent("Hola, necesito ayuda legal.");

const HeroSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Formulario enviado:", formData);

    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.03]" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-primary/[0.02]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: Texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
                Estudio Jurídico en Chile
              </p>

              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
                Defensa legal con{" "}
                <span className="text-gradient-navy">excelencia</span> y compromiso
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Abogados especializados en litigación civil, penal, familiar y laboral.
                Asesoría online y presencial en todo Chile con más de 15 años de experiencia.
              </p>
            </motion.div>

            {/* BOTONES */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={`tel:+${WHATSAPP_PHONE}`}
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
              >
                <Phone className="w-5 h-5" />
                Llamar ahora
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-border bg-background text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary transition shadow-soft"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-14 grid grid-cols-3 gap-8 max-w-lg"
            >
              {[
                { num: "15+", label: "Años de experiencia" },
                { num: "2.000+", label: "Casos resueltos" },
                { num: "98%", label: "Satisfacción" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    {s.num}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full"
          >
            <Card className="p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Cuéntanos tu caso
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Todos los campos marcados con * son obligatorios
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nombre completo *
                    </label>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Teléfono
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+56 9 XXXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Correo electrónico *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Describe tu situación *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos brevemente qué tipo de caso tienes, si has sido citado, detenido, o necesitas asesoría preventiva..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">
                        Confidencialidad garantizada:
                      </strong>{" "}
                      Toda la información que compartas está protegida por el secreto
                      profesional del abogado.
                    </p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Enviar consulta gratuita
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
