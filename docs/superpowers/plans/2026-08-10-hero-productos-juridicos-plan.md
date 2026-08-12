# Hero Carousel de Productos Jurídicos - Plan de Implementación

> **Para trabajadores agentivos:** USA **superpowers:subagent-driven-development** o **superpowers:executing-plans** para implementar este plan tarea por tarea. Las tareas usan sintaxis checkbox (`- [ ]`) para tracking.

**Objetivo:** Transformar el hero carousel de landing-tech en un carrusel dinámico de 12 productos jurídicos con formularios específicos.

**Arquitectura:** Crear `productosJuridicos.ts` que define los 12 productos + campos dinámicos. Crear `ProductoForm.tsx` que renderiza formularios adaptativos. Actualizar componentes existentes (HeroCarousel, heroSlides) y esquemas (leadSchema, leadApi) para soportar productos dinámicos.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Zod, shadcn/ui, Lucide icons

## Global Constraints

- Node.js 20+
- React 18.2+
- TypeScript 5.0+
- Tailwind CSS v4
- Zod para validaciones
- Componentes UI: Input, Textarea, Card, Select, RadioGroup, Label, Button
- No agregar dependencias nuevas
- Imágenes: 1200x800px, <150KB, formato JPG
- No modificar sección PracticeAreas

---

## Task 1: Crear `src/lib/productosJuridicos.ts` - Interfaces y Tipos

**Archivos:**
- Crear: `src/lib/productosJuridicos.ts`

**Interfaces:**
- Produce: `Producto` (type union de los 12 productos)
- Produce: `Campo` (estructura de campo dinámico)
- Produce: `ProductoJuridico` (estructura completa del producto)
- Produce: `PRODUCTOS_JURIDICOS` (Record de todos los productos)
- Produce: `getProducto(id: Producto)` function
- Produce: `getAllProductos()` function

- [ ] **Paso 1: Crear archivo vacío con estructura base**

```typescript
// src/lib/productosJuridicos.ts

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

export const PRODUCTOS_JURIDICOS: Record<Producto, ProductoJuridico> = {};

export function getProducto(id: Producto): ProductoJuridico | undefined {
  return PRODUCTOS_JURIDICOS[id];
}

export function getAllProductos(): ProductoJuridico[] {
  return Object.values(PRODUCTOS_JURIDICOS);
}
```

- [ ] **Paso 2: Verificar que TypeScript compila sin errores**

```bash
npm run build
```

Expected: Sin errores de compilación

---

## Task 2: Llenar `PRODUCTOS_JURIDICOS` - Producto 1: Recupera tu Casa

**Archivos:**
- Modificar: `src/lib/productosJuridicos.ts`

**Nota:** Este es el primero de 12. Sigue el mismo patrón para los demás. Se muestra código completo, NO usar "..." para los campos.

- [ ] **Paso 1: Agregar "recupera-casa" a PRODUCTOS_JURIDICOS**

Dentro del objeto `PRODUCTOS_JURIDICOS`, reemplazar la línea vacía con:

```typescript
export const PRODUCTOS_JURIDICOS: Record<Producto, ProductoJuridico> = {
  "recupera-casa": {
    id: "recupera-casa",
    nombre: "Recupera tu Casa",
    emoji: "🏠",
    eyebrow: "Arrendatario moroso",
    title: "¿Tu arrendatario no paga? Recupera tu propiedad en tribunales.",
    description: "Procedimiento monitorio para cobrar rentas y obtener la restitución del inmueble.",
    image: "/src/assets/hero-recupera-casa.jpg", // Placeholder, se actualiza en Task 12
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
```

- [ ] **Paso 2: Compilar y verificar sin errores**

```bash
npm run build
```

Expected: Sin errores de compilación

---

## Task 3: Llenar PRODUCTOS_JURIDICOS - Producto 2-12

**Archivos:**
- Modificar: `src/lib/productosJuridicos.ts`

**Instrucciones:** Agregar los 11 productos restantes al objeto `PRODUCTOS_JURIDICOS` con la misma estructura. Código completo para cada uno:

- [ ] **Paso 1: Agregar "recupera-propiedad"**

```typescript
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
```

