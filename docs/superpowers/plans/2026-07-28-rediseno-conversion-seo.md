# Rediseño arteagayaldunate.cl (Conversión + SEO) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reparar la captura de leads, agregar un formulario de caso segmentado con correo ordenado/filtrable, sumar navegación con desplegable de áreas, secciones de prueba de autoridad y social, y un blog real indexable, sobre la landing existente de Arteaga & Aldunate.

**Architecture:** Se trabaja sobre el SPA actual (Vite + React 18 + TS + Tailwind + shadcn/ui). La lógica testeable (schema del formulario, armado del correo, loader del blog) se extrae a módulos puros con tests en Vitest; los componentes de UI se verifican con build + lint + revisión visual. El blog vive como Markdown en el repo, se enruta con react-router y se prerenderiza en build para SEO.

**Tech Stack:** Vite 5, React 18, TypeScript, TailwindCSS, shadcn/ui (Radix), react-hook-form, zod, react-router-dom, framer-motion, nodemailer (Vercel serverless), Vitest (nuevo), react-markdown (nuevo), react-helmet-async (nuevo), vite-react-ssg (nuevo, prerender).

## Global Constraints

- Paleta de marca: rojo vino `#A12341` (`--legal-primary`), azul petróleo `#0F3B47` (`--legal-secondary`). No introducir colores nuevos fuera de estos y los neutros existentes.
- Tipografía: títulos en `font-heading` (Merriweather); cuerpo en `font-body` (Lato). Al tocar un componente, reemplazar usos de `font-serif` por `font-heading`.
- Idioma de toda la UI y el contenido: español (Chile).
- Teléfono/WhatsApp del estudio: `+56 9 9533 6140` (formato wa.me: `56995336140`). Correo: `abogados@arteagayaldunate.cl`. Dirección: `Bombero Salas N° 1369, oficina 701, Santiago`.
- El endpoint de correo es `POST /api/contact` (JSON). Debe seguir aceptando el payload actual `{name, email, phone, message}` sin romperse.
- Testimonios: anonimizados (iniciales + área), sin nombre completo ni datos del caso.
- Gestor de paquetes: usar `npm` (hay `package-lock.json`). Node del build en Vercel.
- Commits en español, con línea final `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## Mapa de archivos

**Crea:**
- `vitest.config.ts`, `src/test/setup.ts` — tooling de test.
- `src/lib/leadSchema.ts` — áreas, urgencias, rangos, labels, schema zod, tipo `LeadFormValues`.
- `src/lib/leadApi.ts` — `submitLead(payload)` compartido por ambos formularios.
- `src/lib/leadPrefill.ts` — bus de eventos para pre-seleccionar área + scroll a contacto.
- `api/emailTemplate.ts` — `buildLeadEmail(data)` puro (asunto + html + text).
- `src/components/WhyChooseUs.tsx` — sección "Por qué elegirnos" numerada.
- `src/components/TestimonialsSection.tsx` — testimonios anonimizados.
- `src/components/Seo.tsx` — `<Seo>` con react-helmet-async.
- `src/lib/blog.ts` — loader de Markdown (`getAllPosts`, `getPostBySlug`).
- `src/content/blog/*.md` — artículos semilla.
- `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx` — listado y artículo.
- `src/pages/Privacidad.tsx`, `src/pages/Terminos.tsx` — páginas legales.
- `public/robots.txt`, `public/sitemap.xml` — SEO.

**Modifica:**
- `api/contact.ts` — usa `buildLeadEmail`, valida nuevos campos.
- `src/components/ContactSection.tsx` — formulario inteligente segmentado.
- `src/components/Header.tsx` — desplegable de áreas, anclajes corregidos, CTA urgente.
- `src/components/HeroSection.tsx` — banner + form rápido que envía.
- `src/components/PracticeAreas.tsx` — CTA usa `prefillArea`.
- `src/components/BlogSection.tsx` — lee de `src/lib/blog.ts`, enlaza a artículos reales.
- `src/components/Footer.tsx` — redes + enlaces a `/privacidad` y `/terminos`.
- `src/pages/Index.tsx` — nuevo orden de secciones.
- `src/App.tsx` — rutas de blog y legales, `HelmetProvider`.
- `src/main.tsx` — entry compatible con prerender (vite-react-ssg).
- `vite.config.ts`, `package.json` — scripts de test y build/prerender.

**Elimina:**
- `src/components/ServicesSection111.tsx`, `src/components/MissionSection.tsx`, `src/components/ApproachSection.tsx`.

---

### Task 1: Tooling de test + schema del formulario de leads

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/leadSchema.ts`
- Create: `src/lib/leadSchema.test.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces:
  - `AREAS: readonly Area[]`, `type Area`, `AREA_LABELS: Record<Area,string>`
  - `URGENCIAS`, `type Urgencia`, `URGENCIA_LABELS`
  - `MONTO_RANGOS`, `type MontoRango`, `MONTO_LABELS`
  - `PENAL_SITUACIONES`, `FAMILIA_MATERIAS`, `LABORAL_PARTE`, `LABORAL_SITUACIONES` (arrays de `{value,label}`)
  - `leadSchema` (zod), `type LeadFormValues = z.infer<typeof leadSchema>`
  - `montoAplica(area: Area): boolean`, `situacionPenalAplica(area): boolean`, etc.

- [ ] **Step 1: Instalar dependencias de test**

Run:
```bash
npm install -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25
```
Expected: instala sin errores; aparecen en `devDependencies`.

- [ ] **Step 2: Añadir scripts de test en `package.json`**

En el bloque `"scripts"`, agregar:
```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Crear `vitest.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

- [ ] **Step 4: Crear `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 5: Escribir el test que falla (`src/lib/leadSchema.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { leadSchema, montoAplica } from "./leadSchema";

const base = {
  name: "Juan Pérez",
  phone: "+56912345678",
  email: "juan@example.com",
  area: "penal" as const,
  urgencia: "inmediata" as const,
  horario: "cualquiera" as const,
  message: "Fui citado a declarar y necesito ayuda urgente.",
  situacionPenal: "citado" as const,
  website: "", // honeypot
};

describe("leadSchema", () => {
  it("acepta un lead penal válido con situación", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const r = leadSchema.safeParse({ ...base, email: "no-es-email" });
    expect(r.success).toBe(false);
  });

  it("rechaza mensaje demasiado corto", () => {
    const r = leadSchema.safeParse({ ...base, message: "hola" });
    expect(r.success).toBe(false);
  });

  it("exige situación penal cuando el área es penal", () => {
    const { situacionPenal, ...noSit } = base;
    const r = leadSchema.safeParse(noSit);
    expect(r.success).toBe(false);
  });

  it("exige parte y situación laboral cuando el área es laboral", () => {
    const r = leadSchema.safeParse({
      ...base,
      area: "laboral",
      situacionPenal: undefined,
    });
    expect(r.success).toBe(false);
  });

  it("montoAplica es true para civil y false para familia", () => {
    expect(montoAplica("civil")).toBe(true);
    expect(montoAplica("familia")).toBe(false);
  });
});
```

- [ ] **Step 6: Ejecutar el test y verificar que falla**

Run: `npm test`
Expected: FAIL — `Cannot find module './leadSchema'`.

- [ ] **Step 7: Implementar `src/lib/leadSchema.ts`**

```ts
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
```

- [ ] **Step 8: Ejecutar el test y verificar que pasa**

Run: `npm test`
Expected: PASS — 6 tests verdes.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/leadSchema.ts src/lib/leadSchema.test.ts
git commit -m "feat: schema del formulario de leads + tooling de test (vitest)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Armado del correo ordenado y filtrable

**Files:**
- Create: `api/emailTemplate.ts`
- Create: `api/emailTemplate.test.ts`
- Modify: `api/contact.ts`

**Interfaces:**
- Consumes: labels y tipos de `src/lib/leadSchema.ts` — pero `api/` no debe importar de `src/` en runtime de Vercel; por eso `emailTemplate.ts` define sus **propios** labels internos (duplicación mínima e intencional para aislar la función serverless).
- Produces: `buildLeadEmail(data: LeadEmailInput): { subject: string; text: string; html: string }` y `type LeadEmailInput`.

- [ ] **Step 1: Escribir el test que falla (`api/emailTemplate.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { buildLeadEmail } from "./emailTemplate";

describe("buildLeadEmail", () => {
  it("arma asunto filtrable con área y URGENTE para urgencia inmediata", () => {
    const { subject } = buildLeadEmail({
      name: "Juan Pérez", phone: "+56912345678", email: "j@x.cl",
      area: "penal", urgencia: "inmediata", horario: "manana",
      message: "Detenido anoche", situacionPenal: "detenido",
    });
    expect(subject).toContain("PENAL");
    expect(subject).toContain("URGENTE");
    expect(subject).toContain("Juan Pérez");
  });

  it("sin urgencia inmediata no marca URGENTE", () => {
    const { subject } = buildLeadEmail({
      name: "Ana", phone: "1", email: "a@x.cl", area: "civil",
      urgencia: "sin_apuro", horario: "tarde", message: "consulta", monto: "1a10",
    });
    expect(subject).not.toContain("URGENTE");
    expect(subject).toContain("CIVIL");
  });

  it("incluye la clasificación (monto) y escapa HTML", () => {
    const { html, text } = buildLeadEmail({
      name: "<script>x</script>", phone: "1", email: "a@x.cl",
      area: "civil", urgencia: "semana", horario: "cualquiera",
      message: "hola", monto: "10a50",
    });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>x");
    expect(text).toContain("$10.000.000");
  });

  it("funciona con el payload mínimo legado (sin campos nuevos)", () => {
    const out = buildLeadEmail({
      name: "Legacy", phone: "", email: "l@x.cl", message: "solo mensaje",
    } as any);
    expect(out.subject).toContain("Legacy");
    expect(out.html).toContain("solo mensaje");
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- api/emailTemplate.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `api/emailTemplate.ts`**

```ts
type Dict = Record<string, string>;

const AREA_LABELS: Dict = {
  penal: "Derecho Penal", civil: "Derecho Civil", laboral: "Derecho Laboral",
  familia: "Derecho de Familia", corporativo: "Derecho Corporativo",
  inmobiliario: "Derecho Inmobiliario", tributario: "Derecho Tributario",
};
const URGENCIA_LABELS: Dict = {
  inmediata: "Inmediata (detenido / citado)", semana: "Esta semana", sin_apuro: "Sin apuro",
};
const HORARIO_LABELS: Dict = { manana: "Mañana", tarde: "Tarde", cualquiera: "Cualquiera" };
const MONTO_LABELS: Dict = {
  lt1: "Menos de $1.000.000", "1a10": "$1.000.000 – $10.000.000",
  "10a50": "$10.000.000 – $50.000.000", gt50: "Más de $50.000.000", na: "No aplica / no lo sé",
};
const PENAL_LABELS: Dict = {
  detenido: "Detenido", citado: "Citado a declarar", formalizado: "Formalizado",
  victima: "Soy víctima / quiero querellarme", preventiva: "Consulta preventiva",
};
const FAMILIA_LABELS: Dict = {
  divorcio: "Divorcio", alimentos: "Pensión de alimentos",
  cuidado: "Cuidado personal / visitas", vif: "Violencia intrafamiliar", otro: "Otro",
};
const LABORAL_PARTE_LABELS: Dict = { trabajador: "Trabajador", empresa: "Empresa / empleador" };
const LABORAL_SIT_LABELS: Dict = {
  despido: "Despido injustificado", autodespido: "Autodespido", tutela: "Tutela de derechos",
  prestaciones: "Cobro de prestaciones", otro: "Otro",
};

export interface LeadEmailInput {
  name: string; phone?: string; email: string; message: string;
  area?: string; urgencia?: string; horario?: string;
  situacionPenal?: string; monto?: string; materiaFamilia?: string;
  laboralParte?: string; laboralSituacion?: string;
}

function esc(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const label = (map: Dict, k?: string) => (k && map[k]) || (k ?? "");

export function buildLeadEmail(data: LeadEmailInput) {
  const areaLabel = label(AREA_LABELS, data.area) || "Consulta general";
  const urgente = data.urgencia === "inmediata" ? "URGENTE · " : "";
  const areaTag = (data.area ? label(AREA_LABELS, data.area) : "GENERAL")
    .replace("Derecho ", "").toUpperCase();
  const subject = `[${urgente}${areaTag}] Nueva consulta – ${data.name}`;

  // Filas de clasificación (solo las que aplican)
  const clasificacion: Array<[string, string]> = [];
  if (data.area) clasificacion.push(["Área", areaLabel]);
  if (data.urgencia) clasificacion.push(["Urgencia", label(URGENCIA_LABELS, data.urgencia)]);
  if (data.situacionPenal) clasificacion.push(["Situación", label(PENAL_LABELS, data.situacionPenal)]);
  if (data.materiaFamilia) clasificacion.push(["Materia", label(FAMILIA_LABELS, data.materiaFamilia)]);
  if (data.laboralParte) clasificacion.push(["Parte", label(LABORAL_PARTE_LABELS, data.laboralParte)]);
  if (data.laboralSituacion) clasificacion.push(["Situación laboral", label(LABORAL_SIT_LABELS, data.laboralSituacion)]);
  if (data.monto) clasificacion.push(["Monto involucrado", label(MONTO_LABELS, data.monto)]);

  const contacto: Array<[string, string]> = [
    ["Nombre", data.name],
    ["Teléfono", data.phone || "No informado"],
    ["Email", data.email],
    ["Mejor horario", label(HORARIO_LABELS, data.horario) || "No informado"],
  ];

  const textRows = (rows: Array<[string, string]>) =>
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const text = [
    "Nueva consulta legal desde el sitio web", "",
    "--- Contacto ---", textRows(contacto), "",
    ...(clasificacion.length ? ["--- Clasificación del caso ---", textRows(clasificacion), ""] : []),
    "--- Descripción ---", data.message || "",
  ].join("\n");

  const htmlRows = (rows: Array<[string, string]>) =>
    rows.map(([k, v]) =>
      `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap;">${esc(k)}</td>` +
      `<td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600;">${esc(v)}</td></tr>`
    ).join("");

  const html = `
  <div style="background:#f5f5f3;padding:28px 14px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#0F3B47,#A12341);padding:28px;color:#fff;">
        <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.85;">Arteaga &amp; Aldunate Abogados y Asociados</p>
        <h1 style="margin:10px 0 0;font-size:22px;">Nueva consulta legal</h1>
        <p style="margin:8px 0 0;font-size:13px;opacity:.9;">${esc(areaLabel)}${data.urgencia === "inmediata" ? " · <strong>URGENTE</strong>" : ""}</p>
      </div>
      <div style="padding:22px 26px;">
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Contacto</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">${htmlRows(contacto)}</table>
        ${clasificacion.length ? `
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Clasificación del caso</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">${htmlRows(clasificacion)}</table>` : ""}
        <h2 style="font-size:13px;color:#A12341;text-transform:uppercase;letter-spacing:.1em;margin:0 0 6px;">Descripción</h2>
        <p style="color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(data.message)}</p>
      </div>
    </div>
  </div>`;

  return { subject, text, html };
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- api/emailTemplate.test.ts`
Expected: PASS — 4 tests verdes.

- [ ] **Step 5: Cablear en `api/contact.ts`**

Reemplazar el bloque que arma `subject`/`text`/`html` a mano por el uso de `buildLeadEmail`, y actualizar los campos requeridos. Cambios exactos:

1. Al inicio del archivo, tras los imports existentes, agregar:
```ts
import { buildLeadEmail } from "./emailTemplate";
```
2. La validación de requeridos: mantener `["name", "email", "message"]` (compatibilidad legado). Dejar igual.
3. Reemplazar todo el bloque que construye `const subject = ...`, `const text = [...]` y `const html = \`...\`` por:
```ts
    const { subject, text, html } = buildLeadEmail(data as any);
```
4. En `transporter.sendMail({...})`, usar esos `subject`, `text`, `html` (mantener `from`, `to`, `replyTo` si existen; si no existe `replyTo`, agregar `replyTo: data.email`).

- [ ] **Step 6: Verificar build de tipos y lint**

Run: `npm run build`
Expected: compila sin errores de TypeScript.
Run: `npm run lint`
Expected: sin errores nuevos en `api/`.

- [ ] **Step 7: Commit**

```bash
git add api/emailTemplate.ts api/emailTemplate.test.ts api/contact.ts
git commit -m "feat: correo de leads ordenado por secciones y asunto filtrable

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Helper de envío + bus de pre-selección de área

**Files:**
- Create: `src/lib/leadApi.ts`
- Create: `src/lib/leadApi.test.ts`
- Create: `src/lib/leadPrefill.ts`

**Interfaces:**
- Consumes: `LeadFormValues` de `leadSchema.ts`.
- Produces:
  - `submitLead(payload: Partial<LeadFormValues> & { name: string; email: string; message: string }): Promise<{ ok: boolean; message?: string }>`
  - `prefillArea(area: Area): void`, `onPrefillArea(cb: (area: Area) => void): () => void`

- [ ] **Step 1: Escribir el test que falla (`src/lib/leadApi.test.ts`)**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLead } from "./leadApi";

describe("submitLead", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("hace POST a /api/contact con JSON y devuelve ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await submitLead({
      name: "Juan", email: "j@x.cl", message: "hola mundo largo", area: "penal",
    } as any);

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }));
  });

  it("devuelve ok:false si el servidor responde error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false, json: async () => ({ ok: false, message: "boom" }),
    }));
    const res = await submitLead({ name: "a", email: "a@x.cl", message: "xxxxxxxxxxxxxxx" } as any);
    expect(res.ok).toBe(false);
    expect(res.message).toBe("boom");
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- src/lib/leadApi.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `src/lib/leadApi.ts`**

```ts
import type { LeadFormValues } from "./leadSchema";

export type LeadPayload = Partial<LeadFormValues> & {
  name: string; email: string; message: string;
};

export async function submitLead(
  payload: LeadPayload
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, message: data.message || "No se pudo enviar tu consulta." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Error de conexión. Intenta nuevamente." };
  }
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `npm test -- src/lib/leadApi.test.ts`
Expected: PASS.

- [ ] **Step 5: Implementar `src/lib/leadPrefill.ts`** (sin test; utilería de eventos DOM)

```ts
import type { Area } from "./leadSchema";

const EVENT = "lead:prefill-area";

/** Pre-selecciona un área en el formulario de contacto y hace scroll hacia él. */
export function prefillArea(area: Area) {
  window.dispatchEvent(new CustomEvent<Area>(EVENT, { detail: area }));
  const el = document.getElementById("contacto");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/** Suscribe el formulario a los eventos de pre-selección. Devuelve un unsubscribe. */
export function onPrefillArea(cb: (area: Area) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Area>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/leadApi.ts src/lib/leadApi.test.ts src/lib/leadPrefill.ts
git commit -m "feat: helper submitLead y bus de pre-selección de área

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Formulario inteligente segmentado (`ContactSection`)

**Files:**
- Modify: `src/components/ContactSection.tsx` (reescritura del formulario; conservar la columna de info de contacto y el mapa)
- Test: `src/components/ContactSection.test.tsx` (Create)

**Interfaces:**
- Consumes: `leadSchema`, labels y helpers de `leadSchema.ts`; `submitLead` de `leadApi.ts`; `onPrefillArea` de `leadPrefill.ts`.
- Produces: sección con `id="contacto"` que contiene el formulario autoritativo.

- [ ] **Step 1: Escribir el test de comportamiento (`src/components/ContactSection.test.tsx`)**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactSection from "./ContactSection";

// El Toaster real usa hooks globales; envolvemos sin providers extra.
describe("ContactSection (formulario adaptativo)", () => {
  it("muestra el campo 'situación' solo cuando el área es Penal", () => {
    render(<ContactSection />);
    // Por defecto no hay situación penal visible
    expect(screen.queryByText(/Situación actual/i)).toBeNull();
    // Seleccionar área Penal
    const areaSelect = screen.getByLabelText(/Área/i) as HTMLSelectElement;
    fireEvent.change(areaSelect, { target: { value: "penal" } });
    expect(screen.getByText(/Situación actual/i)).toBeInTheDocument();
  });

  it("muestra 'monto involucrado' para Civil", () => {
    render(<ContactSection />);
    const areaSelect = screen.getByLabelText(/Área/i) as HTMLSelectElement;
    fireEvent.change(areaSelect, { target: { value: "civil" } });
    expect(screen.getByText(/Monto involucrado/i)).toBeInTheDocument();
  });
});
```

> Nota para el implementador: para que `getByLabelText`/`getByText` funcionen, usar `<select>` nativos (no el Select de Radix, difícil de testear sin userEvent avanzado) con `<label htmlFor>` asociado. Esto también mejora accesibilidad y rendimiento del form. Mantener el estilo con clases Tailwind sobre el `<select>`.

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npm test -- src/components/ContactSection.test.tsx`
Expected: FAIL (el formulario actual no tiene selects de área/situación).

- [ ] **Step 3: Reescribir `src/components/ContactSection.tsx`**

Reemplazar el `<form>` y su `useState`/`handleSubmit` por react-hook-form + zod. Conservar la columna izquierda de información (oficina, teléfono, correo, horarios, bloque de emergencia) y el bloque del mapa tal como están. El formulario nuevo:

```tsx
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
```

Y en el componente `ContactSection`, sustituir la `<Card>` del formulario antiguo por `<ContactForm />`, dejando intacta la columna de información y el mapa. Exportar `ContactSection` por defecto.

- [ ] **Step 4: Ejecutar y verificar que pasan los tests**

Run: `npm test -- src/components/ContactSection.test.tsx`
Expected: PASS — 2 tests.

- [ ] **Step 5: Build y lint**

Run: `npm run build` → compila. `npm run lint` → sin errores nuevos.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactSection.tsx src/components/ContactSection.test.tsx
git commit -m "feat: formulario de caso segmentado y adaptativo por área

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Header con desplegable de áreas + anclajes corregidos + CTA urgente

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/PracticeAreas.tsx` (CTA usa `prefillArea`)

**Interfaces:**
- Consumes: `AREAS`, `AREA_LABELS`, `type Area` de `leadSchema.ts`; `prefillArea` de `leadPrefill.ts`; `Link`/`useNavigate` de react-router-dom.
- Produces: navegación funcional; ítems apuntan a IDs reales (`hero`, `nosotros`, `areas`, `equipo`, `contacto`) y a la ruta `/blog`.

- [ ] **Step 1: Reescribir la navegación de `Header.tsx`**

Reemplazar el arreglo `navItems` y la `<nav>` desktop. Reglas:
- Ítems que hacen scroll (misma página): `Inicio`→`hero`, `Nosotros`→`nosotros`, `Equipo`→`equipo`, `Contacto`→`contacto`.
- `Áreas de Práctica`: botón con menú desplegable (usar Radix `NavigationMenu` de `@/components/ui/navigation-menu`, ya disponible) que lista `AREAS`. Al hacer clic en un área: `prefillArea(area)` (esto ya hace scroll a `#contacto`)… **no** — el desplegable debe llevar a la sección de áreas. Definición: al hacer clic en un área, hacer scroll a `#areas`. Además un ítem "Consultar por esta área" no aplica aquí; mantener simple: clic en área → scroll a `#areas`.
- `Blog`: usar `<Link to="/blog">` (react-router). Requiere que el Header se renderice dentro del Router (ya lo está vía `App.tsx`).
- Botón CTA urgente permanente (desktop y móvil): **"Habla con un abogado"** → `href="https://wa.me/56995336140?text=..."`.

Código de la sección desktop (reemplaza el `<nav className="hidden lg:flex ...">` actual):

```tsx
import { Link } from "react-router-dom";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AREAS, AREA_LABELS } from "@/lib/leadSchema";

// dentro del componente:
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  setIsMenuOpen(false);
};

// nav desktop:
<nav className="hidden lg:flex items-center gap-6">
  <button onClick={() => scrollTo("hero")} className="font-body text-sm font-medium hover:text-legal-primary">INICIO</button>
  <button onClick={() => scrollTo("nosotros")} className="font-body text-sm font-medium hover:text-legal-primary">NOSOTROS</button>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="font-body text-sm font-medium">ÁREAS DE PRÁCTICA</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[420px] grid-cols-2 gap-1 p-3">
            {AREAS.map((a) => (
              <li key={a}>
                <button onClick={() => scrollTo("areas")}
                  className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-legal-primary/5 hover:text-legal-primary">
                  {AREA_LABELS[a]}
                </button>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  <button onClick={() => scrollTo("equipo")} className="font-body text-sm font-medium hover:text-legal-primary">EQUIPO</button>
  <Link to="/blog" className="font-body text-sm font-medium hover:text-legal-primary">BLOG</Link>
  <button onClick={() => scrollTo("contacto")} className="font-body text-sm font-medium hover:text-legal-primary">CONTACTO</button>
</nav>
```

Botón CTA urgente (reemplaza el botón "Contactar" actual, tanto desktop como en el bloque móvil):
```tsx
<a href="https://wa.me/56995336140?text=Hola,%20necesito%20hablar%20con%20un%20abogado."
   target="_blank" rel="noopener noreferrer"
   className="hidden sm:inline-flex items-center gap-2 bg-legal-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-legal-primary/90 transition">
  <Phone className="w-4 h-4" /> Habla con un abogado
</a>
```

En el menú móvil, reemplazar los ítems por la misma lista (Inicio, Nosotros, Áreas→scroll `areas`, Equipo, Blog→`Link to="/blog"`, Contacto) y el mismo CTA a ancho completo. Para "Áreas" en móvil, un simple botón que hace `scrollTo("areas")` es suficiente (no es necesario submenú anidado).

- [ ] **Step 2: Actualizar CTA de `PracticeAreas.tsx`**

En `PracticeAreas.tsx`, el botón "Consultar ahora" (actualmente `<a href="#contacto">`) debe pre-seleccionar el área activa. Reemplazar ese `<a>` por:
```tsx
import { prefillArea } from "@/lib/leadPrefill";
import type { Area } from "@/lib/leadSchema";

// mapa título -> Area
const AREA_KEY: Record<string, Area> = {
  "Derecho Penal": "penal", "Derecho Civil": "civil", "Derecho Laboral": "laboral",
  "Derecho de Familia": "familia", "Derecho Corporativo": "corporativo",
  "Derecho Inmobiliario": "inmobiliario", "Derecho Tributario": "tributario",
};

<button
  onClick={() => prefillArea(AREA_KEY[areas[active].title])}
  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition"
>
  Consultar ahora
  <ChevronRight className="w-5 h-5 ml-2" />
</button>
```

- [ ] **Step 3: Verificar build y lint**

Run: `npm run build` → compila. `npm run lint` → sin errores nuevos.

- [ ] **Step 4: Verificación visual**

Levantar `npm run dev`, abrir el sitio y comprobar: el desplegable de Áreas abre y sus ítems bajan a la sección de áreas; "Blog" navega a `/blog` (aún puede ser placeholder); el CTA "Habla con un abogado" abre WhatsApp; en móvil el menú funciona; el botón "Consultar ahora" de un área baja al formulario con el área pre-seleccionada.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/PracticeAreas.tsx
git commit -m "feat: menú con desplegable de áreas, anclajes corregidos y CTA urgente

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Hero con banner + formulario rápido funcional

**Files:**
- Modify: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `submitLead` de `leadApi.ts`; `useToast`.
- Produces: hero con `id="hero"`; el mini-form envía a `/api/contact`.

- [ ] **Step 1: Corregir el `id` de la sección**

En `HeroSection.tsx`, cambiar `<section id="hero" ...>` — ya usa `id="hero"`. Verificar que el CTA primario haga scroll a `#contacto` en vez de `tel:`. Cambiar el primer `<a href={tel:...}>` por:
```tsx
<button
  onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
  className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
>
  <Phone className="w-5 h-5" /> Cuéntanos tu caso
</button>
```

- [ ] **Step 2: Cablear el formulario del hero a `submitLead`**

Reemplazar `handleSubmit` (que hoy hace `console.log`) por envío real:
```tsx
import { submitLead } from "@/lib/leadApi";
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name.trim() || !formData.email.trim() || formData.message.trim().length < 15) {
    toast({ title: "Completa los campos",
      description: "Nombre, correo y una breve descripción (mín. 15 caracteres).",
      variant: "destructive" });
    return;
  }
  setSubmitting(true);
  const res = await submitLead({
    name: formData.name.trim(), email: formData.email.trim(),
    phone: formData.phone.trim(), message: formData.message.trim(),
  });
  setSubmitting(false);
  if (res.ok) {
    toast({ title: "Consulta enviada", description: "Te responderemos a la brevedad." });
    setFormData({ name: "", phone: "", email: "", message: "" });
  } else {
    toast({ title: "Error al enviar", description: res.message, variant: "destructive" });
  }
};
```
Y en el `<Button type="submit">`, deshabilitar con `disabled={submitting}` y mostrar "Enviando..." cuando corresponda.

- [ ] **Step 3: Banner de fondo**

Reemplazar el gradiente plano `bg-gradient-hero` del `<section>` por un banner con imagen + overlay. Usar la imagen existente `src/assets/hero-legal.jpg`:
```tsx
import heroBg from "@/assets/hero-legal.jpg";
// ...
<section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/60" />
  </div>
  {/* ...contenido... */}
</section>
```
Ajustar colores de texto si el overlay reduce contraste (mantener texto oscuro sobre el lado claro del overlay).

- [ ] **Step 4: Verificar build, lint y visual**

Run: `npm run build` → compila. `npm run lint` → limpio.
Visual (`npm run dev`): el hero muestra el banner; enviar el mini-form muestra toast de éxito (con SMTP configurado) o de error controlado; el CTA "Cuéntanos tu caso" baja al formulario.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: hero con banner y formulario rápido que envía correo

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Sección "Por qué elegirnos" (numerada)

**Files:**
- Create: `src/components/WhyChooseUs.tsx`

**Interfaces:**
- Produces: `export default WhyChooseUs`; sección con `id="por-que-elegirnos"`.

- [ ] **Step 1: Crear `src/components/WhyChooseUs.tsx`**

```tsx
import { motion } from "framer-motion";

const reasons = [
  { n: "01", title: "Trayectoria y especialización",
    desc: "Abogados con experiencia real en tribunales, especializados por área. Sabemos dónde y cómo se gana cada caso." },
  { n: "02", title: "Atención directa del abogado",
    desc: "Hablas siempre con el abogado que lleva tu causa, no con intermediarios. Sin derivaciones a terceros." },
  { n: "03", title: "Protocolo de respuesta inmediata",
    desc: "En materia penal cada hora cuenta. Tenemos disponibilidad para actuar desde el primer minuto, incluso 24/7 en urgencias." },
  { n: "04", title: "Confidencialidad absoluta",
    desc: "Toda tu información está protegida por el secreto profesional. Tu caso se trata con la máxima reserva." },
];

const WhyChooseUs = () => (
  <section id="por-que-elegirnos" className="section-padding bg-background">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">Por qué elegirnos</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Razones para confiar su caso a nuestro estudio
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r, i) => (
          <motion.div key={r.n}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
            <span className="font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#A12341] to-[#0F3B47]">{r.n}</span>
            <h3 className="font-heading text-xl font-semibold text-foreground mt-4 mb-2">{r.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
```

- [ ] **Step 2: Build y lint**

Run: `npm run build` → compila. `npm run lint` → limpio.

- [ ] **Step 3: Commit**

```bash
git add src/components/WhyChooseUs.tsx
git commit -m "feat: sección 'Por qué elegirnos' numerada

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Testimonios anonimizados

**Files:**
- Create: `src/components/TestimonialsSection.tsx`

**Interfaces:**
- Produces: `export default TestimonialsSection`; sección con `id="testimonios"`.

- [ ] **Step 1: Crear `src/components/TestimonialsSection.tsx`**

```tsx
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { initials: "M.R.", area: "Derecho Penal", stars: 5,
    text: "Desde la primera llamada me explicaron todo con claridad y estuvieron disponibles cuando más lo necesitaba. Me sentí acompañada en todo el proceso." },
  { initials: "J.C.", area: "Derecho Laboral", stars: 5,
    text: "Respondieron rápido y siempre supe en qué etapa estaba mi caso. Trato directo con el abogado, sin vueltas." },
  { initials: "P.S.", area: "Derecho de Familia", stars: 5,
    text: "Un tema muy delicado tratado con respeto y reserva. Agradezco la cercanía y la honestidad en cada consejo." },
  { initials: "A.G.", area: "Derecho Civil", stars: 5,
    text: "Profesionales, claros con los honorarios y con los tiempos. Recomiendo el estudio sin dudarlo." },
  { initials: "R.M.", area: "Derecho Penal", stars: 5,
    text: "Actuaron de inmediato en una situación urgente. Su rapidez marcó la diferencia." },
  { initials: "C.V.", area: "Derecho Tributario", stars: 5,
    text: "Me orientaron con paciencia frente al SII y entendí cada paso. Excelente asesoría." },
];

const TestimonialsSection = () => (
  <section id="testimonios" className="section-padding bg-card">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">Testimonios</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Lo que dicen quienes confiaron en nosotros
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-6" />
        <p className="text-muted-foreground">
          Testimonios reales de clientes, anonimizados para resguardar su privacidad y el secreto profesional.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
            className="bg-background border border-border rounded-2xl p-7 shadow-soft flex flex-col">
            <Quote className="w-8 h-8 text-primary/30 mb-3" />
            <p className="text-muted-foreground leading-relaxed flex-grow">"{t.text}"</p>
            <div className="flex items-center gap-1 my-4">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A12341] to-[#0F3B47] text-white flex items-center justify-center font-semibold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Cliente {t.initials}</p>
                <p className="text-muted-foreground text-xs">{t.area}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
```

- [ ] **Step 2: Build y lint**

Run: `npm run build` → compila. `npm run lint` → limpio.

- [ ] **Step 3: Commit**

```bash
git add src/components/TestimonialsSection.tsx
git commit -m "feat: sección de testimonios anonimizados

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Capa de datos del blog (Markdown + loader)

**Files:**
- Create: `src/content/blog/citado-a-declarar.md`
- Create: `src/content/blog/despido-injustificado.md`
- Create: `src/content/blog/pension-de-alimentos.md`
- Create: `src/lib/blog.ts`
- Create: `src/lib/blog.test.ts`

**Interfaces:**
- Produces:
  - `type BlogPost = { slug, title, date, category, excerpt, description, content, author? }`
  - `getAllPosts(): BlogPost[]` (orden descendente por fecha)
  - `getPostBySlug(slug: string): BlogPost | undefined`

- [ ] **Step 1: Instalar dependencias del blog**

Run:
```bash
npm install react-markdown@^9 gray-matter@^4 remark-gfm@^4
```
> `gray-matter` parsea el frontmatter. Nota: `gray-matter` usa `Buffer`; en Vite del navegador funciona porque el frontmatter se parsea con las cadenas importadas como `?raw`. Si `Buffer` diera problemas en build, usar el parser manual incluido en el fallback del Step 4.

- [ ] **Step 2: Crear los 3 artículos semilla**

`src/content/blog/citado-a-declarar.md`:
```md
---
title: "¿Qué hacer si te citan a declarar por la Fiscalía?"
slug: "citado-a-declarar"
date: "2026-07-10"
category: "Derecho Penal"
excerpt: "Los primeros pasos si recibes una citación del Ministerio Público y por qué es clave contar con defensa desde el inicio."
description: "Guía práctica sobre qué hacer si te citan a declarar por Fiscalía en Chile: tus derechos, plazos y por qué necesitas un abogado penalista desde el primer momento."
author: "Arteaga & Aldunate"
---

Recibir una citación de la Fiscalía genera angustia. Lo primero: **no estás obligado a declarar sin un abogado**. Este artículo explica tus derechos y los pasos a seguir.

## Tienes derecho a guardar silencio

Nadie está obligado a declarar contra sí mismo. Puedes ejercer tu derecho a guardar silencio hasta contar con defensa.

## Antes de la audiencia

- Contacta a un abogado penalista apenas recibas la citación.
- Reúne todos los documentos relacionados.
- No borres ni alteres información: puede agravar tu situación.

## Por qué la defensa temprana es decisiva

La primera declaración puede condicionar todo el proceso. Un abogado prepara tu versión, evita autoincriminación y define la estrategia.

¿Te citaron a declarar? [Cuéntanos tu caso](/#contacto) y te orientamos de inmediato.
```

`src/content/blog/despido-injustificado.md`:
```md
---
title: "Despido injustificado: derechos del trabajador en Chile"
slug: "despido-injustificado"
date: "2026-06-22"
category: "Derecho Laboral"
excerpt: "Cuándo un despido es injustificado, qué indemnizaciones puedes reclamar y qué plazos existen para demandar."
description: "Todo sobre el despido injustificado en Chile: causales, indemnizaciones, recargos y el plazo de 60 días hábiles para demandar ante el Juzgado del Trabajo."
author: "Arteaga & Aldunate"
---

Si te despidieron y crees que no correspondía, la ley te protege. Conoce tus derechos antes de que venzan los plazos.

## ¿Cuándo es injustificado?

Cuando el empleador invoca una causal que no puede probar, o no cumple las formalidades del aviso de término.

## Indemnizaciones y recargos

- Indemnización por años de servicio.
- Indemnización sustitutiva del aviso previo.
- Recargos legales según la causal invocada.

## Plazo clave

Tienes **60 días hábiles** desde la separación para demandar (se suspende si reclamas en la Inspección del Trabajo).

¿Crees que tu despido fue injustificado? [Evaluamos tu caso](/#contacto) sin costo inicial.
```

`src/content/blog/pension-de-alimentos.md`:
```md
---
title: "Pensión de alimentos: cómo solicitar aumento, rebaja o cese"
slug: "pension-de-alimentos"
date: "2026-05-30"
category: "Derecho de Familia"
excerpt: "Cuándo procede modificar una pensión de alimentos y qué antecedentes son relevantes ante el tribunal."
description: "Guía clara sobre la pensión de alimentos en Chile: cómo pedir aumento, rebaja o cese, qué pruebas importan y cómo se calcula ante el Juzgado de Familia."
author: "Arteaga & Aldunate"
---

La pensión de alimentos puede modificarse cuando cambian las circunstancias. Te explicamos cuándo y cómo.

## Aumento

Procede si aumentan las necesidades del alimentario o mejora la capacidad económica del alimentante.

## Rebaja

Procede si disminuyen los ingresos del alimentante o cambian las necesidades del hijo.

## Cese

Termina, por ejemplo, cuando el hijo cumple la mayoría de edad y deja de estudiar, según los supuestos legales.

¿Necesitas revisar tu pensión? [Conversemos tu caso](/#contacto) con la reserva que merece.
```

- [ ] **Step 3: Escribir el test que falla (`src/lib/blog.test.ts`)**

```ts
import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog loader", () => {
  it("carga los 3 artículos semilla", () => {
    expect(getAllPosts().length).toBeGreaterThanOrEqual(3);
  });
  it("ordena por fecha descendente", () => {
    const posts = getAllPosts();
    expect(posts[0].date >= posts[1].date).toBe(true);
  });
  it("obtiene un post por slug con contenido", () => {
    const post = getPostBySlug("citado-a-declarar");
    expect(post?.title).toContain("citan a declarar");
    expect(post?.content.length).toBeGreaterThan(0);
    expect(post?.category).toBe("Derecho Penal");
  });
  it("devuelve undefined para slug inexistente", () => {
    expect(getPostBySlug("no-existe")).toBeUndefined();
  });
});
```

- [ ] **Step 4: Ejecutar y verificar que falla**

Run: `npm test -- src/lib/blog.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 5: Implementar `src/lib/blog.ts`**

```ts
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  category: string;
  excerpt: string;
  description: string;
  author?: string;
  content: string;
}

// Carga cruda de todos los .md en build (Vite import.meta.glob)
const files = import.meta.glob("/src/content/blog/*.md", {
  eager: true, query: "?raw", import: "default",
}) as Record<string, string>;

function parse(path: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const fallbackSlug = path.split("/").pop()!.replace(/\.md$/, "");
  return {
    slug: (data.slug as string) || fallbackSlug,
    title: data.title as string,
    date: data.date as string,
    category: data.category as string,
    excerpt: data.excerpt as string,
    description: (data.description as string) || (data.excerpt as string),
    author: data.author as string | undefined,
    content: content.trim(),
  };
}

const posts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
```

> Si `gray-matter` falla en el entorno de test/build por `Buffer`, sustituir `matter(raw)` por este parser mínimo de frontmatter (mismo retorno `{data, content}`):
> ```ts
> function matter(raw: string) {
>   const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
>   if (!m) return { data: {}, content: raw };
>   const data: Record<string, string> = {};
>   for (const line of m[1].split("\n")) {
>     const i = line.indexOf(":");
>     if (i === -1) continue;
>     const key = line.slice(0, i).trim();
>     const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
>     data[key] = val;
>   }
>   return { data, content: m[2] };
> }
> ```
> En ese caso, quitar el `import matter from "gray-matter"` y desinstalar la dependencia.

- [ ] **Step 6: Ejecutar y verificar que pasa**

Run: `npm test -- src/lib/blog.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog src/lib/blog.ts src/lib/blog.test.ts package.json package-lock.json
git commit -m "feat: capa de datos del blog (markdown + loader)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Páginas de blog, rutas, SEO y preview en el home

**Files:**
- Create: `src/components/Seo.tsx`
- Create: `src/pages/Blog.tsx`
- Create: `src/pages/BlogPost.tsx`
- Modify: `src/App.tsx` (rutas + `HelmetProvider`)
- Modify: `src/main.tsx` (import de estilos ya existe; sin cambios salvo Task 11)
- Modify: `src/components/BlogSection.tsx` (lee de `getAllPosts`)
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: `getAllPosts`, `getPostBySlug`, `BlogPost` de `blog.ts`.
- Produces: rutas `/blog` y `/blog/:slug`; componente `<Seo title description path />`.

- [ ] **Step 1: Instalar helmet**

Run: `npm install react-helmet-async@^2`

- [ ] **Step 2: Crear `src/components/Seo.tsx`**

```tsx
import { Helmet } from "react-helmet-async";

const SITE = "https://www.arteagayaldunate.cl";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}

const Seo = ({ title, description, path = "/", type = "website" }: SeoProps) => {
  const url = SITE + path;
  const full = `${title} | Arteaga & Aldunate Abogados`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default Seo;
```

- [ ] **Step 3: Crear `src/pages/Blog.tsx`** (listado)

```tsx
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getAllPosts } from "@/lib/blog";

const Blog = () => {
  const posts = getAllPosts();
  return (
    <div className="min-h-screen">
      <Seo title="Blog jurídico"
        description="Artículos prácticos sobre derecho penal, laboral, familia y más. Información legal clara del estudio Arteaga & Aldunate."
        path="/blog" />
      <Header />
      <main className="max-w-6xl mx-auto container-padding pt-32 pb-20">
        <div className="text-center mb-14">
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">Blog jurídico</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Información legal clara y actualizada</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`}
              className="group bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1 flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <CalendarDays className="w-4 h-4" />
                <span>{new Date(p.date).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-2">{p.category}</p>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 leading-snug">{p.title}</h2>
              <p className="text-muted-foreground leading-relaxed flex-grow">{p.excerpt}</p>
              <span className="inline-flex items-center text-primary font-semibold mt-4">
                Leer más <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
```

- [ ] **Step 4: Crear `src/pages/BlogPost.tsx`** (artículo)

```tsx
import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getPostBySlug } from "@/lib/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen">
      <Seo title={post.title} description={post.description} path={`/blog/${post.slug}`} type="article" />
      <Header />
      <main className="max-w-3xl mx-auto container-padding pt-32 pb-20">
        <Link to="/blog" className="inline-flex items-center text-primary font-semibold mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al blog
        </Link>
        <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-3">{post.category}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-10">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(post.date).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}</span>
          {post.author && <span>· {post.author}</span>}
        </div>
        <article className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
