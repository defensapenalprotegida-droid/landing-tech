# Especificación de Diseño: Hero Carousel de Productos Jurídicos

**Fecha:** 10 de agosto de 2026  
**Versión:** 1.0  
**Autor:** Claude Code  
**Estado:** Aprobado

---

## 1. RESUMEN EJECUTIVO

Transformar el hero section de landing-tech de un carrusel inmobiliario genérico a un **carrusel dinámico de 12 productos jurídicos específicos**, cada uno con su propio formulario adaptativo. El objetivo es aumentar conversión dirigiéndose a problemas concretos del cliente en lugar de áreas de práctica abstractas.

**Alcance:** Frontend + extensión backend (campo `producto`). No reemplaza secciones existentes.

---

## 2. OBJETIVOS

- ✅ Mostrar 12 servicios jurídicos como "productos" (no como áreas de práctica)
- ✅ Formularios dinámicos adaptados a cada producto
- ✅ Mantener compatibilidad con backend existente
- ✅ Aumentar captura de leads con información más específica
- ✅ Mobile-first, accesible, performance optimizado
- ✅ Base para cálculo futuro de "Score de Viabilidad Jurídica"

---

## 3. DEFINICIÓN DE PRODUCTOS

### 3.1 Los 12 Productos

| # | Emoji | Nombre | Área Backend | Prioridad |
|---|-------|--------|-------------|-----------|
| 1 | 🏠 | Recupera tu Casa | inmobiliario | 🥇 |
| 2 | 🏚️ | Recupera tu Propiedad | inmobiliario | 🥇 |
| 3 | 🏗️ | Recupera tu Pie | inmobiliario | 🥈 |
| 4 | 👔 | Defiende tu Despido | laboral | 🥈 |
| 5 | 👷 | Cotizaciones Impagas | laboral | 🥇 |
| 6 | 💰 | Cobra tu Deuda | civil | 🥇 |
| 7 | 🧾 | Cobra tu Factura | civil | 🥇 |
| 8 | 👶 | Cobra tu Pensión | familia | 🥈 |
| 9 | 🏢 | Condominio sin Morosos | inmobiliario | 🥇 |
| 10 | 💔 | Divorcio Express | familia | 🥉 |
| 11 | ⚠️ | Autodespido | laboral | 🥉 |
| 12 | 🛒 | Derechos de Consumidor | civil | 🥉 |

**Mapeo a backend:** Cada producto mapea a una de las 7 áreas existentes (penal, civil, laboral, familia, corporativo, inmobiliario, tributario). Mapeamos a `area: "civil"` por defecto para productos que no tienen área específica.

---

## 4. ARQUITECTURA TÉCNICA

### 4.1 Nuevos Archivos

#### `src/lib/productosJuridicos.ts`
Define la estructura de cada producto y sus campos dinámicos:

```typescript
export type Producto = 
  | "recupera-casa" 
  | "recupera-propiedad" 
  | ... (12 total)

export interface Campo {
  name: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea" | "radio" | "date";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
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

export const PRODUCTOS_JURIDICOS: Record<Producto, ProductoJuridico> = { ... };
export const PRODUCTO_TO_AREA: Record<Producto, Area> = { ... };
```

**Responsabilidades:**
- Definir datos de cada producto (copy, imagen, campos)
- Mapear producto → área backend
- Exportar helper functions: `getProducto()`, `getAllProductos()`

---

#### `src/components/hero/ProductoForm.tsx`
Componente de formulario dinámico que se adapta al producto actual:

```typescript
interface ProductoFormProps {
  productoId: Producto;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ productoId }) => {
  // 1. Obtener producto
  const producto = getProducto(productoId);
  
  // 2. State: formData (campos base + dinámicos), errors, submitting
  const [formData, setFormData] = useState<FormData>({ ... });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  
  // 3. Handlers: handleChange (input), handleRadioChange (radio), validateForm, handleSubmit
  
  // 4. Render: 
  //    - Título + descripción del producto
  //    - Sección "Información específica": renderizar campos dinámicos
  //    - Sección "Tus datos de contacto": name, phone, email
  //    - Select urgencia + horario
  //    - Textarea mensaje general
  //    - Info confidencialidad
  //    - Botón submit
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {/* ... */}
      </form>
    </Card>
  );
};
```