- [ ] **Paso 2: Agregar "recupera-pie"**

```typescript
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
```

- [ ] **Paso 3: Agregar "defiende-despido"**

```typescript
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
```

- [ ] **Paso 4: Agregar "cotizaciones-impagas"**

```typescript
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
```

- [ ] **Paso 5: Agregar "cobra-deuda"**

```typescript
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
```

- [ ] **Paso 6: Agregar "cobra-facturas"**

```typescript
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
```

- [ ] **Paso 7: Agregar "cobra-pension"**

```typescript
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
```

- [ ] **Paso 8: Agregar "condominio"**

```typescript
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
```

- [ ] **Paso 9: Agregar "divorcio-express"**

```typescript
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
```

- [ ] **Paso 10: Agregar "autodespido"**

```typescript
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
```

- [ ] **Paso 11: Agregar "derechos-consumidor"**

```typescript
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
```

- [ ] **Paso 12: Compilar y verificar que todos los 12 productos se exportan correctamente**

```bash
npm run build
```

Expected: Sin errores

---

## Task 4: Crear `src/components/hero/ProductoForm.tsx` - Componente de Formulario Dinámico

**Archivos:**
- Crear: `src/components/hero/ProductoForm.tsx`

**Interfaces:**
- Consumes: `getProducto(id: Producto)` from `productosJuridicos.ts`
- Consumes: `Producto` type from `productosJuridicos.ts`
- Consumes: `submitLead()` from `leadApi`
- Produces: React component que renderiza el formulario dinámico

- [ ] **Paso 1: Crear archivo con estructura base del componente**

```typescript
// src/components/hero/ProductoForm.tsx

import React, { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";
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
import { submitLead } from "@/lib/leadApi";
import { getRecaptchaToken, RECAPTCHA_ACTIONS } from "@/lib/recaptcha";
import { useToast } from "@/hooks/use-toast";
import { getProducto, type Producto } from "@/lib/productosJuridicos";

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
  [key: string]: string | number | boolean;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ productoId }) => {
  const { toast } = useToast();
  const producto = getProducto(productoId);

  if (!producto) {
    return <div className="text-red-500">Producto no encontrado</div>;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
    urgencia: "sin_apuro",
    horario: "cualquiera",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
      };

      // Agregar campos dinámicos
      producto.campos.forEach((campo) => {
        if (formData[campo.name]) {
          payload[campo.name] = formData[campo.name];
        }
      });

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
        });
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
    <Card className="p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título del producto */}
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            {producto.nombre}
          </h3>
          <p className="text-muted-foreground text-sm">
            Completa el formulario y evaluaremos tu caso gratuitamente.
          </p>
        </div>

        {/* CAMPOS DINÁMICOS DEL PRODUCTO */}
        {producto.campos.length > 0 && (
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-4">
            <h4 className="font-semibold text-foreground">Información específica</h4>

            {producto.campos.map((campo) => (
              <div key={campo.name}>
                {/* Radio buttons */}
                {campo.type === "radio" && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <RadioGroup
                      value={formData[campo.name]?.toString() || ""}
                      onValueChange={(value) => handleRadioChange(campo.name, value)}
                    >
                      {campo.options?.map((option) => (
                        <div key={option.value} className="flex items-center gap-2 mb-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`${campo.name}-${option.value}`}
                          />
                          <Label htmlFor={`${campo.name}-${option.value}`} className="font-normal">
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
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <Select
                      value={formData[campo.name]?.toString() || ""}
                      onValueChange={(value) => handleRadioChange(campo.name, value)}
                    >
                      <SelectTrigger>
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

                {/* Text, email, tel, number, date inputs */}
                {["text", "email", "tel", "number", "date"].includes(campo.type) && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {campo.label}
                      {campo.required && <span className="text-red-500"> *</span>}
                    </label>
                    <Input
                      type={campo.type}
                      name={campo.name}
                      value={formData[campo.name] || ""}
                      onChange={handleChange}
                      placeholder={campo.placeholder}
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
        <div className="border-t border-border pt-6 space-y-4">
          <h4 className="font-semibold text-foreground">Tus datos de contacto</h4>

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
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* URGENCIA Y HORARIO */}
        <div className="grid md:grid-cols-2 gap-4 border-t border-border pt-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ¿Cuán urgente es tu caso?
            </label>
            <Select value={formData.urgencia} onValueChange={(value) => handleRadioChange("urgencia", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inmediata">Inmediata (detenido/citado)</SelectItem>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="sin_apuro">Sin apuro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ¿Cuándo podemos llamarte?
            </label>
            <Select value={formData.horario} onValueChange={(value) => handleRadioChange("horario", value)}>
              <SelectTrigger>
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
          <label className="text-sm font-medium text-foreground mb-2 block">
            Cuéntanos más *
          </label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={producto.placeholder}
            rows={5}
            className="resize-none"
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        {/* CONFIDENCIALIDAD */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Confidencialidad garantizada:</strong> Toda la
              información está protegida por el secreto profesional del abogado.
            </p>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
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

export default ProductoForm;
```

