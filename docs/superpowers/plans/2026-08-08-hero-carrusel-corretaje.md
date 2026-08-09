# Carrusel del hero con línea de corretaje — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el hero en un carrusel de dos slides —defensa legal y corretaje con respaldo legal— cada uno con su propio formulario de primer contacto, reutilizando el backend SES existente.

**Architecture:** `HeroSection.tsx` se descompone en un carrusel (`HeroCarousel`), un layout de slide reutilizable (`HeroSlide`) y dos formularios autónomos. Los textos salen a `src/lib/heroSlides.ts` y la validación del formulario nuevo a `src/lib/brokerageSchema.ts`. El envío sigue pasando por `submitLead` → `/api/contact` → Lambda SES, sumando un campo `servicio` al payload.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind, zod, framer-motion, embla-carousel-react (ya instalado, con wrapper en `src/components/ui/carousel.tsx`), vitest + @testing-library/react. Backend: Node 20 / TypeScript / AWS SAM.

## Global Constraints

- Spec de referencia: `docs/superpowers/specs/2026-08-08-hero-carrusel-corretaje-design.md`.
- **Un solo `<h1>` en todo el documento**: el del slide legal. El titular de corretaje es `<h2>`.
- **Sin rotación automática.** El carrusel arranca siempre en el slide legal (índice 0).
- El slide inactivo debe llevar `inert` para que no sea tabulable ni lo lean lectores de pantalla.
- Mínimo de mensaje: **5 caracteres**, igual en ambos formularios.
- No se crea infraestructura AWS nueva. Los destinatarios no cambian.
- El proyecto está en producción: no tocar `vercel.json`, dominios ni DNS.
- Cada tarea termina con `npm test` en verde antes del commit.
- Repo de la landing: `/Users/lfgg/paldunate/landing-tech`. Repo del backend: `/Users/lfgg/paldunate/arteagayaldunate-contact-backend`.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `src/lib/brokerageSchema.ts` | Valores, etiquetas y schema zod del formulario de corretaje |
| `src/lib/heroSlides.ts` | Textos, imagen y CTAs de cada slide |
| `src/lib/leadApi.ts` | (modificar) ampliar `LeadPayload` a ambos formularios |
| `src/components/hero/HeroSlide.tsx` | Layout visual de un slide; recibe el formulario como `children` |
| `src/components/hero/LegalQuickForm.tsx` | Formulario legal actual, extraído sin cambio de conducta |
| `src/components/hero/BrokerageQuickForm.tsx` | Formulario de corretaje |
| `src/components/hero/HeroCarousel.tsx` | Control de slide activo, `inert`, botones y puntos |
| `src/components/HeroSection.tsx` | (modificar) ensamblador delgado |
| `arteagayaldunate-contact-backend/src/handlers/contact/app.ts` | (modificar) sección Propiedad y asunto de corretaje |

---

### Task 1: Schema del formulario de corretaje

**Files:**
- Create: `src/lib/brokerageSchema.ts`
- Test: `src/lib/brokerageSchema.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `OPERACIONES`, `OPERACION_LABELS`, `TIPOS_PROPIEDAD`, `TIPO_PROPIEDAD_LABELS`, `TEMAS_LEGALES`, `TEMA_LEGAL_LABELS`, `brokerageSchema`, `type BrokerageFormValues`.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/brokerageSchema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { brokerageSchema } from "./brokerageSchema";

const valido = {
  name: "Juan Pérez",
  phone: "+56 9 1234 5678",
  email: "juan@example.com",
  operacion: "vender",
  message: "Hola",
};

describe("brokerageSchema", () => {
  it("acepta el mínimo válido", () => {
    const r = brokerageSchema.safeParse(valido);
    expect(r.success).toBe(true);
  });

  it("exige nombre, teléfono, correo, operación y mensaje", () => {
    for (const campo of ["name", "phone", "email", "operacion", "message"]) {
      const sinCampo = { ...valido };
      delete (sinCampo as Record<string, unknown>)[campo];
      expect(brokerageSchema.safeParse(sinCampo).success).toBe(false);
    }
  });

  it("exige al menos 5 caracteres en el mensaje, igual que el formulario legal", () => {
    expect(brokerageSchema.safeParse({ ...valido, message: "hola" }).success).toBe(false);
    expect(brokerageSchema.safeParse({ ...valido, message: "hola!" }).success).toBe(true);
  });

  it("acepta los campos opcionales de propiedad", () => {
    const r = brokerageSchema.safeParse({
      ...valido,
      tipoPropiedad: "departamento",
      comuna: "Providencia",
      temaLegal: "si",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza cuando el honeypot viene lleno", () => {
    expect(brokerageSchema.safeParse({ ...valido, website: "bot" }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/lib/brokerageSchema.test.ts`
