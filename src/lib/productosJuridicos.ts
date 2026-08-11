import type { Area } from "@/lib/leadSchema";

export type Producto =
  | "recupera-casa"
  | "recupera-propiedad"
  | "recupera-pie"
  | "defiende-despido"
  | "cotizaciones-impagas"
  | "cobra-deuda"
  | "cobra-facturas"
  | "cobra-pension"
  | "condominio"
  | "divorcio-express"
  | "autodespido"
  | "derechos-consumidor";

export const PRODUCTOS_LIST: Producto[] = [
  "recupera-casa",
  "recupera-propiedad",
  "recupera-pie",
  "defiende-despido",
  "cotizaciones-impagas",
  "cobra-deuda",
  "cobra-facturas",
  "cobra-pension",
  "condominio",
  "divorcio-express",
  "autodespido",
  "derechos-consumidor",
];

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
}

export const PRODUCTO_TO_AREA: Record<Producto, Area> = {
  "recupera-casa": "inmobiliario",
  "recupera-propiedad": "inmobiliario",
  "recupera-pie": "inmobiliario",
  "defiende-despido": "laboral",
  "cotizaciones-impagas": "laboral",
  "cobra-deuda": "civil",
  "cobra-facturas": "civil",
  "cobra-pension": "familia",
  "condominio": "inmobiliario",
  "divorcio-express": "familia",
  "autodespido": "laboral",
  "derechos-consumidor": "civil",
};