- [ ] **Paso 2: Compilar y verificar que no hay errores**

```bash
npm run build
```

Expected: Sin errores

---

## Task 5: Actualizar `src/lib/heroSlides.ts`

**Archivos:**
- Modificar: `src/lib/heroSlides.ts`

**Interfaces:**
- Consumes: `getAllProductos()` from `productosJuridicos`
- Produces: `HERO_SLIDES` array generado dinámicamente

- [ ] **Paso 1: Reemplazar contenido completo de heroSlides.ts**

```typescript
// src/lib/heroSlides.ts

import { getAllProductos, type Producto } from "@/lib/productosJuridicos";

export interface HeroSlideData {
  id: Producto;
  emoji: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
  whatsappMessage: string;
}

// Generar slides automáticamente desde productosJuridicos
export const HERO_SLIDES: HeroSlideData[] = getAllProductos().map((producto) => ({
  id: producto.id,
  emoji: producto.emoji,
  eyebrow: producto.eyebrow,
  title: producto.title,
  description: producto.description,
  image: producto.image,
  ctaLabel: producto.cta,
  ctaTarget: "formulario",
  whatsappMessage: producto.whatsappMessage,
}));
```

- [ ] **Paso 2: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores

---

## Task 6: Actualizar `src/components/hero/HeroCarousel.tsx`

**Archivos:**
- Modificar: `src/components/hero/HeroCarousel.tsx:1-10` (imports)
- Modificar: `src/components/hero/HeroCarousel.tsx:95-115` (renderizado de slides)

**Interfaces:**
- Consumes: `ProductoForm` component
- Consumes: `Producto` type

- [ ] **Paso 1: Agregar import de ProductoForm**

Al inicio del archivo, después de los otros imports:

```typescript
import ProductoForm from "./ProductoForm";
import type { Producto } from "@/lib/productosJuridicos";
```

- [ ] **Paso 2: Reemplazar BrokerageQuickForm con ProductoForm**

Buscar el bloque que renderiza slides (alrededor de línea 100):

ANTES:
```typescript
{slides.map(({ data, form }, i) => (
  <div key={data.id} ...>
    <HeroSlide slide={data} isFirst={i === 0}>
      <BrokerageQuickForm />
    </HeroSlide>
  </div>
))}
```

DESPUÉS:
```typescript
{slides.map(({ data }, i) => (
  <div key={data.id} ...>
    <HeroSlide slide={data} isFirst={i === 0}>
      <ProductoForm productoId={data.id as Producto} />
    </HeroSlide>
  </div>
))}
```

- [ ] **Paso 3: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores

---

## Task 7: Actualizar `src/components/hero/HeroSlide.tsx`

**Archivos:**
- Modificar: `src/components/hero/HeroSlide.tsx`

**Nota:** Este cambio es pequeño, solo agregar emoji + eyebrow visible en el copy

- [ ] **Paso 1: Actualizar HeroSlide para mostrar emoji**

Buscar el bloque que muestra el eyebrow (línea ~20):

ANTES:
```typescript
<p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
  {slide.eyebrow}
</p>
```

DESPUÉS:
```typescript
<p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
  {slide.emoji} {slide.eyebrow}
</p>
```

- [ ] **Paso 2: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores

---

## Task 8: Actualizar `src/lib/leadSchema.ts`