```

- [ ] **Step 5: Rutas + HelmetProvider en `src/App.tsx`**

Modificar `App.tsx`: envolver todo en `HelmetProvider` y agregar las rutas.
```tsx
import { HelmetProvider } from "react-helmet-async";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
// dentro del render, envolver <QueryClientProvider> con <HelmetProvider> y en <Routes>:
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/privacidad" element={<Privacidad />} />
<Route path="/terminos" element={<Terminos />} />
```
(Los componentes `Privacidad`/`Terminos` se crean en la Task 12; si se ejecuta esta task antes, crear placeholders mínimos que retornen `<div/>` y completarlos en Task 12, o reordenar para hacer Task 12 antes de estas dos rutas. Para evitar imports rotos, **crear ya** los archivos `src/pages/Privacidad.tsx` y `src/pages/Terminos.tsx` con contenido mínimo en esta task y enriquecerlos en Task 12.)

Contenido mínimo temporal de `src/pages/Privacidad.tsx` y `src/pages/Terminos.tsx` (se completa en Task 12):
```tsx
const Privacidad = () => <div className="min-h-screen" />;
export default Privacidad;
```

- [ ] **Step 6: `BlogSection.tsx` lee datos reales**

Reemplazar el arreglo estático `posts` por los 3 últimos de `getAllPosts()` y enlazar a `/blog/:slug`, más botón "Ver todos" → `/blog`:
```tsx
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/blog";
// ...
const posts = getAllPosts().slice(0, 3);
// cada tarjeta: <Link to={`/blog/${post.slug}`}> ... {post.category} / {post.title} / {post.excerpt} ...
// fecha: new Date(post.date).toLocaleDateString("es-CL", {...})
// botón inferior: <Link to="/blog">Ver todos los artículos</Link>
```
Conservar el diseño visual actual de las tarjetas (íconos por categoría opcional: mapear categoría→icono, o quitar el ícono).

- [ ] **Step 7: `public/robots.txt` y `public/sitemap.xml`**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.arteagayaldunate.cl/sitemap.xml
```
`public/sitemap.xml` (incluir home, /blog y los 3 artículos):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.arteagayaldunate.cl/</loc></url>
  <url><loc>https://www.arteagayaldunate.cl/blog</loc></url>
  <url><loc>https://www.arteagayaldunate.cl/blog/citado-a-declarar</loc></url>
  <url><loc>https://www.arteagayaldunate.cl/blog/despido-injustificado</loc></url>
  <url><loc>https://www.arteagayaldunate.cl/blog/pension-de-alimentos</loc></url>