Expected: FAIL — no existe el módulo `./brokerageSchema`.

- [ ] **Step 3: Implementar el schema**

Crear `src/lib/brokerageSchema.ts`:

```ts
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
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test -- src/lib/brokerageSchema.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/brokerageSchema.ts src/lib/brokerageSchema.test.ts
git commit -m "feat: schema del formulario de corretaje"
```

---

### Task 2: Ampliar el tipo de payload de envío

**Files:**
- Modify: `src/lib/leadApi.ts:1-5`
- Test: `src/lib/leadApi.test.ts`

**Interfaces:**
- Consumes: `BrokerageFormValues` de Task 1.
- Produces: `LeadPayload` que acepta campos de ambos formularios más `servicio: "legal" | "corretaje"`. `submitLead(payload: LeadPayload)` mantiene su firma y su retorno `{ ok: boolean; message?: string }`.

**Contexto:** hoy `LeadPayload` es `Partial<LeadFormValues> & { name; email; message }`, que rechaza en compilación cualquier campo de corretaje.

- [ ] **Step 1: Escribir el test que falla**

Agregar al final de `src/lib/leadApi.test.ts`:

```ts
it("envía los campos de corretaje junto al servicio", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });
  vi.stubGlobal("fetch", fetchMock);

  await submitLead({
    servicio: "corretaje",
    name: "Juan",
    email: "j@e.com",
    message: "Hola!",
    phone: "+56911111111",
    operacion: "vender",
    comuna: "Providencia",
  });

  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(body.servicio).toBe("corretaje");
  expect(body.operacion).toBe("vender");
  expect(body.comuna).toBe("Providencia");
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/lib/leadApi.test.ts`
Expected: FAIL de TypeScript — `operacion` y `servicio` no existen en `LeadPayload`.

- [ ] **Step 3: Ampliar el tipo**

Reemplazar las primeras líneas de `src/lib/leadApi.ts`:

```ts
import type { LeadFormValues } from "./leadSchema";
import type { BrokerageFormValues } from "./brokerageSchema";

export type Servicio = "legal" | "corretaje";

/**
 * El endpoint es el mismo para ambos formularios, así que el payload es la
 * unión de los dos, con los tres campos que el backend siempre exige.
 */
export type LeadPayload = Partial<LeadFormValues> &
  Partial<BrokerageFormValues> & {
    name: string;
    email: string;
    message: string;
    servicio?: Servicio;
  };
```

El resto del archivo queda igual.

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test -- src/lib/leadApi.test.ts && npx tsc --noEmit -p tsconfig.app.json`
Expected: tests PASS. `tsc` debe seguir mostrando **7 errores preexistentes** en `AboutSection.tsx` y `ContactSection.tsx`, ninguno nuevo.

- [ ] **Step 5: Commit**

```bash
git add src/lib/leadApi.ts src/lib/leadApi.test.ts
git commit -m "feat: el payload de leads acepta ambos formularios"
```

---

### Task 3: Datos de los slides y extracción del formulario legal

**Files:**
- Create: `src/lib/heroSlides.ts`
- Create: `src/components/hero/LegalQuickForm.tsx`
- Modify: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `submitLead` de Task 2.
- Produces: `HERO_SLIDES: HeroSlideData[]` con `{ id, eyebrow, title, description, image, ctaLabel, ctaTarget }`; componente `LegalQuickForm` sin props.

**Nota:** esta tarea no cambia ninguna conducta visible. Solo mueve código. Al terminar, el hero debe verse y comportarse exactamente igual que antes.

- [ ] **Step 1: Crear los datos de los slides**

Crear `src/lib/heroSlides.ts`:

```ts
import heroLegal from "@/assets/hero-legal.jpg";