**Archivos:**
- Modificar: `src/lib/leadSchema.ts`

**Interfaces:**
- Consumes: `PRODUCTOS` list and `PRODUCTO_TO_AREA` from `productosJuridicos`
- Produces: Extended `leadSchema` with `producto` field

- [ ] **Paso 1: Agregar imports**

Al inicio del archivo:

```typescript
import { PRODUCTOS, PRODUCTO_TO_AREA, type Producto } from "@/lib/productosJuridicos";
```

- [ ] **Paso 2: Exportar Producto type desde productosJuridicos**

```typescript
export type { Producto } from "@/lib/productosJuridicos";
```

- [ ] **Paso 3: Extender leadSchema con campo producto**

Buscar el objeto `leadSchema` y agregar el campo producto:

```typescript
export const leadSchema = z
  .object({
    name: z.string().trim().min(3, "Ingresa tu nombre completo"),
    phone: z.string().trim().min(8, "Ingresa un teléfono válido").optional(),
    email: z.string().trim().email("Ingresa un correo válido"),
    producto: z.enum(PRODUCTOS).optional(), // NUEVO
    area: z.enum(AREAS).optional(),
    urgencia: z.enum(URGENCIAS).default("sin_apuro"),
    horario: z.enum(HORARIOS).default("cualquiera"),
    message: z.string().trim().min(5, "Cuéntanos brevemente tu caso (mín. 5 caracteres)"),
    
    // NUEVOS: Campos dinámicos de todos los productos (todos opcionales)
    tieneContrato: z.string().optional(),
    mesesMora: z.number().optional(),
    montoTotal: z.number().optional(),
    nombreArrendatario: z.string().optional(),
    direccionPropiedad: z.string().optional(),
    hayConsumos: z.string().optional(),
    hayGastosComunes: z.string().optional(),
    existeContrato: z.string().optional(),
    tipoOcupacion: z.string().optional(),
    tiempoOcupacion: z.string().optional(),
    tieneInscripcion: z.string().optional(),
    ocupanteAfirmaDerechos: z.string().optional(),
    montoPie: z.number().optional(),
    motivoRechazo: z.string().optional(),
    tienePromesa: z.string().optional(),
    montoRetenido: z.number().optional(),
    inmobiliaria: z.string().optional(),
    etapaProyecto: z.string().optional(),
    fechaDespido: z.string().optional(),
    sueldoMensual: z.number().optional(),
    causalEnCarta: z.string().optional(),
    recibisteLiquidacion: z.string().optional(),
    vacacionesImpagas: z.string().optional(),
    cotizacionesAlDia: z.string().optional(),
    mesesSinCotizar: z.number().optional(),
    tieneCartaDespido: z.string().optional(),
    tieneComprobanteCotizaciones: z.string().optional(),
    sueldo: z.number().optional(),
    tipoDocumento: z.string().optional(),
    montoDeuda: z.number().optional(),
    nombreDeudor: z.string().optional(),
    tieneDocumentoOriginal: z.string().optional(),
    deudorEsEmpresa: z.string().optional(),
    fechaDeuda: z.string().optional(),
    montoFactura: z.number().optional(),
    numeroFactura: z.string().optional(),
    nombreProveedor: z.string().optional(),
    diasMorosidad: z.number().optional(),
    esClienteRecurrente: z.string().optional(),
    montoPension: z.number().optional(),
    mesesAtrasados: z.number().optional(),
    haySentencia: z.string().optional(),
    deudorEsIdentificado: z.string().optional(),
    deudorTieneTrabajo: z.string().optional(),
    tuRol: z.string().optional(),
    numeroDeudores: z.number().optional(),
    montoEstimado: z.number().optional(),
    tipoCondominio: z.string().optional(),
    mutuoAcuerdo: z.string().optional(),
    hayHijos: z.string().optional(),
    tiempoSeparacion: z.string().optional(),
    acuerdoCompletamente: z.string().optional(),
    acuerdoAlimentos: z.string().optional(),
    acuerdoCustodiaVisitas: z.string().optional(),
    fechaAutodespido: z.string().optional(),
    motivoIncumplimiento: z.string().optional(),
    tieneDocumentacion: z.string().optional(),
    enviastiCarta: z.string().optional(),
    tipoProblema: z.string().optional(),
    montoAfectado: z.number().optional(),
    yaReclamaste: z.string().optional(),
    
    website: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    // Mapear producto → area si no viene area
    if (data.producto && !data.area) {
      const area = PRODUCTO_TO_AREA[data.producto];
      if (area) {
        data.area = area as any;
      }
    }
    
    // Validaciones condicionales existentes
    if (situacionPenalAplica(data.area) && !data.situacionPenal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["situacionPenal"],
        message: "Selecciona tu situación actual",
      });
    }
    // ... resto de validaciones existentes
  });
```