</urlset>
```

- [ ] **Step 8: Verificar build, lint y navegación**

Run: `npm run build` → compila. `npm run lint` → limpio.
Visual (`npm run dev`): `/blog` lista 3 artículos; cada artículo renderiza en `/blog/:slug`; el `<title>` cambia por página (ver pestaña del navegador); "Blog" del header navega; "Ver todos" y "Volver al blog" funcionan.

- [ ] **Step 9: Commit**

```bash
git add src/components/Seo.tsx src/pages/Blog.tsx src/pages/BlogPost.tsx src/pages/Privacidad.tsx src/pages/Terminos.tsx src/App.tsx src/components/BlogSection.tsx public/robots.txt public/sitemap.xml package.json package-lock.json
git commit -m "feat: páginas de blog, rutas, SEO meta y preview en el home

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Prerender en build para SEO (HTML estático indexable)

**Files:**
- Modify: `src/main.tsx`
- Modify: `vite.config.ts`
- Modify: `package.json`
- Create: `src/routes.ts` (lista de rutas a prerenderizar)

**Interfaces:**
- Consumes: rutas de la app y `getAllPosts()` para enumerar slugs.
- Produces: build que genera `dist/index.html`, `dist/blog/index.html` y `dist/blog/<slug>/index.html` con contenido y meta reales.

