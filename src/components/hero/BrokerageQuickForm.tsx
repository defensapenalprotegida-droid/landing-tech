import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Home } from "lucide-react";
import { submitLead } from "@/lib/leadApi";
import { useToast } from "@/hooks/use-toast";
import {
  brokerageSchema,
  OPERACIONES, OPERACION_LABELS,
  TIPOS_PROPIEDAD, TIPO_PROPIEDAD_LABELS,
  TEMAS_LEGALES, TEMA_LEGAL_LABELS,
} from "@/lib/brokerageSchema";

const VACIO = {
  name: "", phone: "", email: "", operacion: "",
  tipoPropiedad: "", comuna: "", temaLegal: "", message: "", website: "",
};

const BrokerageQuickForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(VACIO);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "")
    );
    const parsed = brokerageSchema.safeParse({ website: "", ...limpio });
    if (!parsed.success) {
      toast({
        title: "Revisa los datos",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const res = await submitLead({ servicio: "corretaje", ...parsed.data });
    setSubmitting(false);

    if (res.ok) {
      toast({ title: "Consulta enviada", description: "Te contactaremos a la brevedad." });
      setForm(VACIO);
    } else {
      toast({ title: "Error al enviar", description: res.message, variant: "destructive" });
    }
  };

  return (
    <Card className="p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            Cuéntanos de tu propiedad
          </h3>
          <p className="text-muted-foreground text-sm">
            Todos los campos marcados con * son obligatorios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-name" className="text-sm font-medium text-foreground mb-2 block">
              Nombre completo *
            </label>
            <Input id="b-name" name="name" value={form.name} onChange={onChange}
              placeholder="Tu nombre completo" />
          </div>
          <div>
            <label htmlFor="b-phone" className="text-sm font-medium text-foreground mb-2 block">
              Teléfono *
            </label>
            <Input id="b-phone" name="phone" type="tel" value={form.phone} onChange={onChange}
              placeholder="+56 9 XXXX XXXX" />
          </div>
        </div>

        <div>
          <label htmlFor="b-email" className="text-sm font-medium text-foreground mb-2 block">
            Correo electrónico *
          </label>
          <Input id="b-email" name="email" type="email" value={form.email} onChange={onChange}
            placeholder="tu@email.com" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-operacion" className="text-sm font-medium text-foreground mb-2 block">
              ¿Qué necesitas? *
            </label>
            <select id="b-operacion" name="operacion" value={form.operacion} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {OPERACIONES.map((o) => (
                <option key={o} value={o}>{OPERACION_LABELS[o]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="b-tipo" className="text-sm font-medium text-foreground mb-2 block">
              Tipo de propiedad
            </label>
            <select id="b-tipo" name="tipoPropiedad" value={form.tipoPropiedad} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {TIPOS_PROPIEDAD.map((t) => (
                <option key={t} value={t}>{TIPO_PROPIEDAD_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-comuna" className="text-sm font-medium text-foreground mb-2 block">
              Comuna
            </label>
            <Input id="b-comuna" name="comuna" value={form.comuna} onChange={onChange}
              placeholder="Providencia" />
          </div>
          <div>
            <label htmlFor="b-tema" className="text-sm font-medium text-foreground mb-2 block">
              ¿Tiene algún tema legal pendiente?
            </label>
            <select id="b-tema" name="temaLegal" value={form.temaLegal} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {TEMAS_LEGALES.map((t) => (
                <option key={t} value={t}>{TEMA_LEGAL_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="b-message" className="text-sm font-medium text-foreground mb-2 block">
            Cuéntanos brevemente *
          </label>
          <Textarea id="b-message" name="message" rows={4} value={form.message} onChange={onChange}
            className="resize-none"
            placeholder="Ubicación aproximada, estado de la propiedad, plazos que manejas..." />
        </div>

        {/* honeypot: invisible para personas, tentador para bots */}
        <input type="text" name="website" value={form.website} onChange={onChange}
          tabIndex={-1} autoComplete="off" aria-hidden="true"
          className="absolute left-[-9999px] w-px h-px opacity-0" />

        <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-2">
          <Home className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Corretaje y abogado en un solo lugar:</strong>{" "}
            si la propiedad tiene un conflicto legal, lo resolvemos nosotros.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 group" disabled={submitting}>
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Enviando...</>
          ) : (
            <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />Enviar consulta gratuita</>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default BrokerageQuickForm;