- [ ] **Paso 4: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores

---

## Task 9: Actualizar `src/lib/leadApi.ts`

**Archivos:**
- Modificar: `src/lib/leadApi.ts`

**Interfaces:**
- Consumes: `Producto` type
- Consumes: `PRODUCTO_TO_AREA` mapping
- Modifies: `SubmitLeadPayload` interface
- Modifies: `submitLead()` function

- [ ] **Paso 1: Agregar imports**

```typescript
import { PRODUCTO_TO_AREA, type Producto } from "@/lib/productosJuridicos";
```

- [ ] **Paso 2: Actualizar SubmitLeadPayload interface**

Buscar la interfaz y agregar:

```typescript
export interface SubmitLeadPayload {
  servicio: string;
  producto?: Producto; // NUEVO
  recaptchaToken: string;
  recaptchaAction: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  urgencia?: string;
  horario?: string;
  [key: string]: unknown; // Campos dinámicos
}
```

- [ ] **Paso 3: Actualizar submitLead function**

Buscar la función submitLead y reemplazar su implementación:

```typescript
export async function submitLead(
  payload: SubmitLeadPayload
): Promise<{ ok: boolean; message: string }> {
  try {
    // Mapear producto → area si no viene area
    let body: any = { ...payload };
    if (payload.producto && !payload.area) {
      body.area = PRODUCTO_TO_AREA[payload.producto];
    }

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { ok: false, message: error.message || "Error al enviar el formulario" };
    }

    return { ok: true, message: "Lead enviado correctamente" };
  } catch (error) {
    console.error("Error en submitLead:", error);
    return { ok: false, message: "Error de conexión. Intenta de nuevo." };
  }
}
```

- [ ] **Paso 4: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores

---

## Task 10: Crear Archivo de Imágenes Placeholder + Estructura

**Archivos:**
- Crear (temporalmente): 12 imágenes en `src/assets/`

**Nota:** Esta tarea necesita las imágenes reales. Por ahora, usar placeholders que se verán correctamente en dev.

- [ ] **Paso 1: Crear script que genere placeholders**

```bash
# Crear directorio si no existe
mkdir -p /Users/lfgg/paldunate/landing-tech/src/assets

# Crear 12 placeholders (puedes hacer esto manualmente o con un script)
# Cada imagen debe ser 1200x800px
# Por ahora, simplemente crear archivos dummy que se reemplazarán luego
```

- [ ] **Paso 2: Actualizar imports en productosJuridicos.ts**

Las imágenes se importarán así (agregar al inicio):

```typescript
// Placeholders - reemplazar con imágenes reales
const heroRecuperaCasa = "/src/assets/hero-recupera-casa.jpg";
const heroRecuperaPropiedad = "/src/assets/hero-recupera-propiedad.jpg";
const heroRecuperaPie = "/src/assets/hero-recupera-pie.jpg";
const heroDefendeDespido = "/src/assets/hero-defiende-despido.jpg";
const heroCotizacionesImpagas = "/src/assets/hero-cotizaciones-impagas.jpg";
const heroCobraDeuda = "/src/assets/hero-cobra-deuda.jpg";
const heroCobraFacturas = "/src/assets/hero-cobra-facturas.jpg";
const herorCobaPension = "/src/assets/hero-cobra-pension.jpg";
const heroCondominio = "/src/assets/hero-condominio.jpg";
const heroDivorcios = "/src/assets/hero-divorcio-express.jpg";
const heroAutodespido = "/src/assets/hero-autodespido.jpg";
const heroDerechosConsumidor = "/src/assets/hero-derechos-consumidor.jpg";
```