**Enfoque primario: `vite-react-ssg`** (SSR en Node, sin Chromium — compatible con el build de Vercel). Es el que mejor calza con react-router.

- [ ] **Step 1: Instalar**

Run: `npm install -D vite-react-ssg@^0.7`

- [ ] **Step 2: Enumerar rutas a prerenderizar (`src/routes.ts`)**

```ts
import { getAllPosts } from "@/lib/blog";

export const staticPaths = [
  "/", "/blog", "/privacidad", "/terminos",
  ...getAllPosts().map((p) => `/blog/${p.slug}`),
];
```

- [ ] **Step 3: Adaptar el entry `src/main.tsx` a vite-react-ssg**

`vite-react-ssg` expone `ViteReactSSG` que reemplaza a `createRoot`. Requiere que las rutas se declaren como array de datos. Como el proyecto usa `<Routes>` JSX dentro de `App`, la vía de menor fricción es usar el modo "single page" de vite-react-ssg que sólo prerenderiza `includedRoutes`:

```tsx
import { ViteReactSSG } from "vite-react-ssg/single-page";
import App from "./App";
import "./index.css";
import { staticPaths } from "./routes";

export const createRoot = ViteReactSSG(<App />);

export const includedRoutes = () => staticPaths;
```
> Si `App` monta su propio `<BrowserRouter>`, en modo prerender puede requerir `StaticRouter`. `vite-react-ssg/single-page` maneja el enrutado durante el prerender; mantener `BrowserRouter` en `App` para el runtime del cliente. Verificar en el Step 5 que cada HTML contiene el contenido correcto de su ruta.

