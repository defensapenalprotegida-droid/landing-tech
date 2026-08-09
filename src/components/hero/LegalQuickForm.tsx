import React, { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitLead } from "@/lib/leadApi";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const LegalQuickForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      formData.message.trim().length < 5
    ) {
      toast({
        title: "Completa los campos",
        description:
          "Nombre, correo y una breve descripción (mín. 5 caracteres).",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const res = await submitLead({
      servicio: "legal",
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    });
    setSubmitting(false);

    if (res.ok) {
      toast({
        title: "Consulta enviada",
        description: "Te responderemos a la brevedad.",
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } else {
      toast({
        title: "Error al enviar",
        description: res.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
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

        <Button
          type="submit"
          size="lg"
          className="w-full gap-2 group"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
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
  );
};

export default LegalQuickForm;