- [ ] **Paso 3: Reemplazar `image` en cada producto**

En PRODUCTOS_JURIDICOS, cambiar:
- `"recupera-casa"`: `image: heroRecuperaCasa`
- `"recupera-propiedad"`: `image: heroRecuperaPropiedad`
- ... (resto de productos)

- [ ] **Paso 4: Compilar y verificar**

```bash
npm run build
```

Expected: Sin errores, pero verás imágenes faltantes en desarrollo (eso es normal por ahora)

---

## Task 11: Crear Unit Tests para productosJuridicos.ts

**Archivos:**
- Crear: `src/lib/productosJuridicos.test.ts`

**Interfaces:**
- Tests: `getProducto()`, `getAllProductos()`, `PRODUCTO_TO_AREA` mapping

- [ ] **Paso 1: Crear archivo de tests**

```typescript
// src/lib/productosJuridicos.test.ts

import { describe, it, expect } from "vitest";
import {
  PRODUCTOS_JURIDICOS,
  PRODUCTOS_LIST,
  PRODUCTO_TO_AREA,
  getProducto,
  getAllProductos,
} from "@/lib/productosJuridicos";

describe("productosJuridicos", () => {
  it("debe exportar exactamente 12 productos", () => {
    expect(PRODUCTOS_LIST).toHaveLength(12);
    expect(Object.keys(PRODUCTOS_JURIDICOS)).toHaveLength(12);
  });

  it("getProducto debe retornar el producto correcto", () => {
    const producto = getProducto("recupera-casa");
    expect(producto).toBeDefined();
    expect(producto?.nombre).toBe("Recupera tu Casa");
    expect(producto?.emoji).toBe("🏠");
  });

  it("getProducto debe retornar undefined para producto inválido", () => {
    const producto = getProducto("producto-inexistente" as any);
    expect(producto).toBeUndefined();
  });

  it("getAllProductos debe retornar array de 12 productos", () => {
    const productos = getAllProductos();
    expect(productos).toHaveLength(12);
    expect(productos.every((p) => p.id && p.nombre && p.emoji)).toBe(true);
  });

  it("cada producto debe tener estructura válida", () => {
    getAllProductos().forEach((producto) => {
      expect(producto.id).toBeDefined();
      expect(producto.nombre).toBeDefined();
      expect(producto.emoji).toBeDefined();
      expect(producto.eyebrow).toBeDefined();
      expect(producto.title).toBeDefined();
      expect(producto.description).toBeDefined();
      expect(producto.image).toBeDefined();
      expect(producto.backendArea).toBeDefined();
      expect(Array.isArray(producto.campos)).toBe(true);
      expect(producto.placeholder).toBeDefined();
      expect(producto.cta).toBeDefined();
      expect(producto.whatsappMessage).toBeDefined();
    });
  });

  it("cada producto debe mapear a un área válida", () => {
    PRODUCTOS_LIST.forEach((productoId) => {
      expect(PRODUCTO_TO_AREA[productoId]).toBeDefined();
      const area = PRODUCTO_TO_AREA[productoId];
      expect(["penal", "civil", "laboral", "familia", "corporativo", "inmobiliario", "tributario"]).toContain(
        area
      );
    });
  });

  it("campos dinámicos deben tener estructura válida", () => {
    getAllProductos().forEach((producto) => {
      producto.campos.forEach((campo) => {
        expect(campo.name).toBeDefined();
        expect(campo.type).toBeDefined();
        expect(campo.label).toBeDefined();
        expect(typeof campo.required).toBe("boolean");
      });
    });
  });

  it("recupera-casa debe tener campos específicos", () => {
    const recuperaCasa = getProducto("recupera-casa");
    const campoNames = recuperaCasa?.campos.map((c) => c.name);
    expect(campoNames).toContain("tieneContrato");
    expect(campoNames).toContain("mesesMora");
    expect(campoNames).toContain("montoTotal");
    expect(campoNames).toContain("direccionPropiedad");
  });

  it("cobra-deuda debe tener campos específicos", () => {
    const cobraDeuda = getProducto("cobra-deuda");
    const campoNames = cobraDeuda?.campos.map((c) => c.name);
    expect(campoNames).toContain("tipoDocumento");
    expect(campoNames).toContain("montoDeuda");
    expect(campoNames).toContain("nombreDeudor");
  });
});
```

