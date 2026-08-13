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
import heroDefiendeDespido from "@/assets/hero-defiende-despido.jpg";
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

/**
 * Contenido de la página pública del producto.
 *
 * Es opcional a propósito: un producto sin este bloque simplemente no genera
 * ruta. Así el contenido jurídico entra al sitio cuando está revisado y no
 * antes, sin necesidad de ramas ni feature flags.
 */
export interface ProductoSeo {
  /** URL: /servicios/<slug>. En kebab-case y sin tildes. */
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /**
   * El párrafo que una IA va a citar. Debe sostenerse solo, fuera de todo
   * contexto: quien lo lea suelto tiene que entender qué es y a quién sirve.
   */
  resumen: string;
  pasos: { titulo: string; detalle: string }[];
  requisitos: string[];
  faq: { q: string; a: string }[];
  /** Slug del artículo de blog de fondo, si existe. */
  articuloRelacionado?: string;
  /**
   * Puerta de publicación. Mientras sea false el producto no genera ruta,
   * por más completo que esté el resto del bloque.
   */
  revisadoPorAbogado: boolean;
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
  seo?: ProductoSeo;
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
    image: heroDefiendeDespido,
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
    seo: {
      slug: "cobra-tu-pension",
      h1: "Cobro de pensión de alimentos adeudada",
      metaTitle: "Cobrar pensión de alimentos impaga",
      metaDescription:
        "Si te deben pensión de alimentos, la deuda tiene mérito ejecutivo y se puede cobrar con retención de sueldo, embargo y arraigo. Evaluamos tu caso.",
      resumen:
        "Cuando existe una sentencia o un acuerdo aprobado por el tribunal, la pensión de alimentos adeudada tiene mérito ejecutivo: no hay que volver a demandar para cobrarla. El tribunal de familia puede ordenar retención directa del sueldo, embargar bienes, retener la devolución de impuestos y decretar arraigo o arresto del deudor. El plazo de prescripción corre, así que la deuda antigua puede perderse.",
      pasos: [
        {
          titulo: "Revisamos el título",
          detalle:
            "Verificamos que exista sentencia o acuerdo aprobado y calculamos la deuda con reajustes e intereses.",
        },
        {
          titulo: "Liquidación en el tribunal",
          detalle:
            "Pedimos al tribunal que liquide la deuda. Esa liquidación es el monto exigible.",
        },
        {
          titulo: "Medidas de apremio",
          detalle:
            "Solicitamos retención de remuneraciones, embargo, retención de devolución de impuestos, arraigo o arresto según el caso.",
        },
      ],
      requisitos: [
        "Sentencia o acta de acuerdo aprobada por el tribunal",
        "RUT del alimentante, si lo tienes",
        "Detalle de los meses adeudados",
        "Datos del empleador del deudor, si los conoces",
      ],
      faq: [
        {
          q: "¿Qué es la pensión de alimentos?",
          a:
            "La pensión de alimentos es la obligación que tienen los padres de entregar alimentos, definida judicialmente, y que tiene por objeto cubrir los gastos de:\n" +
            "- Alimentación\n" +
            "- Vestimenta\n" +
            "- Educación\n" +
            "- Entretención\n" +
            "- Atención médica\n" +
            "- Entre otros\n\n" +
            "Esta obligación recae principalmente sobre los padres, pero también puede ser responsabilidad de otros parientes cercanos o tutores.",
        },
        {
          q: "¿Hasta qué edad los hijos pueden ser beneficiarios?",
          a:
            "- Hijos menores de 21 años.\n" +
            "- Hijos entre 21 y 28 años que se encuentren estudiando una profesión u oficio.\n" +
            "- Hijos con discapacidad física o mental que les impida subsistir por sí mismos.",
        },
        {
          q: "¿Quiénes deben proporcionar la pensión alimenticia a los hijos?",
          a: "Debe pagarla el padre o madre que no tiene el cuidado personal.",
        },
        {
          q: "¿Quién puede interponer una demanda por pensión alimenticia?",
          a:
            "El artículo 321(2) del Código Civil estipula la obligación legal de alimentar al o la cónyuge, los descendientes (hijos, nietos), los ascendientes (padres, abuelos) o a quien haya hecho una donación cuantiosa a la persona en cuestión.\n\n" +
            "Al ser un derecho individual, no es un beneficio transferible. Si los hijos del demandado son menores de edad, un tutor adulto puede demandar en su representación.",
        },
        {
          q: "¿Cómo se calcula la pensión de alimentos en Chile?",
          a:
            "Se calcula según:\n" +
            "- La capacidad económica del alimentante (quien debe pagar).\n" +
            "- Las necesidades del alimentario (quien recibe).\n\n" +
            "Se considera la situación financiera de ambas partes y se determina un monto justo y proporcional.",
        },
        {
          q: "¿Qué documentos vas a necesitar para demandar?",
          a:
            "Es vital reunir los siguientes documentos:\n" +
            "- Certificado de nacimiento del hijo o hijos.\n" +
            "- Certificado de matrimonio (si los padres están casados).\n" +
            "- Certificado de alumno regular (sala cuna, jardín, colegio o educación superior).\n" +
            "- Comprobante de pago de matrícula.\n" +
            "- Copia de la cédula de identidad.\n" +
            "- Certificados médicos (si existe enfermedad crónica o temporal).\n" +
            "- Todo documento que acredite gastos del hijo o hija.",
        },
        {
          q: "¿Cómo se realiza una demanda por pensión alimenticia?",
          a:
            "1) Primero se debe realizar una mediación familiar obligatoria para intentar un acuerdo extrajudicial.\n" +
            "2) Si no hay acuerdo, el mediador emite un acta de mediación frustrada, que permite interponer la demanda.\n" +
            "3) Luego se requiere el patrocinio de un abogado (idealmente especializado en Derecho de Familia).\n" +
            "4) Se presenta la demanda en el Tribunal de Familia correspondiente al domicilio del solicitante o del demandado.\n" +
            "5) Una vez acogida, se notifica al demandado.\n" +
            "6) Se fija audiencia y, si hay fundamentos, se decretan alimentos provisorios.\n\n" +
            "Los alimentos provisorios son el monto que deberá pagar el alimentante mientras dure el proceso y se fija el monto definitivo.",
        },
        {
          q: "¿Qué pasa si el demandado no cumple con la pensión?",
          a:
            "La legislación contempla mecanismos de apremio y cumplimiento forzado para garantizar el pago.\n\n" +
            "Además, existe el Registro Nacional de Deudores de Pensiones de Alimentos, que coordina diversas medidas legales para promover y garantizar el cumplimiento.",
        },
        {
          q: "¿Cómo se puede modificar la pensión de alimentos en Chile?",
          a:
            "Puede modificarse en cualquier momento si cambia:\n" +
            "- La situación financiera de alguna de las partes, o\n" +
            "- Las necesidades del alimentario.\n\n" +
            "Se debe presentar una solicitud ante el juez y acreditar un cambio significativo en las circunstancias.",
        },
        {
          q: "¿Se puede demandar a los abuelos?",
          a:
            "Sí. Cuando los alimentos decretados no fueran pagados o no fueran suficientes para solventar las necesidades del hijo o hija, se podrá demandar a los abuelos.\n\n" +
            "Excepción: no procede si la única fuente de ingreso de los abuelos corresponde a una pensión de vejez, invalidez o sobrevivencia.",
        },
      ],
      articuloRelacionado: "cobrar-pension-alimentos-impaga",
      revisadoPorAbogado: true,
    },
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

/**
 * Productos que pueden generar página pública.
 *
 * Un producto entra solo si tiene contenido y está revisado. Esta función es
 * la única puerta: la ruta, el sitemap y el llms.txt derivan todos de acá, así
 * que no hay forma de publicar por un canal y olvidarse de otro.
 */
export function getProductosPublicados(): ProductoJuridico[] {
  return getAllProductos().filter(
    (producto) =>
      producto.seo !== undefined &&
      producto.seo.revisadoPorAbogado &&
      producto.seo.faq.length > 0
  );
}

export function getProductoBySlug(slug: string): ProductoJuridico | undefined {
  return getProductosPublicados().find(
    (producto) => producto.seo!.slug === slug
  );
}
