import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa nombre, correo electrónico y descripción del caso.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Correo inválido",
        description: "Ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo enviar el formulario.");
      }

      toast({
        title: "Consulta enviada",
        description: "Gracias por contactarnos. Te responderemos a la brevedad.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error al enviar",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al enviar la consulta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contacto"
      className="section-padding bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-legal-primary/10 text-legal-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Phone className="w-4 h-4" />
            <span>Contacto</span>
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-legal-dark leading-tight mb-6">
            Agenda tu{" "}
            <span className="text-gradient-legal">consulta gratuita</span>
          </h2>

          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para ayudarte. Contáctanos para una evaluación gratuita
            de tu caso y conoce cómo podemos proteger tus derechos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <Card className="p-6 hover-lift shadow-card-soft border-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-legal-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-legal-primary" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-legal-dark mb-2">
                    Nuestra Oficina
                  </h3>

                  <p className="font-body text-muted-foreground">
                    Bombero Salas N° 1369, oficina 701
                    <br />
                    Santiago, Chile
                  </p>

                  <p className="font-body text-sm text-muted-foreground mt-2">
                    Sector Metro Universidad de Chile
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-lift shadow-card-soft border-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-legal-dark mb-2">
                    Teléfono y WhatsApp
                  </h3>

                  <p className="font-body text-legal-primary font-semibold text-lg">
                    +56 9 9533 6140 - +56 9 6641 6504
                  </p>

                  <p className="font-body text-sm text-muted-foreground mt-1">
                    Disponible para WhatsApp las 24 horas
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-lift shadow-card-soft border-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-legal-dark mb-2">
                    Correo electrónico
                  </h3>

                  <p className="font-body text-legal-primary font-semibold text-lg">
                    abogados@arteagayaldunate.cl
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover-lift shadow-card-soft border-0">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-legal-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-legal-primary" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-legal-dark mb-2">
                    Horarios de Atención
                  </h3>

                  <div className="space-y-1 font-body text-muted-foreground">
                    <p>Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-legal-primary font-medium">
                      Emergencias: 24/7
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-legal text-white p-6 rounded-xl">
              <h3 className="font-heading text-lg font-bold mb-2">
                ¿Necesitas atención inmediata?
              </h3>

              <p className="font-body text-sm opacity-90 mb-4">
                Si has sido detenido o citado a declarar, contáctanos
                inmediatamente. La primera hora es crucial en cualquier proceso
                penal.
              </p>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  window.open("https://wa.me/56995336140", "_blank")
                }
              >
                WhatsApp de emergencia
              </Button>
            </div>
          </div>

          {/* Formulario */}
          <Card className="p-8 shadow-card-soft border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-legal-dark mb-4">
                  Cuéntanos tu caso
                </h3>

                <p className="font-body text-muted-foreground text-sm mb-6">
                  Todos los campos marcados con * son obligatorios.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-medium text-legal-dark mb-2 block">
                    Nombre completo *
                  </label>

                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="border-border focus:border-legal-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-legal-dark mb-2 block">
                    Teléfono
                  </label>

                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+56 9 XXXX XXXX"
                    className="border-border focus:border-legal-primary"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm font-medium text-legal-dark mb-2 block">
                  Correo electrónico *
                </label>

                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="border-border focus:border-legal-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-legal-dark mb-2 block">
                  Describe tu situación *
                </label>

                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos brevemente qué tipo de caso tienes, si has sido citado, detenido o necesitas asesoría preventiva..."
                  rows={5}
                  className="border-border focus:border-legal-primary resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-legal-primary/5 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Mail className="w-5 h-5 text-legal-primary mt-0.5 flex-shrink-0" />

                  <p className="font-body text-sm text-muted-foreground">
                    <strong>Confidencialidad garantizada:</strong> Toda la
                    información que compartas está protegida por el secreto
                    profesional del abogado.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                variant="legal"
                size="lg"
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando consulta...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Enviar consulta gratuita
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-4 shadow-card-soft border-0">
            <div className="bg-gradient-legal-soft rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-legal-primary mx-auto mb-4" />

                <h3 className="font-heading text-lg font-bold text-legal-dark mb-2">
                  Estamos en el centro de Santiago
                </h3>

                <p className="font-body text-muted-foreground">
                  Bombero Salas N° 1369, oficina 701 - Metro Universidad de
                  Chile
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;