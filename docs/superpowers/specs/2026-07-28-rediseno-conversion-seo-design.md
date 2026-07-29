# Rediseño arteagayaldunate.cl — Conversión + SEO

**Fecha:** 2026-07-28
**Rama:** `rediseno-conversion-seo`
**Autor:** Luis Guerrero (con Claude Code)

## Contexto

`arteagayaldunate.cl` es la landing de un estudio jurídico chileno (Arteaga & Aldunate
Abogados y Asociados), construida con Vite + React 18 + TypeScript + Tailwind + shadcn/ui,
desplegada en Vercel. El objetivo es llevar el sitio al patrón de experiencia de usuario de
`edig.cl` (claridad de navegación, jerarquía visual, prueba de autoridad, blog para SEO,
formulario segmentado que califica al prospecto) conservando la estética de `aaya.cl`
(serif elegante en títulos, banner en el hero) y la paleta de marca ya existente
(rojo vino `#A12341` + azul petróleo `#0F3B47`, tipografías Merriweather/Lato).

### Estado actual (lo que ya existe)

**Funciona bien:**
- Hero con propuesta de valor, 2 CTA (llamar + WhatsApp) y 3 cifras de respaldo.
- `PracticeAreas` (7 áreas con servicios detallados), `TeamSection`, `AboutSection`,
  `Footer` con aviso legal.
- `ContactSection` con formulario que **sí** envía correo vía `/api/contact`
  (nodemailer/SMTP sobre Vercel).

**Roto o incompleto respecto al objetivo:**
1. El formulario del Hero (`HeroSection`) no envía nada: su `handleSubmit` solo hace
   `console.log`. Se pierden esos leads.
2. El menú (`Header`) tiene anclajes rotos: "ÁREAS DE PRÁCTICA" apunta a `area`
   (la sección real es `areas`), y "BLOG" y "CONTACTO" apuntan ambos a `contacto`.
   No hay menú desplegable de áreas.
3. No existe formulario de caso/querella segmentado: el form solo captura
   nombre/teléfono/email/mensaje; el correo llega sin datos de clasificación.
4. El blog (`BlogSection`) es estático: 3 tarjetas de ejemplo que enlazan a `#contacto`,
   sin artículos reales ni páginas indexables.
5. Faltan la sección numerada "Por qué elegirnos" y los testimonios (prueba social).

**Componentes muertos** (existen pero no se usan en `Index.tsx`): `ServicesSection`,
`ServicesSection111`, `MissionSection`, `ApproachSection`, `FAQSection`.

## Decisiones tomadas

- **Entregable:** construir sobre el repo actual (no un documento de propuesta).
- **Formulario:** un único formulario inteligente que adapta sus campos según el área
  seleccionada. Los CTA "Solicite aquí" de cada área bajan a él con el área pre-seleccionada
  (no se duplica el formulario por área).
- **Blog:** blog real con una página por artículo (`/blog/:slug`), artículos en Markdown
  dentro del repo, con meta tags SEO y prerender en build para que sean HTML indexable.
- **Alcance fase 1:** paquete completo de conversión (menú, formularios, form segmentado +
  API, "por qué elegirnos", testimonios) + blog real.

## Objetivos y no-objetivos

**Objetivos**
- Reparar los flujos de captura de leads (ambos formularios envían correo).
- Formulario que clasifica al prospecto (área, urgencia, monto, situación) y llega
  ordenado y filtrable a la bandeja del estudio.
- Navegación clara con desplegable de áreas y CTA urgente permanente.
- Prueba de autoridad y prueba social (cifras, "por qué elegirnos", testimonios).
- Blog indexable que aporte SEO orgánico de largo plazo.

**No-objetivos (por ahora)**
- CMS headless / panel de edición sin código (se evaluó y se descartó para esta fase).
- Newsletter / suscripción a boletín.
- Multilenguaje.
- Autenticación o portal de clientes.

## Diseño por componente

### 1. Sistema visual
- Conservar paleta e íconos (`lucide-react`) actuales.
- Unificar la tipografía de títulos en Merriweather (`font-heading`), reemplazando los usos
  sueltos de `font-serif` por `font-heading` para un look consistente estilo aaya.cl.
- Hero con **banner**: imagen de fondo con overlay oscuro/degradado en lugar del degradado
  plano actual. La imagen vive en `src/assets/` o `public/`.
- Sin cambios en los tokens de `index.css` salvo los necesarios para el banner.

### 2. Navegación — `Header.tsx`
- Menú fijo con: **Inicio · Nosotros · Áreas de Práctica ▾ · Equipo · Blog · Contacto**
  + botón urgente permanente **"Habla con un abogado"** (WhatsApp/teléfono).
- El desplegable de "Áreas de Práctica" usa `navigation-menu` de Radix (ya instalado) y
  lista las 7 áreas; cada ítem hace scroll a `#areas` y pre-selecciona el área
  correspondiente (ver §4).
