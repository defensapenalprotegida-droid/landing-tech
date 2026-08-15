// src/components/hero/ProductoForm.tsx

import React, { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressSearchInput from "@/components/AddressSearchInput";
import FileUploadField from "./FileUploadField";
import { submitLead } from "@/lib/leadApi";
import { getRecaptchaToken, RECAPTCHA_ACTIONS } from "@/lib/recaptcha";
import { useToast } from "@/hooks/use-toast";
import { getProducto, type Producto } from "@/lib/productosJuridicos";
import { construirCamposProducto } from "@/lib/camposProducto";

interface ProductoFormProps {
  productoId: Producto;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  urgencia: "inmediata" | "semana" | "sin_apuro";
  horario: "manana" | "tarde" | "cualquiera";
  address?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: string | number | boolean | undefined;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ productoId }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
    urgencia: "sin_apuro",
    horario: "cualquiera",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  // Enviar mientras un documento sube dejaría la consulta sin el adjunto,
  // y la persona creería que llegó.
  const [subiendoAdjuntos, setSubiendoAdjuntos] = useState(false);

  const producto = getProducto(productoId);

  if (!producto) {
    return <div className="text-red-500">Producto no encontrado</div>;
  }


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos base
    if (!formData.name?.trim()) {
      newErrors.name = "Nombre requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nombre muy corto (mín. 3 caracteres)";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message?.trim() || formData.message.trim().length < 5) {
      newErrors.message = "Describe tu caso (mín. 5 caracteres)";
    }

    // Validar campos dinámicos required del producto
    producto.campos.forEach((campo) => {
      if (campo.required && !formData[campo.name]) {
        newErrors[campo.name] = `${campo.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Completa los campos requeridos",
        description: "Revisa los errores arriba",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const recaptchaToken = await getRecaptchaToken(RECAPTCHA_ACTIONS.heroLegal);

      const payload: Record<string, any> = {
        servicio: "legal",
        producto: productoId,
        recaptchaToken,
        recaptchaAction: RECAPTCHA_ACTIONS.heroLegal,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        message: formData.message.trim(),
        urgencia: formData.urgencia,
        horario: formData.horario,
        address: formData.address?.trim() || "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      };

      // Las respuestas del caso viajan como pares etiqueta-valor y no como
      // claves sueltas: así el backend las muestra sin conocer los productos.
      // Antes se enviaban planas (`mesesMora: "6"`) y, como el backend no las
      // declaraba, se descartaban en silencio: el detalle del caso nunca
      // llegaba al correo.
      console.log("DEBUG - producto.campos:", producto.campos.map(c => c.name));
      console.log("DEBUG - formData:", formData);
      const camposProducto = construirCamposProducto(producto.campos, formData);
      console.log("DEBUG - camposProducto:", camposProducto);
      if (camposProducto.length > 0) {
        payload.camposProducto = camposProducto;
      }

      const res = await submitLead(payload);
      setSubmitting(false);

      if (res.ok) {
        toast({
          title: "Consulta enviada",
          description: "Te responderemos a la brevedad.",
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          urgencia: "sin_apuro",
          horario: "cualquiera",
          address: "",
        });
        setAttachmentUrls([]);
        setErrors({});
      } else {
        toast({
          title: "Error al enviar",
          description: res.message || "Intenta de nuevo más tarde",
          variant: "destructive",
        });
      }
    } catch (error) {
      setSubmitting(false);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl max-h-[600px] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título del producto */}
        <div className="mb-2">
          <h3 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <FontAwesomeIcon icon={producto.icon} className="w-5 h-5 text-legal-primary" />
            {producto.nombre}
          </h3>
          <p className="text-muted-foreground text-xs">
            Completa el formulario y evaluaremos tu caso gratuitamente.
          </p>
        </div>

        {/* CAMPOS DINÁMICOS DEL PRODUCTO */}
        {producto.campos.length > 0 && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Información específica</h4>

            {producto.campos.map((campo) => (
              <div key={campo.name}>
                {/* Radio buttons */}
                {campo.type === "radio" && (
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <RadioGroup
                      value={formData[campo.name]?.toString() || ""}
                      onValueChange={(value) => handleRadioChange(campo.name, value)}
                    >
                      {campo.options?.map((option) => (
                        <div key={option.value} className="flex items-center gap-2 py-1">
                          <RadioGroupItem
                            value={option.value}
                            id={`${campo.name}-${option.value}`}
                          />
                          <Label htmlFor={`${campo.name}-${option.value}`} className="font-normal text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors[campo.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[campo.name]}</p>
                    )}
                  </div>
                )}

                {/* Select dropdown */}
                {campo.type === "select" && (
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <Select
                      value={formData[campo.name]?.toString() || ""}
                      onValueChange={(value) => handleRadioChange(campo.name, value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent>
                        {campo.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[campo.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[campo.name]}</p>
                    )}
                  </div>
                )}

                {/* Address search input */}
                {campo.type === "address" && (
                  <div>
                    <AddressSearchInput
                      value={formData[campo.name] as string || ""}
                      onChange={(result) => {
                        setFormData((prev) => ({
                          ...prev,
                          [campo.name]: result.address,
                        }));
                      }}
                      label={campo.label}
                      placeholder={campo.placeholder}
                      required={campo.required}
                      error={errors[campo.name]}
                    />
                  </div>
                )}

                {/* Text, email, tel, number, date inputs */}
                {["text", "email", "tel", "number", "date"].includes(campo.type) && (
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <Input
                      type={campo.type}
                      name={campo.name}
                      value={formData[campo.name] || ""}
                      onChange={handleChange}
                      placeholder={campo.placeholder}
                      className="text-sm"
                    />
                    {errors[campo.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[campo.name]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CAMPOS BASE: Contacto */}
        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="font-semibold text-foreground text-sm">Tus datos de contacto</h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
                Nombre completo *
              </label>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
                Teléfono
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+56 9 XXXX XXXX"
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
              Correo electrónico *
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
          </div>
        </div>


        {/* URGENCIA Y HORARIO */}
        <div className="grid md:grid-cols-2 gap-3 border-t border-border pt-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
              Urgencia
            </label>
            <Select value={formData.urgencia} onValueChange={(value) => handleRadioChange("urgencia", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inmediata">Inmediata (detenido)</SelectItem>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="sin_apuro">Sin apuro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
              ¿Cuándo contactarte?
            </label>
            <Select value={formData.horario} onValueChange={(value) => handleRadioChange("horario", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manana">Mañana</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
                <SelectItem value="cualquiera">Cualquiera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* MENSAJE GENERAL */}
        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 block uppercase tracking-wide">
            Cuéntanos más *
          </label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={producto.placeholder}
            rows={4}
            className="resize-none text-sm"
          />
          {errors.message && <p className="text-red-500 text-xs mt-0.5">{errors.message}</p>}
        </div>

        {/* FILE UPLOADS */}
        <div className="border-t border-border pt-4">
          <FileUploadField
            value={attachmentUrls}
            onChange={(urls) => {
              setAttachmentUrls(urls);
              setFormData(prev => ({ ...prev, attachmentUrls: urls }));
            }}
            onSubiendoChange={setSubiendoAdjuntos}
            label="Documentos adjuntos (opcional)"
            disabled={submitting}
            maxFiles={5}
            maxFileSize={100 * 1024 * 1024}
            maxTotalSize={500 * 1024 * 1024}
          />
        </div>

        {/* CONFIDENCIALIDAD */}
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Confidencialidad garantizada:</strong> Tu información está protegida por secreto profesional.
            </p>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          size="md"
          className="w-full gap-2 group text-sm"
          disabled={submitting || subiendoAdjuntos}
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

export default ProductoForm;