export interface HeroSlideData {
  id: "legal" | "corretaje";
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
  whatsappMessage: string;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "legal",
    eyebrow: "Estudio Jurídico en Chile",
    title: "Defensa estratégica, asesoría cercana y resultados que se ven.",
    description:
      "Somos un estudio jurídico, con sede en Santiago y cobertura nacional, que combina la rigurosidad técnica con la cercanía y disponibilidad que usted necesita. Defendemos sus derechos, su patrimonio y su tranquilidad.",
    image: heroLegal,
    ctaLabel: "Cuéntanos tu caso",
    ctaTarget: "contacto",
    whatsappMessage: "Hola, necesito ayuda legal.",
  },
  {
    id: "corretaje",
    eyebrow: "Corretaje con respaldo legal",
    title: "Vende o arrienda tu propiedad con un estudio jurídico detrás.",
    description:
      "Corretaje de propiedades acompañado de asesoría legal y representación judicial. Si tu propiedad arrastra una herencia sin resolver, un arriendo impago o un conflicto entre copropietarios, lo vemos nosotros mismos: no tendrás que contratar a un abogado aparte.",
    image: heroLegal,
    ctaLabel: "Habla con un corredor",
    ctaTarget: "contacto",
    whatsappMessage: "Hola, quiero asesoría para vender o arrendar mi propiedad.",
  },
];
```

> La imagen del segundo slide reutiliza `hero-legal.jpg` a propósito: no hay foto de corretaje aún. Cuando llegue, se cambia solo este archivo.

- [ ] **Step 2: Extraer el formulario legal**

Crear `src/components/hero/LegalQuickForm.tsx` moviendo, **sin modificar su lógica**, el estado `formData`, `handleChange`, `handleSubmit` y todo el bloque `<Card>…</Card>` que hoy vive entre las líneas 24-79 y 187-284 de `HeroSection.tsx`. Agregar `servicio: "legal"` a la llamada de `submitLead`:

```tsx
const res = await submitLead({
  servicio: "legal",
  name: formData.name.trim(),
  email: formData.email.trim(),
  phone: formData.phone.trim(),
  message: formData.message.trim(),
});
```

El componente exporta por defecto `LegalQuickForm` y no recibe props.

- [ ] **Step 3: Dejar `HeroSection` usando el componente extraído**

`HeroSection.tsx` mantiene su markup actual pero reemplaza el bloque del formulario por `<LegalQuickForm />`, y toma los textos de `HERO_SLIDES[0]`.

- [ ] **Step 4: Verificar que nada cambió**

Run: `npm test && npm run build`
Expected: 18 tests PASS, build OK.
Verificación manual: `npm run dev`, el hero se ve igual y el formulario sigue enviando.

- [ ] **Step 5: Commit**

```bash
git add src/lib/heroSlides.ts src/components/hero/LegalQuickForm.tsx src/components/HeroSection.tsx
git commit -m "refactor: extrae el formulario legal del hero y separa los textos"
```

---

### Task 4: Formulario de corretaje

**Files:**
- Create: `src/components/hero/BrokerageQuickForm.tsx`
- Test: `src/components/hero/BrokerageQuickForm.test.tsx`

**Interfaces:**
- Consumes: `brokerageSchema`, `OPERACIONES`, `OPERACION_LABELS`, `TIPOS_PROPIEDAD`, `TIPO_PROPIEDAD_LABELS`, `TEMAS_LEGALES`, `TEMA_LEGAL_LABELS` (Task 1); `submitLead` (Task 2).
- Produces: componente `BrokerageQuickForm` sin props.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/components/hero/BrokerageQuickForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BrokerageQuickForm from "./BrokerageQuickForm";
import * as leadApi from "@/lib/leadApi";

describe("BrokerageQuickForm", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("no envía si faltan campos obligatorios", async () => {
    const spy = vi.spyOn(leadApi, "submitLead");
    render(<BrokerageQuickForm />);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => expect(spy).not.toHaveBeenCalled());
  });

  it("envía servicio corretaje con los datos de la propiedad", async () => {
    const spy = vi
      .spyOn(leadApi, "submitLead")
      .mockResolvedValue({ ok: true });

    render(<BrokerageQuickForm />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "+56 9 1234 5678" },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/qué necesitas/i), {
      target: { value: "vender" },
    });
    fireEvent.change(screen.getByLabelText(/comuna/i), {
      target: { value: "Providencia" },
    });
    fireEvent.change(screen.getByLabelText(/cuéntanos/i), {
      target: { value: "Quiero vender mi departamento." },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const payload = spy.mock.calls[0][0];
    expect(payload.servicio).toBe("corretaje");
    expect(payload.operacion).toBe("vender");
    expect(payload.comuna).toBe("Providencia");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/components/hero/BrokerageQuickForm.test.tsx`