- Reparar todos los anclajes rotos. Los ítems de nav apuntan a IDs reales:
  `inicio`/`hero`, `nosotros`, `areas`, `equipo`, `blog`, `contacto`.
- "Blog" navega a la ruta `/blog` (react-router), no a un ancla.
- Menú móvil con el submenú de áreas colapsable.

### 3. Hero — `HeroSection.tsx`
- Mantener titular + subtítulo + 3 cifras + 2 CTA. CTA primario **"Cuéntanos tu caso"**
  hace scroll al formulario de Contacto; CTA secundario abre WhatsApp urgente.
- Fondo tipo banner (ver §1).
- El mini-formulario del hero pasa a ser un "contacto rápido" que **sí** hace `POST` a
  `/api/contact` (nombre, teléfono, email, mensaje corto), con validación y toast, en vez
  del `console.log` actual. Reutiliza la misma lógica de envío que el formulario principal.

### 4. Formulario inteligente de caso/querella (pieza central)
Ubicación: sección Contacto (`id="contacto"`). Es el formulario autoritativo al que llegan
todos los CTA "Solicite aquí / Consultar / Cuéntanos tu caso".

- **Campos base (siempre visibles):**
  - Nombre completo* (texto)
  - Teléfono* (tel)
  - Email* (email)
  - Área / Tipo de causa* (select: Penal, Civil, Laboral, Familia, Corporativo,
    Inmobiliario, Tributario)
  - Urgencia* (select: `Inmediata (detenido/citado)` · `Esta semana` · `Sin apuro`)
  - Mejor horario de contacto (select: Mañana / Tarde / Cualquiera)
  - Descripción del caso* (textarea)
- **Campos condicionales según el área elegida** (máximo 1–2 extra para no saturar):
  - *Penal* → Situación actual (select: Detenido / Citado a declarar / Formalizado /
    Soy víctima / Consulta preventiva). Si la descripción/materia es económica o el usuario
    lo indica, mostrar **Monto involucrado** (select de rangos).
  - *Civil / Corporativo / Inmobiliario / Tributario* → Monto involucrado (select de rangos:
    `< $1M`, `$1M–$10M`, `$10M–$50M`, `> $50M`, `No aplica / no sé`).
  - *Familia* → Materia (select: Divorcio / Alimentos / Cuidado personal / VIF / Otro).
  - *Laboral* → ¿Trabajador o empresa? (select) + Situación (select: Despido injustificado /
    Autodespido / Tutela / Cobro de prestaciones / Otro).
- **Validación:** `react-hook-form` + `zod` (ambos ya instalados). Errores inline + toast.
- Pre-selección de área vía estado/URL (ej. un CTA de área setea el `select` de área al
  hacer scroll). Implementación: un contexto simple o un evento/param; se detalla en el plan.
- **Anti-spam:** campo honeypot oculto; si viene con valor, se descarta en el cliente/servidor.
- Nota de confidencialidad (secreto profesional) y botón de WhatsApp de emergencia visibles.

### 5. API de correo — `api/contact.ts`
- Aceptar los nuevos campos manteniendo compatibilidad con el envío actual
  (name, email, phone, message siguen siendo la base; los nuevos son opcionales).
- Validación server-side de los campos requeridos base.
- Construir un **correo ordenado por secciones** en HTML y texto plano:
  1. **Contacto** — nombre, teléfono, email, mejor horario.
  2. **Clasificación del caso** — área, urgencia, situación, monto involucrado, materia,
     trabajador/empresa (según apliquen).
  3. **Descripción** — el texto libre del cliente.
- **Asunto filtrable:** incluir área y urgencia, p.ej.
  `[PENAL · URGENTE] Nueva consulta – Juan Pérez`. Para urgencia "Inmediata" anteponer
  un marcador (`URGENTE`) que permita reglas de filtrado/etiquetado en la bandeja.
- Escapado HTML de todos los valores (ya existe `escapeHtml`; extenderlo a los nuevos campos).
- Mantener CORS y manejo de errores actuales.

### 6. "Por qué elegirnos" — nuevo componente `WhyChooseUs.tsx`
- Sección con 4 razones **numeradas** (estilo edig.cl):
  1. Trayectoria y especialización.
  2. Atención directa del abogado (sin derivar a terceros).
  3. Protocolo de respuesta inmediata.
  4. Confidencialidad absoluta.
- Copy inicial editable; diseño consistente con el resto (tarjetas + número grande).

### 7. Testimonios — nuevo componente `TestimonialsSection.tsx`
- Testimonios **anonimizados** (iniciales + área de la causa, sin nombre completo ni datos
  del caso) para respetar el secreto profesional y el Código de Ética.
- Enfocados en la **experiencia de atención** (claridad, disponibilidad, trato), no en el
  resultado del caso. Estrellas de valoración. 3–6 tarjetas con copy placeholder editable.