- [ ] **Step 4: Script de build en `package.json`**

Cambiar el script `build`:
```json
    "build": "vite-react-ssg build",
    "build:spa": "vite build",
```
Mantener `vite.config.ts` sin cambios salvo que vite-react-ssg pida `ssr` options; en tal caso agregar:
```ts
// vite.config.ts (dentro de defineConfig)
ssr: { noExternal: ["react-helmet-async"] },
```

- [ ] **Step 5: Ejecutar el build y verificar HTML estático**

Run: `npm run build`
Expected: se generan `dist/index.html`, `dist/blog/index.html` y una carpeta por slug con `index.html`.
Verificación:
```bash
grep -l "citan a declarar" dist/blog/citado-a-declarar/index.html
grep -c "<title>" dist/index.html
```
Expected: el HTML del artículo contiene su texto; cada página tiene su `<title>` propio (inyectado por Helmet en el prerender).

> **Fallback si `vite-react-ssg` no integra en < ~45 min** (conflicto con BrowserRouter, error de hidratación, o incompatibilidad de versión): revertir `build` a `vite build` y aceptar SPA client-rendered para esta entrega. El SEO básico sigue cubierto por `robots.txt`, `sitemap.xml` y las meta de Helmet (que Google ejecuta con JS, aunque con menos garantía). Documentar la decisión en el commit y dejar una nota en el spec. NO bloquear el resto del plan por esto.