export const PRODUCTOS_JURIDICOS: Record<Producto, ProductoJuridico> = {
  "recupera-casa": {
    id: "recupera-casa",
    nombre: "Recupera tu Casa",
    emoji: "🏠",
    eyebrow: "Arrendatario moroso",
    title: "¿Tu arrendatario no paga? Recupera tu propiedad en tribunales.",
    description: "Procedimiento monitorio para cobrar rentas y obtener la restitución del inmueble.",
    image: "/src/assets/hero-recupera-casa.jpg",
    backendArea: "inmobiliario",
    campos: [
      {
        name: "tieneContrato",
        type: "radio",
        label: "¿Tienes contrato de arriendo?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "mesesMora",
        type: "number",
        label: "¿Cuántos meses de mora?",
        required: true,
        placeholder: "Ej: 3",
      },
      {
        name: "montoTotal",
        type: "number",
        label: "Monto total adeudado (aprox.)",
        required: true,
        placeholder: "En pesos chilenos",
      },
      {
        name: "nombreArrendatario",
        type: "text",
        label: "Nombre del arrendatario",
        required: false,
      },
      {
        name: "direccionPropiedad",
        type: "text",
        label: "Dirección de la propiedad",
        required: true,
        placeholder: "Calle, número, ciudad",
      },
      {
        name: "hayConsumos",
        type: "radio",
        label: "¿Hay consumos de servicios (agua, luz, gas)?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "hayGastosComunes",
        type: "radio",
        label: "¿Hay gastos comunes adeudados?",
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
  "recupera-propiedad": {
    id: "recupera-propiedad",
    nombre: "Recupera tu Propiedad",
    emoji: "🏚️",
    eyebrow: "Precario / comodato",
    title: "Alguien ocupa tu propiedad sin pagar. Te ayudamos a recuperarla.",
    description: "Procedimiento monitorio para acción de precario y comodato precario.",
    image: "/src/assets/hero-recupera-propiedad.jpg",
    backendArea: "inmobiliario",
    campos: [
      {
        name: "existeContrato",
        type: "select",
        label: "¿Existe contrato de arriendo u otro título?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
          { value: "no_se", label: "No lo sé" },
        ],
      },
      {
        name: "tipoOcupacion",
        type: "select",
        label: "¿Qué tipo de ocupación es?",
        required: true,
        options: [
          { value: "comodato", label: "Comodato (préstamo)" },
          { value: "precario", label: "Precario (sin título)" },
          { value: "herencia", label: "Cuestión hereditaria" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        name: "tiempoOcupacion",
        type: "select",
        label: "¿Cuánto tiempo lleva ocupando?",
        required: true,
        options: [
          { value: "menos_1", label: "Menos de 1 año" },
          { value: "1_2", label: "1-2 años" },
          { value: "mas_2", label: "Más de 2 años" },
        ],
      },
      {
        name: "tieneInscripcion",
        type: "radio",
        label: "¿Tienes inscripción de dominio?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "ocupanteAfirmaDerechos",
        type: "radio",
        label: "¿El ocupante afirma tener derechos hereditarios, promesa o aportes?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "direccionPropiedad",
        type: "text",
        label: "Dirección de la propiedad",
        required: true,
        placeholder: "Calle, número, ciudad",
      },
    ],
    placeholder: "¿Cuánto tiempo lleva ocupando la propiedad?, ¿hay documentos que justifiquen la ocupación?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, tengo un problema con alguien que ocupa mi propiedad sin pagar.",
  },
  "recupera-pie": {
    id: "recupera-pie",
    nombre: "Recupera tu Pie",
    emoji: "🏗️",
    eyebrow: "Inmobiliaria retiene pie",
    title: "¿La inmobiliaria se quedó con tu pie? Recupera tu dinero.",
    description: "Defensa de derechos del consumidor y acción de restitución.",
    image: "/src/assets/hero-recupera-pie.jpg",
    backendArea: "inmobiliario",
    campos: [
      {
        name: "montoPie",
        type: "number",
        label: "Monto pagado como pie",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "motivoRechazo",
        type: "select",
        label: "¿Cuál fue el motivo del rechazo?",
        required: true,
        options: [
          { value: "hipotecario", label: "Rechazo de crédito hipotecario" },
          { value: "requisitos", label: "Falta de requisitos" },
          { value: "cambio_planes", label: "Cambio de planes propios" },
          { value: "otro", label: "Otro" },
        ],
      },
      {
        name: "tienePromesa",
        type: "radio",
        label: "¿Tienes copia de la promesa de compraventa?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "montoRetenido",
        type: "number",
        label: "¿Cuánto retiene la inmobiliaria?",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "inmobiliaria",
        type: "text",
        label: "Nombre de la inmobiliaria",
        required: false,
      },
      {
        name: "etapaProyecto",
        type: "select",
        label: "¿En qué etapa estaba el proyecto?",
        required: false,
        options: [
          { value: "aprobado", label: "Proyecto aprobado" },
          { value: "construccion", label: "En construcción" },
          { value: "verde", label: "Proyecto en verde" },
        ],
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
    image: "/src/assets/hero-defiende-despido.jpg",
    backendArea: "laboral",
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "¿Cuándo te despidieron?",
        required: true,
      },
      {
        name: "sueldoMensual",
        type: "number",
        label: "¿Cuál era tu sueldo mensual?",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "causalEnCarta",
        type: "text",
        label: "¿Qué causal escribieron en la carta de despido?",
        required: true,
        placeholder: "Ej: desahucio, incumplimiento de funciones, etc.",
      },
      {
        name: "recibisteLiquidacion",
        type: "radio",
        label: "¿Recibiste liquidación de prestaciones?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "vacacionesImpagas",
        type: "radio",
        label: "¿Tienes vacaciones impagas?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "cotizacionesAlDia",
        type: "radio",
        label: "¿Tus cotizaciones estaban al día?",
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
    image: "/src/assets/hero-cotizaciones-impagas.jpg",
    backendArea: "laboral",
    campos: [
      {
        name: "fechaDespido",
        type: "date",
        label: "¿Cuándo te despidieron?",
        required: true,
      },
      {
        name: "tieneCartaDespido",
        type: "radio",
        label: "¿Tienes copia de la carta de despido?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "mesesSinCotizar",
        type: "number",
        label: "¿Cuántos meses sin cotizar (antes del despido)?",
        required: true,
        placeholder: "Ej: 2, 3, 6",
      },
      {
        name: "tieneComprobanteCotizaciones",
        type: "radio",
        label: "¿Puedes acceder a tu historial AFP/Fonasa?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "sueldo",
        type: "number",
        label: "¿Cuál era tu sueldo mensual?",
        required: false,
        placeholder: "En pesos",
      },
    ],
    placeholder: "¿Puedes acceder a tu historial de AFP o Fonasa para verificar las cotizaciones?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me despidieron y creo que tenía cotizaciones impagas.",
  },
  "cobra-deuda": {
    id: "cobra-deuda",
    nombre: "Cobra tu Deuda",
    emoji: "💰",
    eyebrow: "Pagaré, cheque o deuda",
    title: "¿Te deben dinero? Evaluamos si puedes cobrarlo judicialmente.",
    description: "Juicio ejecutivo para recuperar deudas respaldadas por documentos.",
    image: "/src/assets/hero-cobra-deuda.jpg",
    backendArea: "civil",
    campos: [
      {
        name: "tipoDocumento",
        type: "select",
        label: "¿Qué tipo de documento tienes?",
        required: true,
        options: [
          { value: "pagare", label: "Pagaré" },
          { value: "cheque", label: "Cheque" },
          { value: "reconocimiento", label: "Reconocimiento de deuda" },
          { value: "contrato", label: "Contrato" },
          { value: "factura", label: "Factura" },
          { value: "otro", label: "Otro documento" },
        ],
      },
      {
        name: "montoDeuda",
        type: "number",
        label: "¿Cuánto dinero es la deuda?",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "nombreDeudor",
        type: "text",
        label: "Nombre o razón social del deudor",
        required: true,
      },
      {
        name: "tieneDocumentoOriginal",
        type: "radio",
        label: "¿Tienes el documento original?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "deudorEsEmpresa",
        type: "radio",
        label: "¿El deudor es una empresa o persona?",
        required: false,
        options: [
          { value: "empresa", label: "Empresa" },
          { value: "persona", label: "Persona" },
        ],
      },
      {
        name: "fechaDeuda",
        type: "date",
        label: "¿Cuándo se contrajo la deuda?",
        required: false,
      },
    ],
    placeholder: "¿Tienes el documento original?, ¿el deudor reconoce la deuda?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me deben dinero y quiero cobrar judicialmente.",
  },
  "cobra-facturas": {
    id: "cobra-facturas",
    nombre: "Cobra tu Factura",
    emoji: "🧾",
    eyebrow: "B2B - Cobranza empresarial",
    title: "¿Clientes que no pagan? Automatiza la cobranza.",
    description: "Procedimiento ejecutivo para empresas y proveedores.",
    image: "/src/assets/hero-cobra-facturas.jpg",
    backendArea: "civil",
    campos: [
      {
        name: "montoFactura",
        type: "number",
        label: "Monto de la factura",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "numeroFactura",
        type: "text",
        label: "Número de factura",
        required: false,
      },
      {
        name: "nombreProveedor",
        type: "text",
        label: "¿A quién le facturaste los servicios/productos?",
        required: true,
      },
      {
        name: "diasMorosidad",
        type: "number",
        label: "¿Cuántos días vencida está la factura?",
        required: true,
        placeholder: "Ej: 30, 60, 90",
      },
      {
        name: "esClienteRecurrente",
        type: "radio",
        label: "¿Es cliente habitual?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "tieneContrato",
        type: "radio",
        label: "¿Hay contrato de servicios?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿Hay contrato de servicios?, ¿es cliente habitual?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, tengo facturas impagas y quiero cobrar.",
  },
  "cobra-pension": {
    id: "cobra-pension",
    nombre: "Cobra tu Pensión",
    emoji: "👶",
    eyebrow: "Alimentos adeudados",
    title: "¿Te deben pensión de alimentos? Ejecuta el cobro.",
    description: "Procedimiento especial para pensiones adeudadas con mérito ejecutivo.",
    image: "/src/assets/hero-cobra-pension.jpg",
    backendArea: "familia",
    campos: [
      {
        name: "montoPension",
        type: "number",
        label: "¿Cuánto es la pensión mensual?",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "mesesAtrasados",
        type: "number",
        label: "¿Cuántos meses adeudados?",
        required: true,
        placeholder: "Ej: 3, 6, 12",
      },
      {
        name: "haySentencia",
        type: "radio",
        label: "¿Hay sentencia vigente de pensión?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "deudorEsIdentificado",
        type: "radio",
        label: "¿Sabes dónde vive o trabaja?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "deudorTieneTrabajo",
        type: "select",
        label: "¿El deudor tiene trabajo?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
          { value: "no_se", label: "No lo sé" },
        ],
      },
    ],
    placeholder: "¿Tienes la sentencia de alimentos?, ¿sabes dónde trabaja?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, me deben pensión de alimentos.",
  },
  "condominio": {
    id: "condominio",
    nombre: "Condominio sin Morosos",
    emoji: "🏢",
    eyebrow: "Gastos comunes adeudados",
    title: "¿Vecinos con mora? Cobranza judicial para condominios.",
    description: "Procedimiento ejecutivo para administradores de comunidades.",
    image: "/src/assets/hero-condominio.jpg",
    backendArea: "inmobiliario",
    campos: [
      {
        name: "tuRol",
        type: "select",
        label: "¿Cuál es tu rol?",
        required: true,
        options: [
          { value: "administrador", label: "Administrador del condominio" },
          { value: "propietario_deuda", label: "Propietario con deuda" },
          { value: "propietario_querellante", label: "Propietario querellante" },
        ],
      },
      {
        name: "mesesMora",
        type: "number",
        label: "¿Cuántos meses en mora los deudores?",
        required: true,
        placeholder: "Ej: 3, 6, 12",
      },
      {
        name: "numeroDeudores",
        type: "number",
        label: "¿Cuántas unidades/propietarios con mora?",
        required: true,
        placeholder: "Ej: 1, 2, 5",
      },
      {
        name: "montoEstimado",
        type: "number",
        label: "Monto total adeudado (aproximado)",
        required: false,
        placeholder: "En pesos",
      },
      {
        name: "tipoCondominio",
        type: "select",
        label: "¿Tipo de condominio?",
        required: false,
        options: [
          { value: "departamentos", label: "Departamentos" },
          { value: "casa_condominio", label: "Casa en condominio" },
          { value: "oficinas", label: "Oficinas" },
          { value: "comercios", label: "Comercios" },
          { value: "mixto", label: "Mixto" },
        ],
      },
    ],
    placeholder: "¿Hay conflicto entre propietarios?, ¿tienes los avisos de cobro formales?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, tengo propietarios con mora en gastos comunes.",
  },
  "divorcio-express": {
    id: "divorcio-express",
    nombre: "Divorcio Express",
    emoji: "💔",
    eyebrow: "Mutuo acuerdo",
    title: "¿Te quieres divorciar de mutuo acuerdo? Rápido y sin conflicto.",
    description: "Divorcio notarial o judicial con acuerdo total.",
    image: "/src/assets/hero-divorcio-express.jpg",
    backendArea: "familia",
    campos: [
      {
        name: "mutuoAcuerdo",
        type: "radio",
        label: "¿Es de mutuo acuerdo?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "hayHijos",
        type: "radio",
        label: "¿Hay hijos menores?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "tiempoSeparacion",
        type: "select",
        label: "¿Cuánto tiempo llevan separados?",
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
        label: "¿Ya tienen acuerdo completamente?",
        required: true,
        options: [
          { value: "si", label: "Sí, en todo" },
          { value: "no", label: "No, hay temas pendientes" },
        ],
      },
      {
        name: "acuerdoAlimentos",
        type: "radio",
        label: "¿Hay acuerdo sobre alimentos (si aplica)?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
          { value: "no_aplica", label: "No aplica" },
        ],
      },
      {
        name: "acuerdoCustodiaVisitas",
        type: "radio",
        label: "¿Hay acuerdo sobre cuidado personal y visitas?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
          { value: "no_aplica", label: "No aplica" },
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
    image: "/src/assets/hero-autodespido.jpg",
    backendArea: "laboral",
    campos: [
      {
        name: "fechaAutodespido",
        type: "date",
        label: "¿Cuándo comunicaste tu retiro?",
        required: true,
      },
      {
        name: "motivoIncumplimiento",
        type: "select",
        label: "¿Cuál fue el incumplimiento grave del empleador?",
        required: true,
        options: [
          { value: "falta_pago", label: "No paga sueldos" },
          { value: "ambiente_hostil", label: "Ambiente hostil o acoso" },
          { value: "cambio_terminos", label: "Cambio unilateral de términos" },
          { value: "falta_seguridad", label: "Falta de medidas de seguridad" },
          { value: "otro", label: "Otro incumplimiento" },
        ],
      },
      {
        name: "tieneDocumentacion",
        type: "radio",
        label: "¿Tienes documentación del incumplimiento?",
        required: true,
        options: [
          { value: "si", label: "Sí (correos, mensajes, etc.)" },
          { value: "no", label: "No tengo documentación" },
        ],
      },
      {
        name: "enviastiCarta",
        type: "radio",
        label: "¿Enviaste carta de aviso previo al empleador?",
        required: false,
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
  "derechos-consumidor": {
    id: "derechos-consumidor",
    nombre: "Derechos de Consumidor",
    emoji: "🛒",
    eyebrow: "SERNAC - Protección del consumidor",
    title: "¿Producto defectuoso o servicio incumplido? Defiende tus derechos.",
    description: "Demanda indemnizatoria ante Juzgado de Policía Local.",
    image: "/src/assets/hero-derechos-consumidor.jpg",
    backendArea: "civil",
    campos: [
      {
        name: "tipoProblema",
        type: "select",
        label: "¿Qué tipo de problema tienes?",
        required: true,
        options: [
          { value: "no_entregado", label: "Producto no entregado" },
          { value: "garantia_negada", label: "Garantía negada" },
          { value: "servicio_no_prestado", label: "Servicio pagado y no prestado" },
          { value: "cobro_indebido", label: "Cobro indebido" },
          { value: "danio_perdida", label: "Daño o pérdida" },
          { value: "incumplimiento", label: "Incumplimiento de contrato" },
        ],
      },
      {
        name: "montoAfectado",
        type: "number",
        label: "¿Cuánto dinero estás perdiendo?",
        required: true,
        placeholder: "En pesos",
      },
      {
        name: "nombreProveedor",
        type: "text",
        label: "Nombre de la empresa o proveedor",
        required: true,
      },
      {
        name: "tieneDocumentacion",
        type: "radio",
        label: "¿Tienes comprobante de pago?",
        required: true,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "yaReclamaste",
        type: "radio",
        label: "¿Ya reclamaste ante el proveedor?",
        required: false,
        options: [
          { value: "si", label: "Sí" },
          { value: "no", label: "No" },
        ],
      },
    ],
    placeholder: "¿Ya contactaste al proveedor?, ¿tienes evidencia del problema?",
    cta: "Evaluar mi caso",
    whatsappMessage: "Hola, tengo un problema como consumidor y quiero reclamar.",
  },
};

export function getProducto(id: Producto): ProductoJuridico | undefined {
  return PRODUCTOS_JURIDICOS[id];
}

export function getAllProductos(): ProductoJuridico[] {
  return Object.values(PRODUCTOS_JURIDICOS);
}