### 8. Blog real con SEO
- **Rutas** (react-router, ya instalado): `/blog` (listado) y `/blog/:slug` (artículo).
- **Contenido:** artículos en `src/content/blog/*.md` con frontmatter:
  `title`, `slug`, `date`, `category`, `excerpt`, `description` (SEO), `author` opcional.
  Cargados con `import.meta.glob` de Vite.
- **Render:** `react-markdown` (dependencia nueva) + `@tailwindcss/typography` (ya instalado)
  para el estilo de artículo (`prose`).
- **Meta tags por página:** `<title>`, `<meta name="description">`, canonical y OpenGraph.
  Gestor de head ligero (`react-helmet-async`, dependencia nueva).
- **Prerender en build:** generar HTML estático real para `/`, `/blog` y cada `/blog/:slug`
  para que sean indexables (un SPA client-rendered no se indexa bien). Enfoque:
  `vite-react-ssg` (compatible con react-router) u opción de prerender equivalente; se
  decide en el plan de implementación tras validar compatibilidad con la config de Vite/Vercel.
- **Semilla:** 3–4 artículos reales basados en el brief, con fecha y categoría:
  - "¿Qué hacer si te citan a declarar por Fiscalía?" (Penal)
  - "Despido injustificado: derechos del trabajador en Chile" (Laboral)
  - "Pensión de alimentos: aumento, rebaja o cese" (Familia)
  - (opcional) un artículo civil/tributario.
- `BlogSection` del home muestra los 3 últimos leyendo del mismo origen de datos y enlaza a
  los artículos reales + botón "Ver todos" → `/blog`.
- Añadir `sitemap.xml` y `robots.txt` en `public/` con las URLs del blog para SEO.

### 9. Footer y limpieza
- `Footer`: agregar íconos de redes sociales; enlazar "Política de Privacidad" y "Términos"
  a páginas/rutas reales (o secciones dedicadas). Conservar el aviso legal actual.
- Retirar de `Index.tsx` y del repo los componentes muertos que generan confusión
  (`ServicesSection111`, `MissionSection`, `ApproachSection`). `FAQSection` se conserva solo
  si se decide incorporarla; en caso contrario también se retira.
- `Index.tsx` queda con el orden: Header → Hero → About(Nosotros) → PracticeAreas →
  WhyChooseUs → Equipo(TeamSection) → Testimonials → Blog(preview) → Contact(form
  segmentado) → Footer + WhatsAppButton.

## Arquitectura y flujo de datos

- **Enrutamiento:** `App.tsx` ya usa `BrowserRouter`. Añadir rutas `/blog` y `/blog/:slug`
  además de `/` y el catch-all `*`.
- **Origen de datos del blog:** módulo `src/content/blog.ts` que lee los `.md` con
  `import.meta.glob`, parsea frontmatter y expone `getAllPosts()` / `getPostBySlug()`.
  Consumido por `BlogSection` (home), `/blog` y `/blog/:slug`.
- **Formulario → correo:** cliente (`react-hook-form` + `zod`) → `POST /api/contact`
  (JSON) → nodemailer/SMTP con variables de entorno ya configuradas en Vercel.
- **Pre-selección de área:** CTA de área → setea el select del formulario + scroll a
  `#contacto` (mecanismo simple: estado en el componente de Contacto vía prop/callback o
  parámetro de hash; se define en el plan).

## Estrategia de pruebas / verificación

- **Formulario:** validación de campos requeridos y condicionales; envío exitoso muestra
  toast de éxito; error de red muestra toast de error; honeypot descarta spam.
- **API:** con payload mínimo (compat) y con payload completo (nuevos campos) el correo se
  arma con las secciones correctas y el asunto filtrable; falta de config SMTP responde 500.
- **Blog:** cada `/blog/:slug` renderiza el artículo; `/blog` lista todos; meta tags
  presentes; el prerender produce HTML con el contenido y las meta.
- **Navegación:** todos los ítems del menú (desktop y móvil) llegan a su destino real;
  desplegable de áreas funciona; CTA urgente abre WhatsApp.
- **Build:** `npm run build` sin errores; `npm run lint` limpio en los archivos tocados.
- **Verificación visual:** revisar el sitio corriendo (Hero banner, form adaptativo,
  secciones nuevas) antes de dar por terminado.

## Riesgos y consideraciones

- **Prerender/SSG:** es la única adición de infraestructura. Si `vite-react-ssg` no calza
  con la config actual de Vite/Vercel, se evalúa un prerender alternativo. Es un riesgo
  acotado que se resuelve en el plan; el resto del trabajo no depende de esta decisión.
- **Ética profesional:** los testimonios deben ir anonimizados y sin datos del caso.
- **Contenido real:** cifras del hero, testimonios y datos de contacto deben ser confirmados
  por el estudio antes de publicar (el copy inicial es placeholder editable).