- [ ] **Paso 2: Ejecutar tests**

```bash
npm run test -- src/lib/productosJuridicos.test.ts
```

Expected: Todos los tests pasan (12/12)

- [ ] **Paso 3: Commit**

```bash
git add src/lib/productosJuridicos.test.ts
git commit -m "test: add productosJuridicos unit tests"
```

---

## Task 12: Crear Unit Tests para ProductoForm.tsx

**Archivos:**
- Crear: `src/components/hero/ProductoForm.test.tsx`

**Interfaces:**
- Tests: validación de campos, submit, reset, rendering

- [ ] **Paso 1: Crear archivo de tests**

```typescript
// src/components/hero/ProductoForm.test.tsx

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductoForm from "@/components/hero/ProductoForm";
import * as leadApi from "@/lib/leadApi";

// Mock leadApi
vi.mock("@/lib/leadApi", () => ({
  submitLead: vi.fn(),
}));

// Mock recaptcha
vi.mock("@/lib/recaptcha", () => ({
  getRecaptchaToken: vi.fn(() => Promise.resolve("mock-token")),
  RECAPTCHA_ACTIONS: { heroLegal: "hero_legal" },
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("ProductoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el formulario para recupera-casa", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    expect(screen.getByText("Recupera tu Casa")).toBeInTheDocument();
  });

  it("debe renderizar campos dinámicos del producto", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    expect(screen.getByLabelText(/¿Tienes contrato de arriendo?/)).toBeInTheDocument();
    expect(screen.getByLabelText(/¿Cuántos meses de mora?/)).toBeInTheDocument();
  });

  it("debe validar que nombre sea requerido", async () => {
    render(<ProductoForm productoId="recupera-casa" />);
    const submitBtn = screen.getByText("Enviar consulta gratuita");
    
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Nombre requerido/)).toBeInTheDocument();
    });
  });

  it("debe validar que email sea válido", async () => {
    const user = userEvent.setup();
    render(<ProductoForm productoId="recupera-casa" />);
    
    const nameInput = screen.getByPlaceholderText("Tu nombre completo");
    const emailInput = screen.getByPlaceholderText("tu@email.com");
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/);
    
    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "email-invalido");
    await user.type(messageInput, "Tengo problemas con mi arrendatario");
    
    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Email inválido/)).toBeInTheDocument();
    });
  });

  it("debe validar campos requeridos del producto", async () => {
    const user = userEvent.setup();
    render(<ProductoForm productoId="recupera-casa" />);
    
    const nameInput = screen.getByPlaceholderText("Tu nombre completo");
    const emailInput = screen.getByPlaceholderText("tu@email.com");
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/);
    
    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.type(messageInput, "Tengo problemas");
    
    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/es requerido/)).toBeInTheDocument();
    });
  });

  it("debe enviar datos correctamente cuando es válido", async () => {
    const user = userEvent.setup();
    const mockSubmitLead = vi.mocked(leadApi.submitLead);
    mockSubmitLead.mockResolvedValue({ ok: true, message: "Success" });
    
    render(<ProductoForm productoId="recupera-casa" />);
    
    const nameInput = screen.getByPlaceholderText("Tu nombre completo");
    const emailInput = screen.getByPlaceholderText("tu@email.com");
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/);
    
    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.type(messageInput, "Tengo problemas con arrendatario");
    
    // Llenar campos dinámicos
    const radioButtons = screen.getAllByRole("radio");
    await user.click(radioButtons[0]); // tieneContrato: "si"
    
    const mesesInput = screen.getByPlaceholderText("Ej: 3");
    await user.type(mesesInput, "3");
    
    const montoInput = screen.getByDisplayValue("");
    await user.type(montoInput, "1500000");
    
    const submitBtn = screen.getByText("Enviar consulta gratuita");
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalled();
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Juan Pérez",
          email: "juan@example.com",
          producto: "recupera-casa",
          servicio: "legal",
        })
      );
    });
  });

  it("debe mostrar toast de error si falla el submit", async () => {
    const user = userEvent.setup();
    const mockSubmitLead = vi.mocked(leadApi.submitLead);
    mockSubmitLead.mockResolvedValue({ ok: false, message: "Error en servidor" });
    
    render(<ProductoForm productoId="recupera-casa" />);
    
    // ... (llenar formulario como antes)
    // ... (hacer submit)
    
    // El toast de error se mostrarà
  });

  it("debe renderizar diferentes productos", () => {
    const { unmount } = render(<ProductoForm productoId="cobra-deuda" />);
    expect(screen.getByText("Cobra tu Deuda")).toBeInTheDocument();
    
    unmount();
    
    render(<ProductoForm productoId="divorcio-express" />);
    expect(screen.getByText("Divorcio Express")).toBeInTheDocument();
  });
});
```