**Responsabilidades:**
- Renderizar campos dinámicos según producto
- Validación condicional (campos required según producto)
- Mostrar/ocultar errores
- Submit con recaptcha → backend

**Validaciones:**
- Campos base (name, email, message) siempre required
- Campos dinámicos required según `campo.required`
- Phone solo si producto lo requiere
- Mostrar errores inline bajo cada campo

---

### 4.2 Archivos Modificados

#### `src/lib/heroSlides.ts`
**Cambio:** Generar HERO_SLIDES desde productosJuridicos (en lugar de lista manual):

```typescript
import { getAllProductos } from "@/lib/productosJuridicos";

export const HERO_SLIDES: HeroSlideData[] = getAllProductos().map((p) => ({
  id: p.id,
  emoji: p.emoji,
  eyebrow: p.eyebrow,
  title: p.title,
  description: p.description,
  image: p.image,
  ctaLabel: p.cta,
  ctaTarget: "formulario",
  whatsappMessage: p.whatsappMessage,
}));
```

**Efecto:** Agregar/remover productos ahora es solo editar productosJuridicos.ts.

---

#### `src/components/hero/HeroCarousel.tsx`
**Cambio:** Reemplazar `<BrokerageQuickForm />` con `<ProductoForm productoId={data.id} />`:

```typescript
{slides.map(({ data }, i) => (
  <div key={data.id} className="w-full flex-shrink-0" {...(i === activo ? {} : { inert: "" })}>
    <HeroSlide slide={data} isFirst={i === 0}>
      {/* ANTES: <BrokerageQuickForm /> */}
      {/* AHORA: */}
      <ProductoForm productoId={data.id as Producto} />
    </HeroSlide>
  </div>
))}
```

**Sin cambios en:** lógica de carrusel, auto-rotate, navegación, validación de accesibilidad.

---

#### `src/components/hero/HeroSlide.tsx`
**Cambio menor:** Agregar emoji + eyebrow al copy (ya está en los datos):

```typescript
<p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
  {slide.emoji} {slide.eyebrow}
</p>
```

Sin más cambios significativos.

---

#### `src/lib/leadSchema.ts`
**Cambio:** Agregar campo `producto` y campos dinámicos:

```typescript
export const PRODUCTOS = [
  "recupera-casa", "recupera-propiedad", "recupera-pie",
  "defiende-despido", "cotizaciones-impagas", "cobra-deuda",
  "cobra-facturas", "cobra-pension", "condominio",
  "divorcio-express", "autodespido", "derechos-consumidor",
] as const;

export type Producto = (typeof PRODUCTOS)[number];

export const leadSchema = z.object({
  name: z.string().trim().min(3),
  phone: z.string().trim().min(8).optional(), // Ahora opcional
  email: z.string().trim().email(),
  producto: z.enum(PRODUCTOS).optional(), // NUEVO
  area: z.enum(AREAS).optional(), // Mapeado desde producto
  urgencia: z.enum(URGENCIAS).default("sin_apuro"),
  horario: z.enum(HORARIOS).default("cualquiera"),
  message: z.string().trim().min(5),
  
  // NUEVOS: Campos dinámicos de los 12 productos (todos opcionales)
  tieneContrato: z.string().optional(),
  mesesMora: z.number().optional(),
  montoTotal: z.number().optional(),
  nombreArrendatario: z.string().optional(),
  direccionPropiedad: z.string().optional(),
  hayConsumos: z.string().optional(),
  hayGastosComunes: z.string().optional(),
  // ... resto de campos dinámicos
  
  website: z.string().max(0).optional().default(""),
});
```

