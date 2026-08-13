# SEO + GEO — Páginas de producto y datos estructurados

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a cada producto jurídico una URL propia, indexable y citable por IA, respaldada por una capa de datos estructurados con una identidad de estudio única.

**Architecture:** Cada producto es la fuente única de su contenido: de una sola estructura salen la página, el JSON-LD, el sitemap y el `llms.txt`. Toda entidad de schema cuelga de un `@id` estable (`https://arteagayaldunate.cl/#estudio`) emitido una vez desde el `Layout`, para que las 11 páginas se lean como un solo negocio. Un producto solo genera ruta cuando su bloque `seo` está completo.

**Tech Stack:** Vite 5 + React 18 + TypeScript, `vite-react-ssg` (prerender estático), Tailwind + shadcn/ui, Vitest + Testing Library, `esbuild` (ya instalado) para que los scripts de build lean TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-12-seo-geo-productos-design.md`

## Global Constraints

- **Dominio canónico:** `https://arteagayaldunate.cl` — sin `www`. Nunca usar `defensapenalprotegida.cl`.
- **`@id` del estudio:** exactamente `https://arteagayaldunate.cl/#estudio` en todas las páginas.
- **Prohibido emitir `AggregateRating` o `Review`** en cualquier schema. Los testimonios del sitio son anonimizados y no son marcables.
- **Prohibido inventar afirmaciones jurídicas.** Todo texto legal nuevo se marca con `revisadoPorAbogado: false` y no genera ruta.
- **Todo JSON-LD se emite dentro de `<Head>` de `vite-react-ssg`**, nunca por `useEffect` ni `dangerouslySetInnerHTML` fuera de `<Head>`. Debe aparecer en el HTML de `dist/`.
- **No tocar** `vercel.json`, dominios, headers ni configuración de infraestructura.
- **No añadir dependencias nuevas.** `esbuild` ya está disponible vía Vite.
- **Idioma del contenido:** español de Chile. `inLanguage: "es-CL"`.
- **Comandos:** `npx vitest run <ruta>` para tests, `npm run build` para el build, `npx eslint <rutas>` para lint.
- Los tests preexistentes de `src/components/hero/ProductoForm.test.tsx` fallan desde antes de este plan. No es regresión y no hay que arreglarlos aquí.

---

### Task 1: Bloque `seo` en la definición de producto

Añade el contrato de contenido SEO y las funciones que deciden qué producto se publica. Sin esto no hay nada que renderizar.

**Files:**
- Modify: `src/lib/productosJuridicos.ts` (interfaz `ProductoJuridico`, línea ~53; funciones al final, línea ~444)
- Test: `src/lib/productosJuridicos.seo.test.ts`

**Interfaces:**
- Consumes: `Producto`, `ProductoJuridico`, `PRODUCTOS_JURIDICOS` de `src/lib/productosJuridicos.ts`
- Produces:
  - `interface ProductoSeo`
  - `ProductoJuridico.seo?: ProductoSeo`
  - `getProductosPublicados(): ProductoJuridico[]`
  - `getProductoBySlug(slug: string): ProductoJuridico | undefined`

- [ ] **Step 1: Write the failing test**

Crear `src/lib/productosJuridicos.seo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getAllProductos,
  getProductoBySlug,
  getProductosPublicados,
} from "./productosJuridicos";

describe("publicación por tandas", () => {
  it("solo publica productos con bloque seo completo", () => {
    // Un producto sin `seo` no puede generar ruta: una página sin contenido
    // revisado posiciona peor que no existir.
    for (const producto of getProductosPublicados()) {
      expect(producto.seo).toBeDefined();
      expect(producto.seo!.slug).toBeTruthy();
      expect(producto.seo!.resumen.length).toBeGreaterThan(80);
      expect(producto.seo!.faq.length).toBeGreaterThan(0);
    }
  });

  it("no publica productos marcados como no revisados", () => {
    const sinRevisar = getAllProductos().filter(
      (p) => p.seo && p.seo.revisadoPorAbogado === false
    );
    const slugsPublicados = getProductosPublicados().map((p) => p.seo!.slug);

    for (const producto of sinRevisar) {
      expect(slugsPublicados).not.toContain(producto.seo!.slug);
    }
  });

  it("los slugs publicados son únicos", () => {
    const slugs = getProductosPublicados().map((p) => p.seo!.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProductoBySlug", () => {
  it("encuentra un producto publicado por su slug", () => {
    const producto = getProductoBySlug("cobra-tu-pension");
    expect(producto?.id).toBe("cobra-pension");
  });

  it("devuelve undefined para un slug inexistente", () => {
    expect(getProductoBySlug("no-existe")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/productosJuridicos.seo.test.ts`
Expected: FAIL — `getProductosPublicados is not a function`.

- [ ] **Step 3: Add the `ProductoSeo` type**

En `src/lib/productosJuridicos.ts`, justo antes de `export interface ProductoJuridico`:

```ts
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
```

Y añadir el campo a `ProductoJuridico`, después de `icon: IconDefinition;`:

```ts
  seo?: ProductoSeo;
```

- [ ] **Step 4: Add the selector functions**

Al final de `src/lib/productosJuridicos.ts`, después de `getAllProductos()`:

```ts
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
```

- [ ] **Step 5: Add the pilot content for "Cobra tu Pensión"**

Este es el único producto que puede publicarse hoy sin escribir derecho nuevo: `FAQSection.tsx` ya tiene 10 preguntas revisadas sobre pensión de alimentos y existe el artículo `cobrar-pension-alimentos-impaga`.

Mover el array `faqs` de `src/components/FAQSection.tsx:9-91` al bloque `seo` del producto `cobra-pension` en `PRODUCTOS_JURIDICOS`, **copiando los textos literalmente, sin reescribirlos**. Añadir después de `whatsappMessage`:

```ts
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
        // Pegar aquí, literales, las 10 entradas del array `faqs` que hoy
        // viven en src/components/FAQSection.tsx:9-91. Son textos ya
        // revisados: copiarlos, no reescribirlos ni resumirlos.
      ],
      articuloRelacionado: "cobrar-pension-alimentos-impaga",
      revisadoPorAbogado: true,
    },
```

