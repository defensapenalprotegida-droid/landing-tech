import { z } from "zod";

export const OPERACIONES = ["vender", "arrendar", "comprar", "busco_arriendo"] as const;
export type Operacion = (typeof OPERACIONES)[number];
export const OPERACION_LABELS: Record<Operacion, string> = {
  vender: "Vender mi propiedad",
  arrendar: "Arrendar mi propiedad",
  comprar: "Comprar una propiedad",
  busco_arriendo: "Busco arriendo",
};

export const TIPOS_PROPIEDAD = [
  "casa", "departamento", "oficina", "local", "terreno",
] as const;
export type TipoPropiedad = (typeof TIPOS_PROPIEDAD)[number];
export const TIPO_PROPIEDAD_LABELS: Record<TipoPropiedad, string> = {
  casa: "Casa",
  departamento: "Departamento",
  oficina: "Oficina",
  local: "Local comercial",
  terreno: "Terreno",
};

export const TEMAS_LEGALES = ["no_lo_se", "no", "si"] as const;
export type TemaLegal = (typeof TEMAS_LEGALES)[number];
export const TEMA_LEGAL_LABELS: Record<TemaLegal, string> = {
  no_lo_se: "No lo sé",
  no: "No",
  si: "Sí (herencia, arriendo impago, copropiedad, juicio)",
};

export const brokerageSchema = z.object({
  name: z.string().trim().min(3, "Ingresa tu nombre completo"),
  phone: z.string().trim().min(8, "Ingresa un teléfono válido"),
  email: z.string().trim().email("Ingresa un correo válido"),
  operacion: z.enum(OPERACIONES, { required_error: "Selecciona qué necesitas" }),
  tipoPropiedad: z.enum(TIPOS_PROPIEDAD).optional(),
  comuna: z.string().trim().optional(),
  temaLegal: z.enum(TEMAS_LEGALES).optional(),
  message: z.string().trim().min(5, "Cuéntanos brevemente (mín. 5 caracteres)"),
  // honeypot anti-spam: debe llegar vacío
  website: z.string().max(0).optional().default(""),
});

export type BrokerageFormValues = z.infer<typeof brokerageSchema>;