- [ ] **Step 6: Commit**

```bash
git add src/main.tsx src/routes.ts vite.config.ts package.json package-lock.json
git commit -m "feat: prerender en build de home y blog para SEO indexable

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Ensamblaje del home, footer, páginas legales y limpieza

**Files:**
- Modify: `src/pages/Index.tsx` (orden de secciones)
- Modify: `src/components/Footer.tsx` (redes + enlaces legales)
- Modify: `src/pages/Privacidad.tsx`, `src/pages/Terminos.tsx` (contenido real)
- Delete: `src/components/ServicesSection111.tsx`, `src/components/MissionSection.tsx`, `src/components/ApproachSection.tsx`

**Interfaces:**
- Consumes: todos los componentes anteriores.
- Produces: home ensamblado en el orden aprobado.

- [ ] **Step 1: Reordenar `src/pages/Index.tsx`**

```tsx
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PracticeAreas from "@/components/PracticeAreas";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <PracticeAreas />
      <WhyChooseUs />
      <TeamSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
```

- [ ] **Step 2: Footer — redes y enlaces legales**

En `Footer.tsx`: los botones "Política de Privacidad" y "Términos de Servicio" pasan a ser `<Link to="/privacidad">` y `<Link to="/terminos">` (importar `Link` de react-router-dom). Agregar una fila de íconos de redes sociales (usar `lucide-react`: `Instagram`, `Linkedin`, `Facebook`) enlazando a `#` por ahora (placeholder editable):
```tsx
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook } from "lucide-react";
// junto al brand:
<div className="flex items-center gap-4 mt-4">
  <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-legal-primary"><Instagram className="w-5 h-5" /></a>
  <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-legal-primary"><Linkedin className="w-5 h-5" /></a>
  <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-legal-primary"><Facebook className="w-5 h-5" /></a>
</div>
```

