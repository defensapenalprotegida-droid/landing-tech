import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  leadSchema, type LeadFormValues, AREAS, AREA_LABELS, URGENCIAS, URGENCIA_LABELS,
  HORARIOS, HORARIO_LABELS, MONTO_RANGOS, MONTO_LABELS, PENAL_SITUACIONES,
  FAMILIA_MATERIAS, LABORAL_PARTE, LABORAL_SITUACIONES,
  montoAplica, situacionPenalAplica, materiaFamiliaAplica, laboralAplica,
} from "@/lib/leadSchema";
import { submitLead } from "@/lib/leadApi";
import { onPrefillArea } from "@/lib/leadPrefill";

const selectCls =
  "w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-legal-primary focus:outline-none";
const inputCls =
  "w-full h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-legal-primary focus:outline-none";

const ContactForm = () => {
  const { toast } = useToast();
  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { horario: "cualquiera", website: "" },
  });

  const area = watch("area");

  useEffect(() => onPrefillArea((a) => setValue("area", a, { shouldValidate: false })), [setValue]);

  const onSubmit = async (values: LeadFormValues) => {
    if (values.website) return; // honeypot
    const res = await submitLead(values);
    if (res.ok) {
      toast({ title: "Consulta enviada",
        description: "Gracias por contactarnos. Te responderemos a la brevedad." });
      reset({ horario: "cualquiera", website: "" });
    } else {
      toast({ title: "Error al enviar", description: res.message, variant: "destructive" });
    }
  };

  const err = (k: keyof LeadFormValues) =>
    errors[k] ? <p className="text-destructive text-xs mt-1">{errors[k]?.message as string}</p> : null;

  return (
    <Card className="p-8 shadow-card-soft border-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <h3 className="font-heading text-xl font-bold text-legal-dark mb-1">Cuéntanos tu caso</h3>
          <p className="text-muted-foreground text-sm">Los campos con * son obligatorios.</p>
        </div>

        {/* honeypot */}
        <input type="text" tabIndex={-1} autoComplete="off"
          className="hidden" aria-hidden="true" {...register("website")} />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-legal-dark mb-1 block">Nombre completo *</label>
            <input id="name" className={inputCls} placeholder="Tu nombre completo" {...register("name")} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-legal-dark mb-1 block">Teléfono *</label>
            <input id="phone" className={inputCls} placeholder="+56 9 XXXX XXXX" {...register("phone")} />
            {err("phone")}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-legal-dark mb-1 block">Correo electrónico *</label>
          <input id="email" type="email" className={inputCls} placeholder="tu@email.com" {...register("email")} />
          {err("email")}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="area" className="text-sm font-medium text-legal-dark mb-1 block">Área / Tipo de causa *</label>
            <select id="area" className={selectCls} defaultValue="" {...register("area")}>
              <option value="" disabled>Selecciona un área</option>
              {AREAS.map((a) => <option key={a} value={a}>{AREA_LABELS[a]}</option>)}
            </select>
            {err("area")}
          </div>
          <div>
            <label htmlFor="urgencia" className="text-sm font-medium text-legal-dark mb-1 block">Urgencia *</label>
            <select id="urgencia" className={selectCls} defaultValue="" {...register("urgencia")}>
              <option value="" disabled>Selecciona</option>
              {URGENCIAS.map((u) => <option key={u} value={u}>{URGENCIA_LABELS[u]}</option>)}
            </select>
            {err("urgencia")}
          </div>
        </div>

        {/* Condicionales por área */}
        {situacionPenalAplica(area) && (
          <div>
            <label htmlFor="situacionPenal" className="text-sm font-medium text-legal-dark mb-1 block">Situación actual *</label>
            <select id="situacionPenal" className={selectCls} defaultValue="" {...register("situacionPenal")}>
              <option value="" disabled>Selecciona</option>
              {PENAL_SITUACIONES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {err("situacionPenal")}
          </div>
        )}

        {materiaFamiliaAplica(area) && (
          <div>
            <label htmlFor="materiaFamilia" className="text-sm font-medium text-legal-dark mb-1 block">Materia *</label>
            <select id="materiaFamilia" className={selectCls} defaultValue="" {...register("materiaFamilia")}>
              <option value="" disabled>Selecciona</option>
              {FAMILIA_MATERIAS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {err("materiaFamilia")}
          </div>
        )}

        {laboralAplica(area) && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="laboralParte" className="text-sm font-medium text-legal-dark mb-1 block">¿Trabajador o empresa? *</label>
              <select id="laboralParte" className={selectCls} defaultValue="" {...register("laboralParte")}>
                <option value="" disabled>Selecciona</option>
                {LABORAL_PARTE.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {err("laboralParte")}
            </div>
            <div>
              <label htmlFor="laboralSituacion" className="text-sm font-medium text-legal-dark mb-1 block">Situación *</label>
              <select id="laboralSituacion" className={selectCls} defaultValue="" {...register("laboralSituacion")}>
                <option value="" disabled>Selecciona</option>
                {LABORAL_SITUACIONES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {err("laboralSituacion")}
            </div>
          </div>
        )}

        {area && montoAplica(area) && (
          <div>
            <label htmlFor="monto" className="text-sm font-medium text-legal-dark mb-1 block">Monto involucrado</label>
            <select id="monto" className={selectCls} defaultValue="" {...register("monto")}>
              <option value="" disabled>Selecciona (opcional)</option>
              {MONTO_RANGOS.map((m) => <option key={m} value={m}>{MONTO_LABELS[m]}</option>)}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="horario" className="text-sm font-medium text-legal-dark mb-1 block">Mejor horario de contacto</label>
          <select id="horario" className={selectCls} {...register("horario")}>
            {HORARIOS.map((h) => <option key={h} value={h}>{HORARIO_LABELS[h]}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium text-legal-dark mb-1 block">Describe tu caso *</label>
          <textarea id="message" rows={5} className={inputCls + " h-auto py-2 resize-none"}
            placeholder="Cuéntanos brevemente qué ocurrió, si has sido citado, detenido, o necesitas asesoría preventiva..."
            {...register("message")} />
          {err("message")}
        </div>

        <div className="bg-legal-primary/5 p-4 rounded-lg flex items-start gap-2">
          <Mail className="w-5 h-5 text-legal-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong>Confidencialidad garantizada:</strong> la información que compartas está
            protegida por el secreto profesional del abogado.
          </p>
        </div>

        <Button type="submit" variant="legal" size="lg" className="w-full group" disabled={isSubmitting}>
          {isSubmitting
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
            : <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Enviar consulta gratuita</>}
        </Button>
      </form>
    </Card>
  );
};

const ContactSection = () => {
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
          <ContactForm />
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