Expected: FAIL — no existe el módulo.

- [ ] **Step 3: Implementar el formulario**

Crear `src/components/hero/BrokerageQuickForm.tsx`. Estructura: mismo `Card` y clases que `LegalQuickForm` para que ambos slides se vean hermanos. Cada control lleva `<label htmlFor>` con `id` en el campo — los tests lo buscan por etiqueta, y sin `htmlFor` no son accesibles.

```tsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Home } from "lucide-react";
import { submitLead } from "@/lib/leadApi";
import { useToast } from "@/hooks/use-toast";
import {
  brokerageSchema,
  OPERACIONES, OPERACION_LABELS,
  TIPOS_PROPIEDAD, TIPO_PROPIEDAD_LABELS,
  TEMAS_LEGALES, TEMA_LEGAL_LABELS,
} from "@/lib/brokerageSchema";

const VACIO = {
  name: "", phone: "", email: "", operacion: "",
  tipoPropiedad: "", comuna: "", temaLegal: "", message: "", website: "",
};

const BrokerageQuickForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(VACIO);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "")
    );
    const parsed = brokerageSchema.safeParse({ website: "", ...limpio });
    if (!parsed.success) {
      toast({
        title: "Revisa los datos",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const res = await submitLead({ servicio: "corretaje", ...parsed.data });
    setSubmitting(false);

    if (res.ok) {
      toast({ title: "Consulta enviada", description: "Te contactaremos a la brevedad." });
      setForm(VACIO);
    } else {
      toast({ title: "Error al enviar", description: res.message, variant: "destructive" });
    }
  };

  return (
    <Card className="p-8 shadow-card-soft border border-border bg-background/80 backdrop-blur rounded-2xl">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            Cuéntanos de tu propiedad
          </h3>
          <p className="text-muted-foreground text-sm">
            Todos los campos marcados con * son obligatorios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-name" className="text-sm font-medium text-foreground mb-2 block">
              Nombre completo *
            </label>
            <Input id="b-name" name="name" value={form.name} onChange={onChange}
              placeholder="Tu nombre completo" />
          </div>
          <div>
            <label htmlFor="b-phone" className="text-sm font-medium text-foreground mb-2 block">
              Teléfono *
            </label>
            <Input id="b-phone" name="phone" type="tel" value={form.phone} onChange={onChange}
              placeholder="+56 9 XXXX XXXX" />
          </div>
        </div>

        <div>
          <label htmlFor="b-email" className="text-sm font-medium text-foreground mb-2 block">
            Correo electrónico *
          </label>
          <Input id="b-email" name="email" type="email" value={form.email} onChange={onChange}
            placeholder="tu@email.com" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-operacion" className="text-sm font-medium text-foreground mb-2 block">
              ¿Qué necesitas? *
            </label>
            <select id="b-operacion" name="operacion" value={form.operacion} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {OPERACIONES.map((o) => (
                <option key={o} value={o}>{OPERACION_LABELS[o]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="b-tipo" className="text-sm font-medium text-foreground mb-2 block">
              Tipo de propiedad
            </label>
            <select id="b-tipo" name="tipoPropiedad" value={form.tipoPropiedad} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {TIPOS_PROPIEDAD.map((t) => (
                <option key={t} value={t}>{TIPO_PROPIEDAD_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="b-comuna" className="text-sm font-medium text-foreground mb-2 block">
              Comuna
            </label>
            <Input id="b-comuna" name="comuna" value={form.comuna} onChange={onChange}
              placeholder="Providencia" />
          </div>
          <div>
            <label htmlFor="b-tema" className="text-sm font-medium text-foreground mb-2 block">
              ¿Tiene algún tema legal pendiente?
            </label>
            <select id="b-tema" name="temaLegal" value={form.temaLegal} onChange={onChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Selecciona…</option>
              {TEMAS_LEGALES.map((t) => (
                <option key={t} value={t}>{TEMA_LEGAL_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="b-message" className="text-sm font-medium text-foreground mb-2 block">
            Cuéntanos brevemente *
          </label>
          <Textarea id="b-message" name="message" rows={4} value={form.message} onChange={onChange}
            className="resize-none"
            placeholder="Ubicación aproximada, estado de la propiedad, plazos que manejas..." />
        </div>

        {/* honeypot: invisible para personas, tentador para bots */}
        <input type="text" name="website" value={form.website} onChange={onChange}
          tabIndex={-1} autoComplete="off" aria-hidden="true"
          className="absolute left-[-9999px] w-px h-px opacity-0" />

        <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-2">
          <Home className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Corretaje y abogado en un solo lugar:</strong>{" "}
            si la propiedad tiene un conflicto legal, lo resolvemos nosotros.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 group" disabled={submitting}>
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Enviando...</>
          ) : (
            <><Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />Enviar consulta gratuita</>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default BrokerageQuickForm;
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npm test -- src/components/hero/BrokerageQuickForm.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/BrokerageQuickForm.tsx src/components/hero/BrokerageQuickForm.test.tsx
git commit -m "feat: formulario de primer contacto de corretaje"
```