- [ ] **Step 3: Completar páginas legales**

`src/pages/Privacidad.tsx`:
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Privacidad = () => (
  <div className="min-h-screen">
    <Seo title="Política de Privacidad" description="Política de privacidad y tratamiento de datos personales de Arteaga & Aldunate Abogados." path="/privacidad" />
    <Header />
    <main className="max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading">
      <h1>Política de Privacidad</h1>
      <p>En Arteaga &amp; Aldunate Abogados y Asociados resguardamos la información que nos entregas a través de este sitio. Los datos del formulario de contacto se utilizan exclusivamente para responder tu consulta y no se comparten con terceros.</p>
      <h2>Datos que recopilamos</h2>
      <p>Nombre, teléfono, correo electrónico y la descripción de tu caso que decidas compartir.</p>
      <h2>Confidencialidad</h2>
      <p>Toda la información está protegida por el secreto profesional del abogado.</p>
      <h2>Contacto</h2>
      <p>Para ejercer tus derechos sobre tus datos, escríbenos a abogados@arteagayaldunate.cl.</p>
    </main>
    <Footer />
  </div>
);
export default Privacidad;
```
`src/pages/Terminos.tsx` (análogo, con título "Términos de Servicio" y texto: naturaleza informativa del sitio, que el contenido no constituye asesoría jurídica y que la relación profesional se formaliza por contrato):
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Terminos = () => (
  <div className="min-h-screen">
    <Seo title="Términos de Servicio" description="Términos de uso del sitio de Arteaga & Aldunate Abogados." path="/terminos" />
    <Header />
    <main className="max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading">
      <h1>Términos de Servicio</h1>
      <p>La información de este sitio tiene carácter meramente informativo y no constituye asesoría jurídica. La relación profesional con el estudio se formaliza únicamente mediante un contrato de prestación de servicios.</p>
      <h2>Uso del sitio</h2>
      <p>El envío del formulario no crea por sí solo una relación abogado-cliente.</p>
    </main>
    <Footer />
  </div>
);
export default Terminos;
```

