import { z } from "zod";

export const AREAS = [
  "penal", "civil", "laboral", "familia",
  "corporativo", "inmobiliario", "tributario",
] as const;
export type Area = (typeof AREAS)[number];

export const AREA_LABELS: Record<Area, string> = {
  penal: "Derecho Penal",
  civil: "Derecho Civil",
  laboral: "Derecho Laboral",
  familia: "Derecho de Familia",
  corporativo: "Derecho Corporativo",
  inmobiliario: "Derecho Inmobiliario",
  tributario: "Derecho Tributario",
};

export const URGENCIAS = ["inmediata", "semana", "sin_apuro"] as const;
export type Urgencia = (typeof URGENCIAS)[number];
export const URGENCIA_LABELS: Record<Urgencia, string> = {
  inmediata: "Inmediata (detenido / citado)",
  semana: "Esta semana",
  sin_apuro: "Sin apuro",
};

export const HORARIOS = ["manana", "tarde", "cualquiera"] as const;
export type Horario = (typeof HORARIOS)[number];
export const HORARIO_LABELS: Record<Horario, string> = {
  manana: "Mañana",
  tarde: "Tarde",
  cualquiera: "Cualquiera",
};

export const MONTO_RANGOS = ["lt1", "1a10", "10a50", "gt50", "na"] as const;
export type MontoRango = (typeof MONTO_RANGOS)[number];
export const MONTO_LABELS: Record<MontoRango, string> = {
  lt1: "Menos de $1.000.000",
  "1a10": "$1.000.000 – $10.000.000",
  "10a50": "$10.000.000 – $50.000.000",
  gt50: "Más de $50.000.000",
  na: "No aplica / no lo sé",
};

export const PENAL_SITUACIONES = [
  { value: "detenido", label: "Detenido" },
  { value: "citado", label: "Citado a declarar" },
  { value: "formalizado", label: "Formalizado" },
  { value: "victima", label: "Soy víctima / quiero querellarme" },
  { value: "preventiva", label: "Consulta preventiva" },
] as const;
export const PENAL_SITUACION_VALUES = PENAL_SITUACIONES.map((s) => s.value) as
  [string, ...string[]];

export const FAMILIA_MATERIAS = [
  { value: "divorcio", label: "Divorcio" },
  { value: "alimentos", label: "Pensión de alimentos" },
  { value: "cuidado", label: "Cuidado personal / visitas" },
  { value: "vif", label: "Violencia intrafamiliar" },
  { value: "otro", label: "Otro" },
] as const;
export const FAMILIA_MATERIA_VALUES = FAMILIA_MATERIAS.map((s) => s.value) as
  [string, ...string[]];

export const LABORAL_PARTE = [
  { value: "trabajador", label: "Trabajador" },
  { value: "empresa", label: "Empresa / empleador" },
] as const;
export const LABORAL_PARTE_VALUES = LABORAL_PARTE.map((s) => s.value) as
  [string, ...string[]];

export const LABORAL_SITUACIONES = [
  { value: "despido", label: "Despido injustificado" },
  { value: "autodespido", label: "Autodespido" },
  { value: "tutela", label: "Tutela de derechos" },
  { value: "prestaciones", label: "Cobro de prestaciones" },
  { value: "otro", label: "Otro" },
] as const;
export const LABORAL_SITUACION_VALUES = LABORAL_SITUACIONES.map((s) => s.value) as
  [string, ...string[]];

const MONTO_AREAS: Area[] = ["civil", "corporativo", "inmobiliario", "tributario"];
export const montoAplica = (a: Area) => MONTO_AREAS.includes(a) || a === "penal";
export const situacionPenalAplica = (a: Area) => a === "penal";
export const materiaFamiliaAplica = (a: Area) => a === "familia";
export const laboralAplica = (a: Area) => a === "laboral";

export const leadSchema = z
  .object({
    name: z.string().trim().min(3, "Ingresa tu nombre completo"),
    phone: z.string().trim().min(8, "Ingresa un teléfono válido"),
    email: z.string().trim().email("Ingresa un correo válido"),
    area: z.enum(AREAS, { required_error: "Selecciona un área" }),
    urgencia: z.enum(URGENCIAS, { required_error: "Selecciona la urgencia" }),
    horario: z.enum(HORARIOS).default("cualquiera"),
    message: z.string().trim().min(15, "Cuéntanos brevemente tu caso (mín. 15 caracteres)"),
    // condicionales
    situacionPenal: z.enum(PENAL_SITUACION_VALUES).optional(),
    monto: z.enum(MONTO_RANGOS).optional(),
    materiaFamilia: z.enum(FAMILIA_MATERIA_VALUES).optional(),
    laboralParte: z.enum(LABORAL_PARTE_VALUES).optional(),
    laboralSituacion: z.enum(LABORAL_SITUACION_VALUES).optional(),
    // honeypot anti-spam (debe ir vacío)
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (situacionPenalAplica(data.area) && !data.situacionPenal) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["situacionPenal"],
        message: "Selecciona tu situación actual" });
    }
    if (materiaFamiliaAplica(data.area) && !data.materiaFamilia) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["materiaFamilia"],
        message: "Selecciona la materia" });
    }
    if (laboralAplica(data.area)) {
      if (!data.laboralParte)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["laboralParte"],
          message: "Indica si eres trabajador o empresa" });
      if (!data.laboralSituacion)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["laboralSituacion"],
          message: "Selecciona la situación" });
    }
  });

export type LeadFormValues = z.infer<typeof leadSchema>;