> **Nota para quien implemente:** los otros 6 productos NO reciben bloque `seo` en esta tarea. Quedan sin publicar hasta que un abogado revise su contenido. Eso es intencional y las pruebas lo verifican.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/lib/productosJuridicos.seo.test.ts src/lib/productosJuridicos.test.ts`
Expected: PASS, incluidos los tests preexistentes de productos.

- [ ] **Step 7: Commit**

```bash
git add src/lib/productosJuridicos.ts src/lib/productosJuridicos.seo.test.ts
git commit -m "Agregar bloque SEO por producto con puerta de publicación"
```

---

### Task 2: Identidad del estudio como fuente única

Los datos de contacto están hoy escritos a mano en `Footer.tsx` y `ContactSection.tsx`. El schema necesita exactamente los mismos valores, y dos copias divergen.

**Files:**
- Create: `src/lib/seo/estudio.ts`
- Test: `src/lib/seo/estudio.test.ts`

**Interfaces:**
- Produces: `ESTUDIO_ID`, `SITE`, `ESTUDIO` (objeto con NAP, horarios, áreas, redes)

- [ ] **Step 1: Write the failing test**

Crear `src/lib/seo/estudio.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ESTUDIO, ESTUDIO_ID, SITE } from "./estudio";

describe("identidad del estudio", () => {
  it("usa el dominio canónico sin www", () => {
    expect(SITE).toBe("https://arteagayaldunate.cl");
    expect(ESTUDIO_ID).toBe("https://arteagayaldunate.cl/#estudio");
  });

  it("tiene el NAP completo", () => {
    expect(ESTUDIO.nombre).toBeTruthy();
    expect(ESTUDIO.telefono).toMatch(/^\+56/);
    expect(ESTUDIO.direccion.calle).toBeTruthy();
    expect(ESTUDIO.direccion.ciudad).toBe("Santiago");
    expect(ESTUDIO.direccion.pais).toBe("CL");
  });

  it("no expone redes con href de relleno", () => {
    // El footer las tiene como "#". Un sameAs con "#" es peor que omitirlo:
    // le pide al buscador que confíe en un enlace roto.
    for (const url of ESTUDIO.redes) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("declara las áreas de práctica", () => {
    expect(ESTUDIO.areas).toContain("Derecho Penal");
    expect(ESTUDIO.areas.length).toBe(7);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/estudio.test.ts`
Expected: FAIL — no se puede resolver `./estudio`.

- [ ] **Step 3: Write the implementation**

Crear `src/lib/seo/estudio.ts`:

```ts
/**
 * Identidad del estudio: la fuente única del NAP.
 *
 * Estos valores tienen que coincidir carácter por carácter con la ficha de
 * Google Business Profile. Si el sitio y la ficha difieren, la señal se
 * debilita en vez de reforzarse: el buscador ve dos negocios parecidos en vez
 * de uno confirmado por dos fuentes.
 */
export const SITE = "https://arteagayaldunate.cl";

/**
 * Identificador estable de la entidad.
 *
 * Todas las páginas lo referencian. Es lo que hace que once páginas se lean
 * como un estudio y no como once negocios que comparten teléfono.
 */
export const ESTUDIO_ID = `${SITE}/#estudio`;

export const ESTUDIO = {
  nombre: "Arteaga & Aldunate Abogados y Asociados",
  nombreCorto: "Arteaga & Aldunate",
  descripcion:
    "Estudio jurídico en Santiago de Chile. Asesoría y representación en derecho penal, civil, laboral, de familia, corporativo, inmobiliario y tributario.",
  telefono: "+56995336140",
  email: "abogados@arteagayaldunate.cl",
  direccion: {
    calle: "Bombero Salas 1369, oficina 701",
    ciudad: "Santiago",
    region: "Región Metropolitana",
    pais: "CL",
  },
  /**
   * PENDIENTE DE CONFIRMACIÓN: el footer dice "Lun-Vie 9:00-18:00" y
   * "Emergencias 24/7". Las urgencias penales no se modelan como horario de
   * atención porque no son atención presencial en oficina.
   */
  horario: {
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    abre: "09:00",
    cierra: "18:00",
  },
  /**
   * PENDIENTE DE CONFIRMACIÓN: mientras no se confirme el alcance real de
   * litigación, se declara la Región Metropolitana. Declarar Chile entero sin
   * respaldo diluye la señal local, que es justo lo que se quiere reforzar.
   */
  areaServida: "Región Metropolitana, Chile",
  areas: [
    "Derecho Penal",
    "Derecho Civil",
    "Derecho Laboral",
    "Derecho de Familia",
    "Derecho Corporativo",
    "Derecho Inmobiliario",
    "Derecho Tributario",
  ],
  /**
   * PENDIENTE: URLs reales de Instagram, LinkedIn y Facebook. El footer las
   * tiene como "#", y un sameAs con relleno es peor que no tener sameAs.
   * Al completarlas, actualizar también SOCIALS en Footer.tsx.
   */
  redes: [] as string[],
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/seo/estudio.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/estudio.ts src/lib/seo/estudio.test.ts
git commit -m "Centralizar la identidad del estudio para datos estructurados"
```

---

### Task 3: Schemas de organización y servicio

**Files:**
- Create: `src/lib/seo/schema/organizacion.ts`
- Create: `src/lib/seo/schema/servicio.ts`
- Test: `src/lib/seo/schema/schema.test.ts`

**Interfaces:**
- Consumes: `ESTUDIO`, `ESTUDIO_ID`, `SITE` (Task 2); `ProductoJuridico`, `getProductosPublicados` (Task 1)
- Produces: `legalServiceSchema(): object`, `servicioSchema(producto: ProductoJuridico): object`

- [ ] **Step 1: Write the failing test**

Crear `src/lib/seo/schema/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { legalServiceSchema } from "./organizacion";
import { servicioSchema } from "./servicio";
import { ESTUDIO_ID } from "../estudio";
import { getProductosPublicados } from "@/lib/productosJuridicos";

const schemaAJson = (schema: object) => JSON.parse(JSON.stringify(schema));

describe("legalServiceSchema", () => {
  it("es JSON serializable y del tipo correcto", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema["@type"]).toBe("LegalService");
    expect(schema["@id"]).toBe(ESTUDIO_ID);
  });

  it("incluye el NAP que necesita el paquete local", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema.telephone).toBeTruthy();
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressLocality).toBe("Santiago");
  });

  it("declara las áreas y los productos", () => {
    const schema = schemaAJson(legalServiceSchema());
    expect(schema.knowsAbout).toHaveLength(7);
    expect(schema.hasOfferCatalog["@type"]).toBe("OfferCatalog");
  });

  it("nunca emite calificaciones", () => {
    const texto = JSON.stringify(legalServiceSchema());
    expect(texto).not.toContain("AggregateRating");
    expect(texto).not.toContain("Review");
  });

  it("omite sameAs mientras no haya redes reales", () => {
    const schema = schemaAJson(legalServiceSchema());
    if ("sameAs" in schema) {
      expect(schema.sameAs.length).toBeGreaterThan(0);
    }
  });
});

describe("servicioSchema", () => {
  it("cuelga del @id del estudio", () => {
    const producto = getProductosPublicados()[0];
    const schema = schemaAJson(servicioSchema(producto));

    expect(schema["@type"]).toBe("Service");
    expect(schema.provider["@id"]).toBe(ESTUDIO_ID);
  });

  it("usa el resumen del producto como descripción", () => {
    const producto = getProductosPublicados()[0];
    const schema = schemaAJson(servicioSchema(producto));
    expect(schema.description).toBe(producto.seo!.resumen);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/schema/schema.test.ts`
Expected: FAIL — no se resuelve `./organizacion`.

- [ ] **Step 3: Write `organizacion.ts`**

```ts
import { ESTUDIO, ESTUDIO_ID, SITE } from "../estudio";
import { getProductosPublicados } from "@/lib/productosJuridicos";

/**
 * La entidad raíz del sitio.
 *
 * Se emite una sola vez, desde el Layout. Todo lo demás la referencia por
 * `@id` en vez de repetirla: si cada página declarara su propia organización,
 * un cambio de teléfono dejaría once versiones distintas circulando.
 */
export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": ESTUDIO_ID,
    name: ESTUDIO.nombre,
    alternateName: ESTUDIO.nombreCorto,
    description: ESTUDIO.descripcion,
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/logo.png`,
    telephone: ESTUDIO.telefono,
    email: ESTUDIO.email,
    inLanguage: "es-CL",
    address: {
      "@type": "PostalAddress",
      streetAddress: ESTUDIO.direccion.calle,
      addressLocality: ESTUDIO.direccion.ciudad,
      addressRegion: ESTUDIO.direccion.region,
      addressCountry: ESTUDIO.direccion.pais,
    },
    areaServed: ESTUDIO.areaServida,
    knowsAbout: [...ESTUDIO.areas],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...ESTUDIO.horario.dias],
        opens: ESTUDIO.horario.abre,
        closes: ESTUDIO.horario.cierra,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios jurídicos",
      itemListElement: getProductosPublicados().map((producto) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: producto.seo!.h1,
          url: `${SITE}/servicios/${producto.seo!.slug}`,
        },
      })),
    },
    // sameAs solo si hay perfiles reales: un enlace de relleno le pide al
    // buscador que confíe en algo roto.
    ...(ESTUDIO.redes.length > 0 ? { sameAs: [...ESTUDIO.redes] } : {}),
  };
}
```

- [ ] **Step 4: Write `servicio.ts`**

```ts
import { ESTUDIO_ID, SITE } from "../estudio";
import type { ProductoJuridico } from "@/lib/productosJuridicos";

/** Un servicio concreto, siempre atribuido a la entidad del estudio. */
export function servicioSchema(producto: ProductoJuridico) {
  const seo = producto.seo!;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/servicios/${seo.slug}#servicio`,
    name: seo.h1,
    description: seo.resumen,
    url: `${SITE}/servicios/${seo.slug}`,
    serviceType: seo.h1,
    inLanguage: "es-CL",
    provider: { "@id": ESTUDIO_ID },
    areaServed: "Chile",
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/seo/schema/schema.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/schema/ && git commit -m "Agregar schema de estudio y de servicio con @id compartido"
```

---

### Task 4: Schemas de FAQ y breadcrumb, y el componente que los emite

**Files:**
- Create: `src/lib/seo/schema/faq.ts`
- Create: `src/lib/seo/schema/breadcrumb.ts`
- Create: `src/components/seo/JsonLd.tsx`
- Test: `src/lib/seo/schema/faq.test.ts`

**Interfaces:**
- Consumes: `SITE` (Task 2)
- Produces:
  - `faqSchema(faq: { q: string; a: string }[]): object`
  - `breadcrumbSchema(items: { nombre: string; path: string }[]): object`
  - `<JsonLd schema={object} />`

- [ ] **Step 1: Write the failing test**

Crear `src/lib/seo/schema/faq.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { faqSchema } from "./faq";
import { breadcrumbSchema } from "./breadcrumb";

describe("faqSchema", () => {
  it("convierte pares q/a en Question y Answer", () => {
    const schema = faqSchema([{ q: "¿Cuánto demora?", a: "Entre 3 y 6 meses." }]);

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity[0]["@type"]).toBe("Question");
    expect(schema.mainEntity[0].name).toBe("¿Cuánto demora?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Entre 3 y 6 meses.");
  });

  it("devuelve null sin preguntas, para no emitir un FAQPage vacío", () => {
    expect(faqSchema([])).toBeNull();
  });
});

describe("breadcrumbSchema", () => {
  it("numera las posiciones desde 1 y usa URLs absolutas", () => {
    const schema = breadcrumbSchema([
      { nombre: "Inicio", path: "/" },
      { nombre: "Servicios", path: "/servicios" },
    ]);

    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toBe(
      "https://arteagayaldunate.cl/servicios"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/schema/faq.test.ts`
Expected: FAIL — no se resuelve `./faq`.

- [ ] **Step 3: Write `faq.ts`**

```ts
/**
 * FAQPage a partir de las preguntas del producto.
 *
 * Devuelve `null` cuando no hay preguntas en vez de un objeto vacío: un
 * FAQPage sin entidades es marcado inválido y Google lo reporta como error.
 */
export function faqSchema(faq: { q: string; a: string }[]) {
  if (faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faq.map((entrada) => ({
      "@type": "Question" as const,
      name: entrada.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: entrada.a,
      },
    })),
  };
}
```

- [ ] **Step 4: Write `breadcrumb.ts`**

```ts
import { SITE } from "../estudio";

export function breadcrumbSchema(items: { nombre: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem" as const,
      position: indice + 1,
      name: item.nombre,
      item: `${SITE}${item.path}`,
    })),
  };
}
```

- [ ] **Step 5: Write `JsonLd.tsx`**

Crear `src/components/seo/JsonLd.tsx`:

```tsx
import { Head } from "vite-react-ssg";

/**
 * Emite datos estructurados dentro de <Head>.
 *
 * Va en Head y no en el cuerpo para que quede en el HTML prerenderizado: un
 * crawler que no ejecuta JavaScript —y varios rastreadores de IA no lo
 * ejecutan— no vería nada si esto se inyectara después.
 *
 * Acepta `null` para que quien llama pueda pasar un schema condicional sin
 * envolverlo en un ternario en cada página.
 */
const JsonLd = ({ schema }: { schema: object | null }) => {
  if (!schema) return null;

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
};

export default JsonLd;
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/lib/seo/schema/`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/seo/schema/faq.ts src/lib/seo/schema/breadcrumb.ts src/lib/seo/schema/faq.test.ts src/components/seo/JsonLd.tsx
git commit -m "Agregar schema de FAQ y breadcrumb con emisor común"
```

---

### Task 5: Montar la entidad del estudio en el Layout

**Files:**
- Modify: `src/components/Layout.tsx`
- Test: `src/components/Layout.test.tsx`

**Interfaces:**
- Consumes: `legalServiceSchema` (Task 3), `JsonLd` (Task 4)

- [ ] **Step 1: Write the failing test**

Crear `src/components/Layout.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { legalServiceSchema } from "@/lib/seo/schema/organizacion";

describe("entidad del estudio", () => {
  it("el schema del estudio es válido y único", () => {
    // El Layout usa el Head de vite-react-ssg, que en pruebas no escribe al
    // documento. Lo que sí se puede verificar aquí es que el schema que el
    // Layout emite esté bien formado; que llegue al HTML se comprueba en la
    // Task 11, contra dist/.
    const schema = legalServiceSchema();
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
    expect(schema["@id"]).toBe("https://arteagayaldunate.cl/#estudio");
  });

  it("el Layout monta sin romper", async () => {
    const { default: Layout } = await import("./Layout");
    expect(() =>
      render(
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Layout.test.tsx`
Expected: FAIL — `legalServiceSchema` no está montado aún, o el import falla.

- [ ] **Step 3: Modify `Layout.tsx`**

Añadir imports:

```tsx
import JsonLd from "@/components/seo/JsonLd";
import { legalServiceSchema } from "@/lib/seo/schema/organizacion";
```

Y dentro del `return`, como primer hijo de `<TooltipProvider>`, antes de `<Toaster />`:

```tsx
          {/* La identidad del estudio se emite una vez para todo el sitio.
              El resto de los schemas la referencian por @id. */}
          <JsonLd schema={legalServiceSchema()} />
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/Layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Layout.tsx src/components/Layout.test.tsx
git commit -m "Emitir la entidad LegalService en todo el sitio"
```

---

### Task 6: Ampliar `Seo.tsx`

Hoy las 16 páginas comparten la misma imagen social y no hay control de indexación.

**Files:**
- Modify: `src/components/Seo.tsx`
- Test: `src/components/Seo.test.tsx`

**Interfaces:**
- Produces: `Seo` con props nuevas `image?: string`, `noIndex?: boolean`, `publishedTime?: string`, `modifiedTime?: string`

- [ ] **Step 1: Write the failing test**

Crear `src/components/Seo.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import Seo from "./Seo";

describe("Seo", () => {
  it("acepta las props de imagen e indexación", () => {
    // El Head de vite-react-ssg no escribe al documento en pruebas, así que
    // esto verifica el contrato de props, no el HTML resultante. La
    // verificación real es contra dist/ en la Task 11.
    const elemento = (
      <Seo
        title="Prueba"
        description="Descripción"
        path="/prueba"
        image="/otra.png"
        noIndex
      />
    );
    expect(elemento.props.image).toBe("/otra.png");
    expect(elemento.props.noIndex).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Seo.test.tsx`
Expected: FAIL — TypeScript rechaza `image` y `noIndex`, que no existen en `SeoProps`.

- [ ] **Step 3: Write the implementation**

Reemplazar la interfaz y el cuerpo de `src/components/Seo.tsx`:

```tsx
interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  /** Ruta absoluta desde la raíz del sitio. Por defecto, el logo. */
  image?: string;
  /** Excluye la página de los índices. Se usa en páginas sin valor de búsqueda. */
  noIndex?: boolean;
  /** Solo para type="article". ISO 8601. */
  publishedTime?: string;
  modifiedTime?: string;
}

const Seo = ({
  title,
  description,
  path = "/",
  type = "website",
  image = "/logo.png",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoProps) => {
  const url = SITE + path;
  const full = `${title} | Arteaga & Aldunate Abogados`;
  const imagenAbsoluta = image.startsWith("http") ? image : SITE + image;

  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, follow"
            : // max-image-preview:large es lo que permite que la miniatura
              // salga grande en resultados y en vistas generadas por IA.
              "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagenAbsoluta} />
      <meta property="og:site_name" content="Arteaga & Aldunate Abogados" />
      <meta property="og:locale" content="es_CL" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imagenAbsoluta} />
    </Head>
  );
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/Seo.test.tsx && npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -c "Seo.tsx" || true`
Expected: PASS y cero errores de tipos en `Seo.tsx`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Seo.tsx src/components/Seo.test.tsx
git commit -m "Agregar imagen por página y control de indexación al SEO"
```

---

### Task 7: Página de servicio

**Files:**
- Create: `src/pages/Servicio.tsx`
- Modify: `src/App.tsx`
- Test: `src/pages/Servicio.test.tsx`

**Interfaces:**
- Consumes: `getProductoBySlug`, `getProductosPublicados` (Task 1); `servicioSchema` (Task 3); `faqSchema`, `breadcrumbSchema`, `JsonLd` (Task 4); `Seo` (Task 6); `ProductoForm` (`src/components/hero/ProductoForm.tsx`, prop `productoId: Producto`)

- [ ] **Step 1: Write the failing test**

Crear `src/pages/Servicio.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Servicio from "./Servicio";
import { getProductosPublicados } from "@/lib/productosJuridicos";

const montar = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/servicios/${slug}`]}>
      <Routes>
        <Route path="/servicios/:slug" element={<Servicio />} />
      </Routes>
    </MemoryRouter>
  );

describe("página de servicio", () => {
  it("muestra el H1 y el resumen del producto", () => {
    const producto = getProductosPublicados()[0];
    montar(producto.seo!.slug);

    expect(
      screen.getByRole("heading", { level: 1, name: producto.seo!.h1 })
    ).toBeInTheDocument();
    expect(screen.getByText(producto.seo!.resumen)).toBeInTheDocument();
  });

  it("muestra las preguntas frecuentes", () => {
    const producto = getProductosPublicados()[0];
    montar(producto.seo!.slug);

    expect(screen.getByText(producto.seo!.faq[0].q)).toBeInTheDocument();
  });

  it("muestra el 404 para un producto no publicado", () => {
    montar("slug-inexistente");
    expect(screen.getByText(/no encontrada/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/Servicio.test.tsx`
Expected: FAIL — no se resuelve `./Servicio`.

- [ ] **Step 3: Write `Servicio.tsx`**

```tsx
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import JsonLd from "@/components/seo/JsonLd";
import ProductoForm from "@/components/hero/ProductoForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProductoBySlug } from "@/lib/productosJuridicos";
import { servicioSchema } from "@/lib/seo/schema/servicio";
import { faqSchema } from "@/lib/seo/schema/faq";
import { breadcrumbSchema } from "@/lib/seo/schema/breadcrumb";

/**
 * Página pública de un producto jurídico.
 *
 * El orden del contenido no es estético: el resumen va inmediatamente después
 * del H1 porque es el párrafo que un buscador o un modelo va a extraer como
 * respuesta. Enterrarlo bajo el formulario lo vuelve invisible para ese uso.
 */
const Servicio = () => {
  const { slug } = useParams<{ slug: string }>();
  const producto = slug ? getProductoBySlug(slug) : undefined;

  if (!producto) {
    return (
      <div className="min-h-screen">
        <Seo
          title="Página no encontrada"
          description="La página que buscas no existe."
          path="/servicios"
          noIndex
        />
        <Header />
        <main className="max-w-3xl mx-auto container-padding pt-32 pb-20">
          <h1 className="font-heading text-3xl font-bold">
            Página no encontrada
          </h1>
        </main>
        <Footer />
      </div>
    );
  }

  const seo = producto.seo!;
  const ruta = `/servicios/${seo.slug}`;

  return (
    <div className="min-h-screen">
      <Seo
        title={seo.metaTitle}
        description={seo.metaDescription}
        path={ruta}
      />
      <JsonLd schema={servicioSchema(producto)} />
      <JsonLd schema={faqSchema(seo.faq)} />
      <JsonLd
        schema={breadcrumbSchema([
          { nombre: "Inicio", path: "/" },
          { nombre: seo.h1, path: ruta },
        ])}
      />

      <Header />

      <main className="max-w-3xl mx-auto container-padding pt-32 pb-20">
        <nav aria-label="Migas de pan" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-body text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-legal-primary">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{seo.h1}</li>
          </ol>
        </nav>

        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {seo.h1}
        </h1>

        <p className="mt-5 font-body text-lg leading-relaxed text-muted-foreground">
          {seo.resumen}
        </p>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Cómo lo hacemos
        </h2>
        <ol className="mt-5 space-y-4">
          {seo.pasos.map((paso, indice) => (
            <li
              key={paso.titulo}
              className="rounded-lg border border-border bg-card/60 p-5"
            >
              <h3 className="font-body font-bold text-foreground">
                {indice + 1}. {paso.titulo}
              </h3>
              <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                {paso.detalle}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Qué necesitas
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 font-body text-muted-foreground">
          {seo.requisitos.map((requisito) => (
            <li key={requisito}>{requisito}</li>
          ))}
        </ul>

        <div className="mt-12">
          <ProductoForm productoId={producto.id} />
        </div>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="mt-5 space-y-3">
          {seo.faq.map((entrada, indice) => (
            <AccordionItem
              key={entrada.q}
              value={`faq-${indice}`}
              className="overflow-hidden rounded-xl border border-border bg-background px-6"
            >
              <AccordionTrigger className="py-5 text-left font-body font-medium text-foreground hover:text-legal-primary hover:no-underline">
                {entrada.q}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line pb-5 font-body leading-relaxed text-muted-foreground">
                {entrada.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {seo.articuloRelacionado && (
          <p className="mt-12 font-body">
            <Link
              to={`/blog/${seo.articuloRelacionado}`}
              className="text-legal-primary underline underline-offset-4"
            >
              Lee el artículo completo sobre este tema
            </Link>
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Servicio;
```

- [ ] **Step 4: Add the route**

En `src/App.tsx`, añadir el import junto a los demás:

```tsx
import Servicio from "./pages/Servicio";
import { getProductosPublicados } from "@/lib/productosJuridicos";
```

Y la ruta, **antes** del comodín `*`:

```tsx
      {
        path: "servicios/:slug",
        element: <Servicio />,
        entry: "src/pages/Servicio.tsx",
        getStaticPaths: () =>
          getProductosPublicados().map((p) => `/servicios/${p.seo!.slug}`),
      },
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/pages/Servicio.test.tsx`
Expected: PASS, los 3 casos.

- [ ] **Step 6: Verify the page is prerendered**

Run: `npm run build && ls dist/servicios/`
Expected: existe `dist/servicios/cobra-tu-pension.html`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Servicio.tsx src/pages/Servicio.test.tsx src/App.tsx
git commit -m "Agregar página pública por producto jurídico"
```

---

### Task 8: Política de rastreo para motores de IA

**Files:**
- Modify: `public/robots.txt`
- Test: `src/lib/seo/robots.test.ts`

- [ ] **Step 1: Write the failing test**

Crear `src/lib/seo/robots.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const robots = () => readFileSync("public/robots.txt", "utf8");

describe("robots.txt", () => {
  it("declara explícitamente los rastreadores de IA", () => {
    // `User-agent: *` ya los cubriría, pero declararlos quita toda ambigüedad.
    // Google-Extended es en concreto el que gobierna la inclusión en AI
    // Overviews, y su ausencia es la que suele dejar un sitio fuera.
    for (const bot of [
      "Google-Extended",
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "ClaudeBot",
      "PerplexityBot",
    ]) {
      expect(robots()).toContain(`User-agent: ${bot}`);
    }
  });

  it("apunta al sitemap en el dominio canónico", () => {
    expect(robots()).toContain(
      "Sitemap: https://arteagayaldunate.cl/sitemap.xml"
    );
    expect(robots()).not.toContain("www.arteagayaldunate.cl");
  });

  it("no bloquea a nadie", () => {
    expect(robots()).not.toMatch(/^Disallow: \/$/m);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/robots.test.ts`
Expected: FAIL — falta `User-agent: Google-Extended`.

- [ ] **Step 3: Rewrite `public/robots.txt`**

```
# Buscadores tradicionales
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Rastreadores de IA.
# `User-agent: *` ya los cubriria, pero se declaran uno a uno para que la
# autorizacion sea explicita y no dependa del comportamiento por defecto de
# cada motor. Google-Extended es el que gobierna la inclusion en AI Overviews.
User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Previsualizaciones al compartir enlaces
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: https://arteagayaldunate.cl/sitemap.xml
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/seo/robots.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt src/lib/seo/robots.test.ts
git commit -m "Autorizar explícitamente a los rastreadores de IA"
```

---

### Task 9: Sitemap y `llms.txt` desde la misma fuente

Los scripts de build corren en Node y los productos están en TypeScript. Se transpilan con `esbuild`, que ya viene con Vite: no hay dependencia nueva.

**Files:**
- Create: `scripts/lib/cargar-productos.mjs`
- Create: `scripts/generate-llms.mjs`
- Modify: `scripts/generate-sitemap.mjs`
- Modify: `package.json` (script `build`)
- Test: `src/lib/seo/generadores.test.ts`

**Interfaces:**
- Produces: `cargarProductosPublicados(): Promise<Array<{slug, h1, metaDescription, resumen}>>`

- [ ] **Step 1: Write the failing test**

Crear `src/lib/seo/generadores.test.ts`:

```ts
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { getProductosPublicados } from "@/lib/productosJuridicos";

beforeAll(() => {
  execFileSync("node", ["scripts/generate-sitemap.mjs"], { stdio: "pipe" });
  execFileSync("node", ["scripts/generate-llms.mjs"], { stdio: "pipe" });
});

describe("sitemap", () => {
  it("incluye cada producto publicado", () => {
    const xml = readFileSync("public/sitemap.xml", "utf8");
    for (const producto of getProductosPublicados()) {
      expect(xml).toContain(
        `https://arteagayaldunate.cl/servicios/${producto.seo!.slug}`
      );
    }
  });
});

describe("llms.txt", () => {
  it("describe el estudio y enlaza los servicios", () => {
    const texto = readFileSync("public/llms.txt", "utf8");

    expect(texto).toContain("# Arteaga & Aldunate");
    for (const producto of getProductosPublicados()) {
      expect(texto).toContain(`/servicios/${producto.seo!.slug}`);
    }
  });

  it("incluye el resumen de cada servicio, que es lo citable", () => {
    const texto = readFileSync("public/llms.txt", "utf8");
    const producto = getProductosPublicados()[0];
    expect(texto).toContain(producto.seo!.resumen);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/generadores.test.ts`
Expected: FAIL — `scripts/generate-llms.mjs` no existe.

- [ ] **Step 3: Write the TypeScript loader**

Crear `scripts/lib/cargar-productos.mjs`:

```js
// Los productos viven en TypeScript y estos scripts corren en Node, que no lo
// entiende. Se transpila con esbuild (ya instalado como dependencia de Vite)
// en vez de duplicar los datos en un manifiesto JSON: dos copias se
// desincronizan, y todo el diseño se apoya en que haya una sola fuente.
import { build } from "esbuild";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function cargarProductosPublicados() {
  const temporal = mkdtempSync(join(tmpdir(), "aya-productos-"));
  const salida = join(temporal, "productos.mjs");

  try {
    await build({
      entryPoints: ["src/lib/productosJuridicos.ts"],
      outfile: salida,
      bundle: true,
      format: "esm",
      platform: "node",
      logLevel: "silent",
      // Las imágenes y los iconos no aportan nada a sitemap ni a llms.txt, y
      // sin esto esbuild intentaría resolver los binarios y fallaría.
      external: ["*.jpg", "*.png", "*.svg", "@fortawesome/*"],
      loader: { ".jpg": "text", ".png": "text", ".svg": "text" },
    });

    const modulo = await import(pathToFileURL(salida).href);
    return modulo.getProductosPublicados().map((producto) => ({
      slug: producto.seo.slug,
      h1: producto.seo.h1,
      metaDescription: producto.seo.metaDescription,
      resumen: producto.seo.resumen,
    }));
  } finally {
    rmSync(temporal, { recursive: true, force: true });
  }
}
```

> Si `esbuild` falla al resolver los iconos de FontAwesome, ajustar `external` hasta que el módulo cargue. El objetivo es leer los slugs, no producir un bundle usable.

- [ ] **Step 4: Add products to the sitemap**

En `scripts/generate-sitemap.mjs`, añadir arriba:

```js
import { cargarProductosPublicados } from "./lib/cargar-productos.mjs";

const productos = await cargarProductosPublicados();
```

Y en la plantilla `xml`, después de la línea del blog y antes de `/privacidad`:

```js
${productos.map((p) => url(`${SITE}/servicios/${p.slug}`, undefined, "0.9")).join("\n")}
```

Prioridad `0.9`: por debajo de la home, por encima de los artículos. Son las páginas de conversión.

- [ ] **Step 5: Write `generate-llms.mjs`**

```js
// Genera public/llms.txt: un resumen del sitio en texto plano, pensado para
// que un modelo lo lea entero sin tener que rastrear el HTML.
// Deriva de la misma fuente que el sitemap y las páginas.
import { writeFileSync } from "node:fs";
import { cargarProductosPublicados } from "./lib/cargar-productos.mjs";

const SITE = "https://arteagayaldunate.cl";
const productos = await cargarProductosPublicados();

const servicios = productos
  .map((p) => `- [${p.h1}](${SITE}/servicios/${p.slug}): ${p.resumen}`)
  .join("\n\n");

const texto = `# Arteaga & Aldunate Abogados y Asociados

> Estudio jurídico en Santiago de Chile. Asesoría y representación en derecho
> penal, civil, laboral, de familia, corporativo, inmobiliario y tributario.

Dirección: Bombero Salas 1369, oficina 701, Santiago, Chile
Teléfono: +56 9 9533 6140
Correo: abogados@arteagayaldunate.cl
Horario: lunes a viernes, 09:00 a 18:00

## Servicios

${servicios}

## Recursos

- [Blog jurídico](${SITE}/blog): artículos sobre derecho chileno vigente.
- [Política de privacidad](${SITE}/privacidad)
- [Política de cookies](${SITE}/cookies)

## Aviso

El contenido del sitio es informativo y no constituye asesoría jurídica para un
caso concreto.
`;

writeFileSync("public/llms.txt", texto);
console.log(`llms.txt generado: ${productos.length} servicios publicados`);
```

- [ ] **Step 6: Wire into the build**

En `package.json`, cambiar el script `build`:

```json
"build": "node scripts/generate-sitemap.mjs && node scripts/generate-llms.mjs && vite-react-ssg build",
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/lib/seo/generadores.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add scripts/ package.json public/sitemap.xml public/llms.txt src/lib/seo/generadores.test.ts
git commit -m "Generar sitemap y llms.txt desde la definición de productos"
```

---

### Task 10: Corregir la home y enlazar los servicios

La `<meta description>` dice "estudio penal especializado" mientras el estudio cubre 7 áreas — por eso el AI Overview saca el detalle de Instagram. Y el FAQ de pensión ya vive en su página de producto, así que sale de aquí.

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/components/FAQSection.tsx` (o eliminar)
- Test: `src/pages/Index.seo.test.tsx`

- [ ] **Step 1: Write the failing test**

Crear `src/pages/Index.seo.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("descripción de la home", () => {
  it("describe el estudio como integral, no solo penal", () => {
    // Google ya describe al estudio como integral, sacando el dato de
    // Instagram. La fuente canónica tiene que ser el sitio.
    const fuente = readFileSync("src/pages/Index.tsx", "utf8");
    const descripcion = fuente.match(/description="([^"]+)"/)?.[1] ?? "";

    expect(descripcion).toMatch(/laboral/i);
    expect(descripcion).toMatch(/familia/i);
  });

  it("enlaza los servicios publicados desde la home", () => {
    const fuente = readFileSync("src/pages/Index.tsx", "utf8");
    expect(fuente).toContain("ServiciosDestacados");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/Index.seo.test.tsx`
Expected: FAIL — la descripción no menciona las áreas.

- [ ] **Step 3: Update the home metadata**

En `src/pages/Index.tsx`, reemplazar la `description` del `<Seo>` por:

```
Estudio jurídico en Santiago con atención en derecho penal, civil, laboral, de familia, corporativo, inmobiliario y tributario. Evaluamos tu caso sin costo.
```

- [ ] **Step 4: Create the services section**

Crear `src/components/ServiciosDestacados.tsx`:

```tsx
import { Link } from "react-router-dom";
import { getProductosPublicados } from "@/lib/productosJuridicos";

/**
 * Enlaces a las páginas de servicio publicadas.
 *
 * No se renderiza si no hay ninguna: durante la publicación por tandas la
 * lista puede estar vacía, y una sección con título y nada debajo es peor que
 * ninguna sección.
 */
const ServiciosDestacados = () => {
  const productos = getProductosPublicados();
  if (productos.length === 0) return null;

  return (
    <section id="servicios" className="section-padding">
      <div className="max-w-5xl mx-auto container-padding">
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Servicios con procedimiento definido
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {productos.map((producto) => (
            <li key={producto.id}>
              <Link
                to={`/servicios/${producto.seo!.slug}`}
                className="block h-full rounded-xl border border-border bg-card/60 p-6 transition-colors hover:border-legal-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <h3 className="font-body text-lg font-bold text-foreground">
                  {producto.seo!.h1}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                  {producto.seo!.metaDescription}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ServiciosDestacados;
```

Montarlo en `src/pages/Index.tsx` entre `<PracticeAreas />` y `<AboutSection />`:

```tsx
        <ServiciosDestacados />
```

- [ ] **Step 5: Remove the orphaned FAQ component**

`src/components/FAQSection.tsx` no está montado en ninguna página y su contenido se movió al producto en la Task 1. Borrarlo:

```bash
git rm src/components/FAQSection.tsx
```

Verificar antes que nadie lo importe:

```bash
grep -rn "FAQSection" src/ || echo "sin referencias"
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/pages/Index.seo.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Index.tsx src/components/ServiciosDestacados.tsx src/pages/Index.seo.test.tsx
git commit -m "Alinear la descripción de la home y enlazar los servicios"
```

---

### Task 11: Verificación contra el HTML prerenderizado

La prueba que de verdad importa. Todo lo anterior se verificó con jsdom, donde el `Head` de `vite-react-ssg` no escribe al documento. Esta tarea comprueba que el marcado llega al HTML estático, que es lo único que ve un rastreador que no ejecuta JavaScript.

**Files:**
- Create: `src/lib/seo/prerender.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Estas pruebas leen dist/ y exigen un build previo.
 *
 * Se saltan si dist/ no existe, para no romper el ciclo rápido de pruebas de
 * quien está desarrollando. En CI hay que correr `npm run build` antes.
 */
const hayBuild = existsSync("dist/index.html");
const suite = hayBuild ? describe : describe.skip;

const html = (ruta: string) => readFileSync(`dist/${ruta}`, "utf8");

const jsonLdDe = (contenido: string) =>
  [...contenido.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs
  )].map((m) => JSON.parse(m[1]));

suite("datos estructurados en el HTML estático", () => {
  it("la home emite el LegalService con el @id canónico", () => {
    const schemas = jsonLdDe(html("index.html"));
    const estudio = schemas.find((s) => s["@type"] === "LegalService");

    expect(estudio).toBeDefined();
    expect(estudio["@id"]).toBe("https://arteagayaldunate.cl/#estudio");
    expect(estudio.address.addressLocality).toBe("Santiago");
  });

  it("la página de servicio emite Service, FAQPage y BreadcrumbList", () => {
    const schemas = jsonLdDe(html("servicios/cobra-tu-pension.html"));
    const tipos = schemas.map((s) => s["@type"]);

    expect(tipos).toContain("Service");
    expect(tipos).toContain("FAQPage");
    expect(tipos).toContain("BreadcrumbList");
  });

  it("el servicio se atribuye a la misma entidad del estudio", () => {
    const schemas = jsonLdDe(html("servicios/cobra-tu-pension.html"));
    const servicio = schemas.find((s) => s["@type"] === "Service");

    expect(servicio.provider["@id"]).toBe(
      "https://arteagayaldunate.cl/#estudio"
    );
  });

  it("ninguna página emite calificaciones", () => {
    for (const ruta of ["index.html", "servicios/cobra-tu-pension.html"]) {
      expect(html(ruta)).not.toContain("AggregateRating");
    }
  });

  it("todas las páginas declaran el canónico sin www", () => {
    for (const ruta of ["index.html", "servicios/cobra-tu-pension.html"]) {
      expect(html(ruta)).toContain('rel="canonical"');
      expect(html(ruta)).not.toContain("www.arteagayaldunate.cl");
    }
  });

  it("el resumen citable está en el HTML, no solo en el schema", () => {
    // Si el texto solo viviera en el JSON-LD, un modelo que lee el cuerpo de
    // la página no lo encontraría.
    const contenido = html("servicios/cobra-tu-pension.html");
    expect(contenido).toContain("mérito ejecutivo");
  });
});
```

- [ ] **Step 2: Run the build and the test**

Run: `npm run build && npx vitest run src/lib/seo/prerender.test.ts`
Expected: PASS, los 6 casos. Si alguno falla, el marcado no está llegando al HTML y hay que revisar que el schema se emita dentro de `<Head>`.

- [ ] **Step 3: Full verification**

Run:
```bash
npx vitest run --exclude '**/node_modules/**' --exclude '.worktrees/**' --exclude '.claude/**'
npx eslint src/lib/seo src/components/seo src/pages/Servicio.tsx src/components/ServiciosDestacados.tsx
npm run build
```
Expected: solo fallan los 2 tests preexistentes de `ProductoForm.test.tsx`; lint limpio; build correcto.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo/prerender.test.ts public/sitemap.xml public/llms.txt
git commit -m "Verificar los datos estructurados contra el HTML prerenderizado"
```

---

## Desviación deliberada respecto del spec

El spec (§1) proponía partir `productosJuridicos.ts` en `src/lib/productos/`, un
archivo por producto. **Este plan no lo hace**, y conviene que quede dicho en vez
de descubrirse después.

El motivo: el corte se justificaba por el ciclo de revisión —un archivo por
producto para revisar y publicar de a uno—, pero en esta fase solo un producto
recibe contenido. El archivo crece unas 40 líneas, no 400. Partirlo ahora
significa mover 450 líneas y tocar los 4 consumidores (`HeroSection`,
`ProductoForm`, `heroSlides`, los tests) sin ganar nada todavía, a cambio de un
riesgo de regresión real en el formulario que sí captura leads hoy.

El corte se vuelve necesario cuando el segundo o tercer producto reciban
contenido. Hacerlo entonces, como refactor puro con los tests en verde antes y
después.

## Después de este plan

Queda pendiente y **requiere revisión de un abogado** antes de tocar código:

1. **Contenido de 6 productos.** Solo "Cobra tu Pensión" se publica en este plan. Los otros necesitan `resumen`, `pasos`, `requisitos` y `faq` revisados. Cuatro ya tienen artículo de fondo del que partir (`ley-devuelveme-mi-casa`, `recuperar-pie-inmobiliaria`, `despido-injustificado`, `autodespido-chile`); dos no tienen nada (Cotizaciones Impagas, Divorcio Express).
2. **Los tres datos pendientes** anotados en `src/lib/seo/estudio.ts`: alcance real de `areaServed`, URLs de redes sociales para `sameAs`, y confirmación del horario contra la ficha de Google Business.
3. **Fase 2:** páginas por área de práctica.