- [ ] **Step 4: Eliminar componentes muertos**

Run:
```bash
git rm src/components/ServicesSection111.tsx src/components/MissionSection.tsx src/components/ApproachSection.tsx
```
> Antes de eliminar, verificar que ningún archivo los importa:
> ```bash
> grep -rn "ServicesSection111\|MissionSection\|ApproachSection" src --include="*.tsx" | grep -v "^src/components/\(ServicesSection111\|MissionSection\|ApproachSection\).tsx"
> ```
> Expected: sin resultados (nadie los usa). Si aparece un import, quitarlo primero.
> Nota: `ServicesSection.tsx` y `FAQSection.tsx` NO se eliminan (FAQ se conserva; Services queda como referencia sin montar).

- [ ] **Step 5: Verificación integral**

Run: `npm test` → todos los tests verdes.
Run: `npm run lint` → limpio.
Run: `npm run build` → compila y prerenderiza (o SPA si aplicó el fallback de Task 11).
Visual (`npm run dev`): recorrer el home completo en el orden nuevo (Hero banner → Nosotros → Áreas → Por qué elegirnos → Equipo → Testimonios → Blog → Contacto); enviar el formulario segmentado con área Penal y comprobar toast; navegar a `/blog`, abrir un artículo, volver; footer con redes y enlaces a `/privacidad` y `/terminos` funcionando.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Index.tsx src/components/Footer.tsx src/pages/Privacidad.tsx src/pages/Terminos.tsx
git commit -m "feat: ensamblaje del home, footer con legales/redes y limpieza de componentes muertos

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Verificación final (checklist de aceptación)

- [ ] Ambos formularios (hero y contacto) envían correo vía `/api/contact`.
- [ ] El correo llega ordenado (Contacto / Clasificación / Descripción) con asunto filtrable `[URGENTE · ÁREA] …`.
- [ ] El formulario de contacto muestra campos condicionales según el área.
- [ ] El menú tiene desplegable de áreas, anclajes correctos y CTA urgente permanente.
- [ ] Existen "Por qué elegirnos" (numerada) y testimonios anonimizados.
- [ ] `/blog` y `/blog/:slug` funcionan, con meta tags por página.
- [ ] Build genera HTML prerenderizado del blog (o se documentó el fallback SPA).
- [ ] `npm test`, `npm run lint` y `npm run build` pasan.
- [ ] Componentes muertos eliminados; home en el orden aprobado.
```
