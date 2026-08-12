import type { Area } from "@/lib/leadSchema";
import {
  faScaleBalanced,
  faHouse,
  faHouseUser,
  faKey,
  faBriefcase,
  faChartColumn,
  faDollarSign,
  faHeartBroken,
  faExclamationTriangle,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import heroRecuperaCasa from "@/assets/hero-recupera-casa.jpg";
import heroRecuperaPie from "@/assets/hero-recupera-pie.jpg";
import heroDefiendeDeспido from "@/assets/hero-defiende-despido.jpg";
import heroCotizacionesImpagas from "@/assets/hero-cotizaciones-impagas.jpg";
import heroCobraPension from "@/assets/hero-cobra-pension.jpg";
import heroDivorcioExpress from "@/assets/hero-divorcio-express.jpg";
import heroAutodespido from "@/assets/hero-autodespido.jpg";

export type Producto =
  | "recupera-casa"
  | "cotizaciones-impagas"
  | "defiende-despido"
  | "recupera-pie"
  | "cobra-pension"
  | "divorcio-express"
  | "autodespido";

export const PRODUCTOS_LIST: Producto[] = [
  "recupera-casa",
  "cotizaciones-impagas",
  "defiende-despido",
  "recupera-pie",
  "cobra-pension",
  "divorcio-express",
  "autodespido",
] as const;

export const PRODUCTOS = PRODUCTOS_LIST;

export interface Campo {
  name: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "radio" | "date";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
}

export interface ProductoJuridico {
  id: Producto;
  nombre: string;
  emoji: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  backendArea: Area;
  campos: Campo[];
  placeholder: string;
  cta: string;
  whatsappMessage: string;
  icon: IconDefinition;
}

export const PRODUCTO_TO_AREA: Record<Producto, Area> = {
  "recupera-casa": "inmobiliario",
  "recupera-pie": "inmobiliario",
  "defiende-despido": "laboral",
  "cotizaciones-impagas": "laboral",
  "cobra-pension": "familia",
  "divorcio-express": "familia",
  "autodespido": "laboral",
};

export const PRODUCTOS_JURIDICOS: Record<Producto, ProductoJuridico> = {
  "recupera-casa": {
    id: "recupera-casa",
    nombre: "Recupera tu Casa",
    emoji: "🏠",
    eyebrow: "Arrendatario moroso",
    title: "¿Tu arrendatario no paga? Recupera tu propiedad en tribunales.",
    description: "Procedimiento monitorio para cobrar rentas y obtener la restitución del inmueble.",
    image: heroRecuperaCasa,
    backendArea: "inmobiliario",
    icon: faHouseUser,
    campos: [
      {
        name: "tieneContrato",
        type: "radio",
        label: "Contrato de arriendo",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "mesesMora",
        type: "number",
        label: "Meses de mora",
        required: true,
        placeholder: "Ej: 3",
      },
      {
        name: "montoTotal",
        type: "number",
        label: "Monto adeudado",
        required: true,
        placeholder: "Pesos",
      },
      {
        name: "direccionPropiedad",
        type: "text",
        label: "Dirección propiedad",
        required: true,
        placeholder: "Calle, número, ciudad",
      },
      {
        name: "hayConsumos",
        type: "radio",
        label: "Consumos (agua, luz, gas)",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "Cuéntanos: ¿desde cuándo no paga?, ¿hay consumos o gastos comunes también?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, necesito recuperar mi propiedad por arrendatario moroso.",
  },
  "recupera-pie": {
    id: "recupera-pie",
    nombre: "Recupera tu Pie",
    emoji: "🏗️",
    eyebrow: "Inmobiliaria retiene pie",
    title: "¿La inmobiliaria se quedó con tu pie? Recupera tu dinero.",
    description: "Defensa de derechos del consumidor y acción de restitución.",
    image: heroRecuperaPie,
    backendArea: "inmobiliario",
    icon: faKey,
    campos: [
      {
        name: "montoPie",
        type: "number",
        label: "Monto pagado",
        required: true,
        placeholder: "Pesos",
      },
      {
        name: "motivoRechazo",
        type: "select",
        label: "Motivo rechazo",
        required: true,
        options: [
          { value: "hipotecario", label: "Rechazo de crédito" },
          { value: "requisitos", label: "Falta de requisitos" },
          { value: "cambio_planes", label: "Cambio de planes" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        name: "tienePromesa",
        type: "radio",
        label: "Promesa compraventa",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "montoRetenido",
        type: "number",
        label: "Monto retenido",
        required: true,
        placeholder: "Pesos",
      },
      {
        name: "inmobiliaria",
        type: "text",
        label: "Inmobiliaria",
        required: false,
      },
    ],
    placeholder: "¿Cuándo te rechazaron el crédito?, ¿la inmobiliaria se niega a devolver el dinero?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, la inmobiliaria se quedó con mi pie después de rechazarme el crédito.",
  },
  "defiende-despido": {
    id: "defiende-despido",
    nombre: "Defiende tu Despido",
    emoji: "👔",
    eyebrow: "Despido injustificado",
    title: "¿Te despidieron injustamente? Calcula cuánto podrías reclamar.",
    description: "Evaluamos si tu despido cumple con los requisitos legales.",
    image: heroDefiendeDeспido,
    backendArea: "laboral",
    icon: faBriefcase,
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "Fecha despido",
        required: true,
      },
      {
        name: "sueldoMensual",
        type: "number",
        label: "Sueldo mensual",
        required: true,
        placeholder: "Pesos",
      },
      {
        name: "causalEnCarta",
        type: "text",
        label: "Causal en carta",
        required: true,
        placeholder: "Ej: desahucio, incumplimiento",
      },
      {
        name: "recibisteLiquidacion",
        type: "radio",
        label: "Recibiste liquidación",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿La causal te parece justa?, ¿hay documentos que prueben lo contrario?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, creo que me despidieron injustamente.",
  },
  "cotizaciones-impagas": {
    id: "cotizaciones-impagas",
    nombre: "Cotizaciones Impagas",
    emoji: "👷",
    eyebrow: "Nulidad del despido",
    title: "¿Te despidieron sin cotiizar? Anula el despido.",
    description: "Si tu empleador omitió cotizaciones, el despido es nulo.",
    image: heroCotizacionesImpagas,
    backendArea: "laboral",
    icon: faChartColumn,
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "Fecha despido",
        required: true,
      },
      {
        name: "tieneCartaDespido",
        type: "radio",
        label: "Carta de despido",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "mesesSinCotizar",
        type: "number",
        label: "Meses sin cotizar",
        required: true,
        placeholder: "Ej: 2, 3, 6",
      },
      {
        name: "tieneComprobanteCotizaciones",
        type: "radio",
        label: "Acceso historial AFP/Fonasa",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿Puedes acceder a tu historial de AFP o Fonasa para verificar las cotizaciones?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me despidieron y creo que tenía cotizaciones impagas.",
  },
  "cobra-pension": {
    id: "cobra-pension",
    nombre: "Cobra tu Pensión",
    emoji: "👶",
    eyebrow: "Alimentos adeudados",
    title: "¿Te deben pensión de alimentos? Ejecuta el cobro.",
    description: "Procedimiento especial para pensiones adeudadas con mérito ejecutivo.",
    image: heroCobraPension,
    backendArea: "familia",
    icon: faDollarSign,
    campos: [
      {
        name: "montoPension",
        type: "number",
        label: "Pensión mensual",
        required: true,
        placeholder: "Pesos",
      },
      {
        name: "mesesAtrasados",
        type: "number",
        label: "Meses adeudados",
        required: true,
        placeholder: "Ej: 3, 6, 12",
      },
      {
        name: "haySentencia",
        type: "radio",
        label: "Sentencia vigente",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "deudorEsIdentificado",
        type: "radio",
        label: "Ubicación deudor",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿Tienes la sentencia de alimentos?, ¿sabes dónde trabaja?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me deben pensión de alimentos.",
  },
  "divorcio-express": {
    id: "divorcio-express",
    nombre: "Divorcio Express",
    emoji: "💔",
    eyebrow: "Mutuo acuerdo",
    title: "¿Te quieres divorciar de mutuo acuerdo? Rápido y sin conflicto.",
    description: "Divorcio notarial o judicial con acuerdo total.",
    image: heroDivorcioExpress,
    backendArea: "familia",
    icon: faHeartBroken,
    campos: [
      {
        name: "mutuoAcuerdo",
        type: "radio",
        label: "Mutuo acuerdo",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "hayHijos",
        type: "radio",
        label: "Hijos menores",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "tiempoSeparacion",
        type: "select",
        label: "Tiempo separados",
        required: true,
        options: [
          { value: "menos_1", label: "Menos de 1 año" },
          { value: "1_2", label: "1-2 años" },
          { value: "mas_2", label: "Más de 2 años" },
        ],
      },
      {
        name: "acuerdoCompletamente",
        type: "radio",
        label: "Acuerdo completo",
        required: true,
        options: [
          { value: "si", label: "Sí, en todo" },
          { value: "no", label: "No, hay pendientes" },
        ],
      },
    ],
    placeholder: "¿Ya tienen todo acordado con tu pareja?, ¿qué temas quedan pendientes?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, quiero divorciarme de mutuo acuerdo.",
  },
  "autodespido": {
    id: "autodespido",
    nombre: "Autodespido",
    emoji: "⚠️",
    eyebrow: "Incumplimiento del empleador",
    title: "¿Tu empleador incumplió gravemente? Pide indemnización.",
    description: "Autodespido por incumplimiento grave de obligaciones laborales.",
    image: heroAutodespido,
    backendArea: "laboral",
    icon: faExclamationTriangle,
    campos: [
      {
        name: "fechaAutodespido",
        type: "date",
        label: "Fecha retiro",
        required: true,
      },
      {
        name: "motivoIncumplimiento",
        type: "select",
        label: "Incumplimiento empleador",
        required: true,
        options: [
          { value: "falta_pago", label: "No paga sueldos" },
          { value: "ambiente_hostil", label: "Ambiente hostil" },
          { value: "cambio_terminos", label: "Cambio de términos" },
          { value: "falta_seguridad", label: "Falta de seguridad" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        name: "tieneDocumentacion",
        type: "radio",
        label: "Documentación incumplimiento",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿Tienes evidencia del incumplimiento? (correos, mensajes, testigos)",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me retiraré del trabajo por incumplimiento del empleador.",
  },
};

export function getProducto(id: Producto): ProductoJuridico | undefined {
  return PRODUCTOS_JURIDICOS[id];
}

export function getAllProductos(): ProductoJuridico[] {
  return Object.values(PRODUCTOS_JURIDICOS);
}