**Validación condicional:** En el backend, mapear producto → area si no viene area.

---

#### `src/lib/leadApi.ts`
**Cambio:** Aceptar campo `producto` y todos los dinámicos:

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

export async function submitLead(payload: SubmitLeadPayload): Promise<{ ok: boolean; message: string }> {
  // Mapear producto → area
  const area = payload.producto ? PRODUCTO_TO_AREA[payload.producto] : undefined;
  
  const body = {
    ...payload,
    area, // Agregar área mapeada
  };
  
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  // ... resto igual
}
```

---

### 4.3 Dependencias Nuevas

Ninguna. Usamos componentes UI existentes (Input, Textarea, Card, Select, RadioGroup, Label).

---

## 5. FLUJO DE DATOS

```
Usuario llega a landing
         ↓
HeroCarousel carga (12 slides, auto-rotate 8s)
         ↓
Usuario ve slide N: "Recupera tu Casa" (emoji + título + descripción)
         ↓
ProductoForm renderiza campos dinámicos:
  - ¿Tienes contrato de arriendo? [radio]
  - ¿Cuántos meses de mora? [number]
  - Monto adeudado [number]
  - ... (campos específicos del producto)
         ↓
Usuario completa formulario
         ↓
ProductoForm.handleSubmit() valida:
  - Campos base (name, email, message) required
  - Campos dinámicos según campo.required
  - Mostrar errores inline
         ↓
Si válido: submit con recaptcha
         ↓
submitLead envía a backend:
  {
    name, email, phone, message, urgencia, horario,
    producto: "recupera-casa",
    area: "inmobiliario", // mapeado automáticamente
    tieneContrato: "si",
    mesesMora: 3,
    montoTotal: 1500000,
    ... (resto de dinámicos)
  }
         ↓
Backend recibe, crea Lead, responde 200 OK
         ↓
Toast: "Consulta enviada"
         ↓