---

### Task 5: Slide y carrusel

**Files:**
- Create: `src/components/hero/HeroSlide.tsx`
- Create: `src/components/hero/HeroCarousel.tsx`
- Test: `src/components/hero/HeroCarousel.test.tsx`

**Interfaces:**
- Consumes: `HERO_SLIDES`, `HeroSlideData` (Task 3).
- Produces: `HeroSlide` con props `{ slide: HeroSlideData; isFirst: boolean; children: React.ReactNode }`; `HeroCarousel` con props `{ slides: Array<{ data: HeroSlideData; form: React.ReactNode }> }`.

`isFirst` decide si el titular se renderiza como `<h1>` o `<h2>` — la regla de un solo H1 del spec.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/components/hero/HeroCarousel.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroCarousel from "./HeroCarousel";
import { HERO_SLIDES } from "@/lib/heroSlides";

const slides = HERO_SLIDES.map((data) => ({
  data,
  form: <div>form-{data.id}</div>,
}));

describe("HeroCarousel", () => {
  it("renderiza ambos slides para que su texto sea indexable", () => {
    render(<HeroCarousel slides={slides} />);
    expect(screen.getByText(HERO_SLIDES[0].title)).toBeInTheDocument();
    expect(screen.getByText(HERO_SLIDES[1].title)).toBeInTheDocument();
  });

  it("usa un solo h1, el del primer slide", () => {
    render(<HeroCarousel slides={slides} />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(HERO_SLIDES[0].title);
  });

  it("arranca en el slide legal y marca el otro como inert", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(false);
    expect(items[1].hasAttribute("inert")).toBe(true);
  });

  it("expone controles accesibles para cambiar de slide", () => {
    render(<HeroCarousel slides={slides} />);
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /anterior/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test -- src/components/hero/HeroCarousel.test.tsx`
Expected: FAIL — no existe el módulo.

- [ ] **Step 3: Implementar `HeroSlide`**

Crear `src/components/hero/HeroSlide.tsx`, tomando el markup visual actual del hero (fondo, eyebrow, titular, bajada, CTAs, stats) desde `HeroSection.tsx:86-178`:

```tsx
import { Phone, MessageCircle } from "lucide-react";
import type { HeroSlideData } from "@/lib/heroSlides";

const WHATSAPP_PHONE = "56995336140";

const STATS = [
  { num: "15+", label: "Años de experiencia" },
  { num: "2.000+", label: "Casos resueltos" },
  { num: "98%", label: "Satisfacción" },
];

interface Props {
  slide: HeroSlideData;
  /** Solo el primer slide lleva el h1 del documento. */
  isFirst: boolean;
  children: React.ReactNode;
}

const HeroSlide = ({ slide, isFirst, children }: Props) => {
  const Titular = isFirst ? "h1" : "h2";

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={slide.image} alt="" aria-hidden className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-28 md:py-36 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-primary/70 font-semibold text-sm md:text-base tracking-widest uppercase mb-4">
              {slide.eyebrow}
            </p>

            <Titular className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              {slide.title}
            </Titular>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  document.getElementById(slide.ctaTarget)?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition shadow-soft"
              >
                <Phone className="w-5 h-5" />
                {slide.ctaLabel}
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(slide.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border-[2px] border-[#25D366] bg-background text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary transition shadow-soft"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{s.num}</p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;
```

- [ ] **Step 4: Implementar `HeroCarousel`**

Crear `src/components/hero/HeroCarousel.tsx`. Se usa `useState` con transformación CSS en vez del wrapper de embla, porque necesitamos control explícito de `inert` por slide:

```tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlide from "./HeroSlide";
import type { HeroSlideData } from "@/lib/heroSlides";

interface Props {
  slides: Array<{ data: HeroSlideData; form: React.ReactNode }>;
}

const HeroCarousel = ({ slides }: Props) => {
  // Arranca siempre en el slide legal: es el que Google indexa.
  const [activo, setActivo] = useState(0);
  const total = slides.length;
  const ir = (i: number) => setActivo((i + total) % total);

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Servicios del estudio"
      className="relative overflow-hidden"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activo * 100}%)` }}
      >
        {slides.map(({ data, form }, i) => (
          <div
            key={data.id}
            data-slide={data.id}
            className="w-full flex-shrink-0"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            // El slide oculto no debe ser tabulable ni audible: sin esto, el
            // teclado cae en un formulario invisible.
            {...(i === activo ? {} : { inert: "" })}
          >
            <HeroSlide slide={data} isFirst={i === 0}>
              {form}
            </HeroSlide>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => ir(activo - 1)}
        aria-label="Servicio anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => ir(activo + 1)}
        aria-label="Servicio siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 border border-border p-2 shadow-soft hover:bg-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map(({ data }, i) => (
          <button
            key={data.id}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ver ${data.eyebrow}`}
            aria-current={i === activo}
            className={`h-2 rounded-full transition-all ${
              i === activo ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
```

> `inert` como atributo: React 18 no lo tipa. Si `tsc` reclama, agregar en `src/vite-env.d.ts`:
> ```ts
> declare module "react" {
>   interface HTMLAttributes<T> { inert?: string }
> }
> ```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `npm test -- src/components/hero/HeroCarousel.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero/HeroSlide.tsx src/components/hero/HeroCarousel.tsx src/components/hero/HeroCarousel.test.tsx
git commit -m "feat: carrusel del hero con slide accesible e indexable"
```

---

### Task 6: Ensamblar el hero

**Files:**
- Modify: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `HeroCarousel` (Task 5), `LegalQuickForm` (Task 3), `BrokerageQuickForm` (Task 4), `HERO_SLIDES` (Task 3).
- Produces: `HeroSection` sin props, el mismo que importa `Index.tsx`.

- [ ] **Step 1: Reemplazar el contenido de `HeroSection.tsx`**

```tsx
import HeroCarousel from "./hero/HeroCarousel";
import LegalQuickForm from "./hero/LegalQuickForm";
import BrokerageQuickForm from "./hero/BrokerageQuickForm";
import { HERO_SLIDES } from "@/lib/heroSlides";

const FORMULARIOS: Record<string, React.ReactNode> = {
  legal: <LegalQuickForm />,
  corretaje: <BrokerageQuickForm />,
};

const HeroSection = () => (
  <HeroCarousel
    slides={HERO_SLIDES.map((data) => ({ data, form: FORMULARIOS[data.id] }))}
  />
);

export default HeroSection;
```

- [ ] **Step 2: Verificar build, tests y prerender**

Run: `npm test && npm run build`
Expected: todos los tests PASS, `[vite-react-ssg] Build finished`, 7 páginas.

Verificar que el prerender contiene ambos titulares y un solo `h1`:

```bash
grep -c "<h1" dist/index.html          # esperado: 1
grep -c "Vende o arrienda tu propiedad" dist/index.html   # esperado: >= 1
```

- [ ] **Step 3: Verificación visual**

Run: `npm run dev`
Comprobar: el hero abre en el slide legal; las flechas y los puntos cambian de slide; con `Tab` desde el formulario legal **no** se alcanza ningún campo del de corretaje.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: el hero pasa a ser un carrusel de dos lineas de negocio"
```

---

### Task 7: El correo distingue los leads de corretaje

**Files:**
- Modify: `arteagayaldunate-contact-backend/src/handlers/contact/app.ts`
- Test: `arteagayaldunate-contact-backend/src/handlers/contact/app.test.ts`

**Interfaces:**
- Consumes: el payload que envía `submitLead` con `servicio: "corretaje"`.
- Produces: `buildEmailContent` agrega la sección "Propiedad" y antepone `CORRETAJE` al asunto.

**Trabajar en el repo del backend**, no en la landing.

- [ ] **Step 1: Escribir el test que falla**

Agregar dentro del `describe('buildEmailContent', …)`:

```ts
test('marca el asunto y agrega la sección Propiedad para corretaje', () => {
  const r = buildEmailContent({
    servicio: 'corretaje',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    message: 'Quiero vender',
    operacion: 'vender',
    tipoPropiedad: 'departamento',
    comuna: 'Providencia',
    temaLegal: 'si',
  } as never);

  assert.match(r.subject, /^\[CORRETAJE · VENDER\]/);
  assert.match(r.text, /PROPIEDAD/);
  assert.match(r.text, /Operación: Vender mi propiedad/);
  assert.match(r.text, /Comuna: Providencia/);
  assert.match(r.text, /Tema legal pendiente: Sí/);
});

test('los leads legales conservan el asunto por área', () => {
  const r = buildEmailContent({
    name: 'Ana', email: 'a@e.com', message: 'Hola', area: 'penal',
  } as never);
  assert.match(r.subject, /^\[DERECHO PENAL\]/);
  assert.doesNotMatch(r.text, /PROPIEDAD/);
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — el asunto no incluye `CORRETAJE`.

- [ ] **Step 3: Implementar**

En `app.ts`, ampliar `ContactPayload`:

```ts
  servicio?: 'legal' | 'corretaje';
  operacion?: string;
  tipoPropiedad?: string;
  comuna?: string;
  temaLegal?: string;
```

Agregar los diccionarios junto a `AREA_LABELS`:

```ts
const OPERACION_LABELS: Record<string, string> = {
  vender: 'Vender mi propiedad',
  arrendar: 'Arrendar mi propiedad',
  comprar: 'Comprar una propiedad',
  busco_arriendo: 'Busco arriendo',
};

const TIPO_PROPIEDAD_LABELS: Record<string, string> = {
  casa: 'Casa', departamento: 'Departamento', oficina: 'Oficina',
  local: 'Local comercial', terreno: 'Terreno',
};

const TEMA_LEGAL_LABELS: Record<string, string> = {
  no_lo_se: 'No lo sé', no: 'No',
  si: 'Sí (herencia, arriendo impago, copropiedad, juicio)',
};
```

En `buildEmailContent`, reemplazar el cálculo del asunto:

```ts
  const esCorretaje = data.servicio === 'corretaje';
  const operacion = label(OPERACION_LABELS, data.operacion);

  const etiquetas = esCorretaje
    ? ['CORRETAJE', (data.operacion ?? 'consulta').toUpperCase()]
    : [
        data.urgencia === 'inmediata' ? 'URGENTE' : null,
        (area ?? 'SIN ÁREA').toUpperCase(),
      ].filter(Boolean);
  const subject = `[${etiquetas.join(' · ')}] Nueva consulta — ${data.name}`;
```

Y agregar la sección al arreglo `secciones`, entre "Clasificación" y "Consulta":

```ts
    {
      titulo: 'Propiedad',
      filas: [
        ['Operación', operacion],
        ['Tipo de propiedad', label(TIPO_PROPIEDAD_LABELS, data.tipoPropiedad)],
        ['Comuna', data.comuna],
        ['Tema legal pendiente', label(TEMA_LEGAL_LABELS, data.temaLegal)],
      ],
    },
```

El filtro `.filter((s) => s.filas.length > 0)` que ya existe hace que la sección desaparezca sola en los leads legales.

- [ ] **Step 4: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS, 19 tests.

- [ ] **Step 5: Commit**

```bash
git add src/handlers/contact/app.ts src/handlers/contact/app.test.ts
git commit -m "feat: el correo distingue los leads de corretaje"
```

---

### Task 8: Desplegar y verificar de punta a punta

**Files:** ninguno.

- [ ] **Step 1: Desplegar el backend**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend
PATH="$PWD/node_modules/.bin:$PATH" sam build
sam deploy --stack-name arteagayaldunate-contact-backend-prod --region us-east-1 \
  --capabilities CAPABILITY_IAM --resolve-s3 \
  --no-confirm-changeset --no-fail-on-empty-changeset
```

Expected: `Successfully created/updated stack`. Los parámetros conservan sus valores actuales.

- [ ] **Step 2: Probar el endpoint con un lead de corretaje**

```bash
KEY=$(aws apigateway get-api-keys --region us-east-1 --include-values --query "items[0].value" --output text)
curl -s -X POST https://jvmge6hwz9.execute-api.us-east-1.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" -H "x-api-key: $KEY" \
  -d '{"servicio":"corretaje","name":"Prueba Corretaje","email":"p@example.com","phone":"+56911111111","operacion":"vender","tipoPropiedad":"departamento","comuna":"Providencia","temaLegal":"si","message":"Quiero vender mi departamento."}'
```

Expected: `{"ok":true}`. El correo debe llegar con asunto `[CORRETAJE · VENDER]` y sección **Propiedad**.

- [ ] **Step 3: Desplegar la landing**

```bash
cd /Users/lfgg/paldunate/landing-tech
vercel --prod --yes --scope defensapenalprotegida-droids-projects
```

- [ ] **Step 4: Verificar en producción**

```bash
curl -s https://arteagayaldunate.cl/ | grep -c "<h1"                      # esperado: 1
curl -s https://arteagayaldunate.cl/ | grep -c "Vende o arrienda tu propiedad"  # esperado: >= 1
```

- [ ] **Step 5: Actualizar el ledger**

Anotar en `.superpowers/sdd/progress.md` las tareas completadas y cualquier hallazgo.

```bash
git add .superpowers/sdd/progress.md
git commit -m "docs: registra el carrusel de corretaje en el ledger"
```

---

## Verificación final (checklist de aceptación)

- [ ] El hero abre en el slide legal, sin movimiento automático.
- [ ] Las flechas y los puntos cambian de slide.
- [ ] El documento tiene exactamente un `<h1>`, el del slide legal.
- [ ] El texto de ambos slides aparece en `dist/index.html`.
- [ ] Con `Tab` no se alcanzan los campos del slide oculto.
- [ ] El formulario legal sigue enviando igual que antes.
- [ ] El de corretaje envía `servicio: "corretaje"` y sus campos de propiedad.
- [ ] El correo de corretaje llega con asunto `[CORRETAJE · …]` y sección Propiedad.
- [ ] El correo legal conserva su formato.
- [ ] `npm test` verde en ambos repos; `tsc` sin errores nuevos sobre los 7 preexistentes.