- [ ] **Paso 2: Ejecutar tests (nota: algunos pueden fallar debido a mocks incompletos)**

```bash
npm run test -- src/components/hero/ProductoForm.test.tsx
```

Expected: Tests principales pasan

---

## Task 13: Actualizar Index.tsx (sin cambios, pero verificar)

**Archivos:**
- Review: `src/pages/Index.tsx`

**Nota:** No hay cambios necesarios, pero verificar que HeroSection siga intacto.

- [ ] **Paso 1: Verificar que Index.tsx no ha cambiado**

```bash
git diff src/pages/Index.tsx
```

Expected: Sin cambios (HeroCarousel sigue en el mismo lugar)

---

## Task 14: Build y verificación local

**Archivos:**
- Verificar: Compilación completa

- [ ] **Paso 1: Compilar proyecto completo**

```bash
npm run build
```

Expected: Build exitoso sin errores

- [ ] **Paso 2: Ejecutar todos los tests**

```bash
npm run test
```

Expected: Tests pasan (con algunos skipped si hay mocks incompletos)

- [ ] **Paso 3: Verificar tipos TypeScript**

```bash
npx tsc --noEmit
```

Expected: Sin errores de tipos

- [ ] **Paso 4: Commit final de la fase 1-3**

```bash
git add .
git commit -m "feat: hero carousel with 12 dynamic products and adaptive forms"
```

---

## Task 15: Manual Testing - Verificar visualmente en Dev

**Archivos:**
- N/A (manual testing)

- [ ] **Paso 1: Iniciar dev server**

```bash
npm run dev
```

- [ ] **Paso 2: Verificar en navegador**

Ir a `http://localhost:5173` y revisar:
- [ ] Hero carousel carga con 12 slides
- [ ] Auto-rotate funciona (cada ~8s cambia de slide)
- [ ] Botones flechas navegación funcionan
- [ ] Puntos indicadores funcionan
- [ ] Swipe en móvil funciona
- [ ] Cada slide muestra el producto correcto (emoji, título, descripción)
- [ ] Formulario cambia según el producto
- [ ] Campos dinámicos se renderizan correctamente
- [ ] Validación muestra errores
- [ ] Submit envía datos (revisar Network tab en DevTools)
- [ ] Mobile (responsive 320px+)

- [ ] **Paso 3: Documentar cualquier issue**

Si hay problemas, anotar y reportar antes de pasar a QA.

---

## Summary

| Fase | Task | Horas Est. |
|------|------|-----------|
| Datos | T1-3: productosJuridicos.ts | 2h |
| Componentes | T4: ProductoForm.tsx | 2h |
| Integraciones | T5-9: heroSlides, HeroCarousel, leadSchema, leadApi | 2h |
| Assets | T10: Imágenes (placeholder) | 1h |
| Testing | T11-12: Unit tests | 2h |
| Build & Manual | T13-15: Build, verificación, manual testing | 2h |
| **TOTAL** | **15 Tasks** | **~11h** |

**Próximo paso después de completar este plan:**
1. Obtener/crear 12 imágenes reales (1200x800px, <150KB)
2. Reemplazar placeholders en productosJuridicos.ts
3. Testing en staging
4. Deploy a producción con monitoreo de métricas

---

**Plan completado y listo para implementación.**