Form reset
```

---

## 6. DEFINICIÓN DE CAMPOS DINÁMICOS

Cada producto tiene su lista de campos específicos. Ejemplo:

### Recupera tu Casa
```typescript
campos: [
  { name: "tieneContrato", type: "radio", label: "¿Tienes contrato de arriendo?", required: true, options: [{...}] },
  { name: "mesesMora", type: "number", label: "¿Cuántos meses de mora?", required: true, validation: { min: 1, max: 120 } },
  { name: "montoTotal", type: "number", label: "Monto total adeudado", required: true },
  { name: "nombreArrendatario", type: "text", label: "Nombre del arrendatario", required: false },
  { name: "direccionPropiedad", type: "text", label: "Dirección de la propiedad", required: true },
  { name: "hayConsumos", type: "radio", label: "¿Hay consumos de servicios?", required: false, options: [{...}] },
  { name: "hayGastosComunes", type: "radio", label: "¿Hay gastos comunes adeudados?", required: false, options: [{...}] },
]
```

**Ver documento de estructura para todos los 12 productos y sus campos completos.**

---

## 7. ASSETS

### Imágenes Hero (12)
- Resolución: 1200x800px
- Formato: JPG optimizado (<150KB cada una)
- Ubicación: `/src/assets/hero-*.jpg`
- Nombre: `hero-{producto-id}.jpg`

Ejemplo:
- `hero-recupera-casa.jpg`
- `hero-cobra-deuda.jpg`
- `hero-divorcio-express.jpg`
- ...

**Especificaciones visuales:**
- Profesional, confiable
- Alineado con colores brand (#A12341 borgoña, #0F3B47 azul)
- Sin personas identificables
- Alt text descriptivo en cada imagen

---

## 8. TESTING

### Unit Tests
- ProductoForm: validación de campos, submit, reset
- productosJuridicos: estructura de datos, mapeos

### Integration Tests
- HeroCarousel + ProductoForm: navegación entre slides, cambio de formulario
- leadApi: envío de datos con producto ID

### Manual Testing (QA)
- [ ] Cada slide carga correctamente (12 verificaciones)
- [ ] Campos dinámicos se renderizan según producto
- [ ] Validación: campos required muestran errores
- [ ] Submit: datos se envían al backend con producto ID
- [ ] Mobile: swipe entre slides, formulario legible en 320px
- [ ] Accesibilidad: ARIA labels, contraste, screen readers
- [ ] Performance: LCP <2s, slide change <500ms

---

## 9. CRITERIOS DE ÉXITO

| Métrica | Target | Verificación |
|---------|--------|-------------|
| **LCP (Largest Contentful Paint)** | <2s | Lighthouse |
| **Slide transition** | <500ms | DevTools performance |
| **Conversión inicial** | 10%+ | Mixpanel / Analytics |
| **Form completion rate** | 70%+ | Backend logs |
| **Mobile usability** | 90+ | PageSpeed Insights |
| **Accessibility** | WCAG AA | axe DevTools |
| **Cross-browser** | Chrome, Safari, Firefox, Edge | BrowserStack |

---

## 10. FASES DE IMPLEMENTACIÓN

1. **Estructura de Datos** (2-3h)
   - Crear productosJuridicos.ts con todos los campos
   - Crear mapeo PRODUCTO_TO_AREA

2. **Componentes React** (4-5h)
   - ProductoForm.tsx (formulario dinámico)
   - Actualizar HeroCarousel, HeroSlide, heroSlides.ts
   - Actualizar leadSchema.ts, leadApi.ts

3. **Assets** (1-2h)
   - Obtener/crear 12 imágenes (1200x800px)
   - Optimizarlas (<150KB)
   - Importarlas en productosJuridicos.ts

4. **Testing** (3-4h)
   - Unit tests: ProductoForm, productosJuridicos
   - Integration tests: HeroCarousel + form
   - Manual QA: 12 productos × 5 escenarios

5. **Deploy** (1h)
   - Staging: verificación final
   - Producción: monitoreo de conversión

---

## 11. RESTRICCIONES Y SUPUESTOS

**Restricciones:**
- Backend actual solo acepta 7 áreas → mapeamos productos a ellas
- Images máximo 1200x800px para performance
- No modificamos PracticeAreas (convive con nuevo hero)

**Supuestos:**
- Backend puede procesar campos dinámicos adicionales (sin cambios en DB)
- Las 12 imágenes están disponibles o se pueden crear
- Validaciones de formulario ocurren en frontend (backend las valida también)

---

## 12. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| Backend no soporta campos dinámicos | Media | Alto | Usar campo `message` como fallback si es necesario |
| Imágenes no están optimizadas | Baja | Medio | Script de optimización automática en CI/CD |
| Validación inconsistente front/back | Media | Medio | Compartir schema Zod entre frontend y backend |
| Performance se degrada con 12 slides | Baja | Medio | Lazy-load slides no visibles, monitorear LCP |

---

## 13. DEFINICIÓN DE HECHO

✅ Cada slide renderiza con su formulario dinámico correcto  
✅ Validación funciona: campos required muestran errores  
✅ Submit mapea producto → area correctamente  
✅ Mobile: navegación swipe + formulario legible  
✅ Accesibilidad: WCAG AA en todos los slides  
✅ Performance: LCP <2s, slide <500ms  
✅ Tests pasan (unit + integration + manual)  
✅ Deploy en staging verificado  

---

## 14. REFERENCIAS Y ENLACES

- Documento de estructura: `/scratchpad/design-productos-juridicos.md`
- Propuesta original del usuario: análisis de 12 servicios jurídicos
- Current codebase: `/Users/lfgg/paldunate/landing-tech/`

---

**Aprobado:** ✅ Usuario confirma diseño  
**Próximo paso:** Invocar `writing-plans` skill para crear plan de implementación detallado
