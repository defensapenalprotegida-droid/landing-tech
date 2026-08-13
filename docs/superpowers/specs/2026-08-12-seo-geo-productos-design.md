# SEO + GEO — Páginas de producto y capa de datos estructurados

**Fecha:** 2026-08-12
**Rama:** `main`
**Sitio:** https://arteagayaldunate.cl

## Contexto

El sitio ya sale primero en Google para la marca ("abogados arteaga aldunate") y
Google genera un AI Overview sobre el estudio. Lo que no gana hoy es todo lo
demás: búsquedas genéricas de servicio, citas en respuestas de IA y presencia en
el paquete local.

Hay tres hallazgos que explican por qué, y de ellos sale todo el diseño.

**Los productos no existen como páginas.** Los 7 productos jurídicos ("Recupera
tu Casa", "Cobra tu Pensión", "Divorcio Express"…) y las 7 áreas de práctica
viven todos dentro de `/`. El sitio entero tiene 4 URLs indexables más el blog.
"Recupera tu Casa" no puede posicionar porque no es una página, y una IA no
puede citarlo porque no hay nada que citar.

**La home no emite ningún dato estructurado.** El único JSON-LD del sitio es
`BlogPosting` en los artículos. No hay `LegalService`, ni `Organization`, ni
`LocalBusiness`. Dirección, teléfono, horarios y áreas de práctica están en el
HTML como texto suelto, sin marcado que los identifique como tales.

**El AI Overview describe al estudio mejor que el propio sitio.** Google dice
"estudio jurídico integral… penal, civil, laboral, familia, corporativo,
inmobiliario y tributario", mientras la `<meta description>` de la home dice
"estudio jurídico penal especializado". Google está sacando el detalle de
Instagram. La fuente canónica debería ser el sitio.

### Contenido que ya existe y está desaprovechado

Cinco de los siete productos ya tienen un artículo de blog de fondo, escrito y
revisado:

| Producto | Artículo |
|---|---|
| Recupera tu Casa | `ley-devuelveme-mi-casa` |
| Recupera tu Pie | `recuperar-pie-inmobiliaria` |
| Defiende tu Despido | `despido-injustificado` |
| Cobra tu Pensión | `cobrar-pension-alimentos-impaga` |
| Autodespido | `autodespido-chile` |

Además, `FAQSection.tsx` contiene 10 preguntas detalladas sobre pensión de
alimentos que **no están montadas en ninguna página**. Es contenido terminado
que hoy no lo ve nadie.

## Decisiones tomadas

- **Posicionamiento: producto primero.** El gancho son los 7 productos
  concretos, respaldados por las 7 áreas. Es como la gente pregunta de verdad
  ("cómo cobro la pensión que no me pagan", no "derecho de familia") y es lo que
  una IA puede citar como respuesta útil.
- **Alcance fase 1:** capa de datos estructurados + política de rastreo + 7
  páginas de producto. Las páginas de área quedan para una fase posterior.
- **Fuente única de verdad.** Página, JSON-LD, sitemap y `llms.txt` derivan de la
  misma estructura de datos. La alternativa (contenido en Markdown, campos en
  TypeScript) parte la definición del producto en dos sitios que se
  desincronizan.
- **Sin `AggregateRating` ni `Review`.** Los testimonios del sitio son reales
  pero anonimizados; Google exige reseñas atribuibles y verificables. Inventar
  estrellas es causa de penalización manual, y en un estudio jurídico es además
  un problema ético. Las estrellas viven en Google Business Profile, no acá.
- **Google Business Profile existe y está verificado.** El schema del sitio debe
  replicar exactamente su NAP (nombre, dirección, teléfono).

## Objetivos y no-objetivos

**Objetivos**

- Que cada producto tenga una URL propia, indexable y citable.
- Que el estudio sea una entidad única e inequívoca para buscadores y LLM.
- Que el sitio sea la fuente canónica de cómo se describe el estudio.
- Que el contenido esté escrito en el formato que los LLM citan.

**No-objetivos**

- Páginas por área de práctica (fase 2).
- Páginas por comuna. Son fábricas de contenido flaco.
- Marcado de reseñas.
- Cualquier afirmación jurídica no revisada por un abogado.

## Arquitectura

### 1. Fuente única — `src/lib/productos/`

`productosJuridicos.ts` (~450 líneas) se parte en un directorio con un archivo
por producto más un `index.ts` que reexporta. El tipo `ProductoJuridico` gana un
bloque `seo`:

```ts
interface ProductoSeo {
  slug: string;              // "recupera-tu-casa"
  h1: string;
  metaTitle: string;
  metaDescription: string;
  resumen: string;           // el párrafo que una IA va a citar
  pasos: { titulo: string; detalle: string }[];
  requisitos: string[];
  faq: { q: string; a: string }[];
  articuloRelacionado?: string;   // slug de blog
}
```

El corte por archivo no es cosmético: cada producto pasa a ser una unidad que se
puede leer, revisar y publicar por separado, que es exactamente el ciclo que
sigue el contenido revisado por un abogado.

### 2. Capa de datos estructurados — `src/lib/seo/schema/`

La decisión central: **una sola entidad con `@id` estable**, no una organización
distinta por página.

- `organizationSchema.ts` — `LegalService` con
  `@id: "https://arteagayaldunate.cl/#estudio"`, emitido una vez desde `Layout`.
  Incluye `name`, `address` (`PostalAddress`), `telephone`, `email`,
  `openingHoursSpecification`, `areaServed`, `knowsAbout` (las 7 áreas),
  `hasOfferCatalog` (los 7 productos), `sameAs` y `logo`.
- `serviceSchema.ts` — un `Service` por producto, con
  `provider: { "@id": "…/#estudio" }`.
- `faqSchema.ts` — `FAQPage`, alimentado por `seo.faq`.
- `breadcrumbSchema.ts` — `BreadcrumbList`.
- `JsonLd.tsx` — componente único que serializa y emite dentro de `<Head>`, para
  que quede en el HTML prerenderizado y no inyectado por JavaScript.

El `@id` compartido es lo que permite a Google y a los LLM entender que las 11
páginas pertenecen a **un** estudio, en lugar de once negocios distintos que
comparten teléfono.

### 3. Páginas de producto — `/servicios/<slug>`

Ruta nueva en `App.tsx` con `getStaticPaths`, igual que el blog. Estructura:

```
breadcrumb → H1 → resumen → pasos → requisitos
          → ProductoForm (reusado) → FAQ (acordeón) → artículo de fondo
```

`ProductoForm` se reusa tal cual: los campos ya viven en la definición del
producto. La página no duplica lógica de formulario.

### 4. `Seo.tsx` ampliado

Gana `image` (hoy las 16 páginas comparten la misma imagen social), `robots`, y
`article:published_time` / `modified_time` para artículos.

### 5. Legibilidad para IA

- `public/llms.txt` generado por script desde la misma fuente, junto al sitemap.
- `robots.txt`: declarar explícitamente `Google-Extended`, `GPTBot`,
  `OAI-SearchBot`, `ClaudeBot` y `PerplexityBot`. Hoy `User-agent: *` los cubre
  por defecto, pero declararlos quita la ambigüedad, y `Google-Extended` es
  específicamente el que gobierna la inclusión en AI Overviews.
- **Formato del contenido:** cada FAQ responde en la primera frase, y cada
  producto abre con `resumen`. Los LLM citan párrafos que se sostienen solos,
  fuera de su contexto.

### 6. Home

- Corregir la `<meta description>`: el estudio es integral, no solo penal.
- Mover el FAQ de pensión de alimentos a su página de producto.
- Enlazar desde la home a las 7 páginas nuevas.

## Flujo de datos

```
src/lib/productos/<producto>.ts   (fuente única)
        │
        ├──> /servicios/<slug>          página prerenderizada
        ├──> Service + FAQPage + Breadcrumb JSON-LD
        ├──> scripts/generate-sitemap.mjs
        └──> scripts/generate-llms.mjs
```

`Layout` emite el `LegalService` una vez; todo lo demás lo referencia por `@id`.

## Pruebas

- El JSON-LD de cada página es JSON válido y parseable.
- Todas las páginas referencian el mismo `@id` de estudio.
- El `LegalService` trae los campos obligatorios (nombre, dirección, teléfono).
- Los slugs de producto son únicos y generan ruta.
- `sitemap.xml` y `llms.txt` incluyen las 7 páginas nuevas.
- **El JSON-LD aparece en el HTML prerenderizado de `dist/`**, no inyectado por
  JS. Es la prueba que de verdad importa: un crawler que no ejecuta JavaScript
  debe ver el marcado.
- Ningún schema emite `AggregateRating` ni `Review`.

## Riesgos

1. **Contenido flaco.** Siete páginas con poco texto posicionan peor que no
   existir. Mitigación: publicación por tandas — un producto se publica cuando
   tiene contenido revisado, no antes. La ruta se genera desde los productos que
   tengan bloque `seo` completo.
2. **Afirmaciones jurídicas sin revisar.** Los borradores que redacte Claude van
   marcados como tales y no se publican sin revisión de un abogado.
3. **Inconsistencia NAP.** Si el schema y la ficha de Google Business difieren en
   un carácter, la señal se debilita en vez de reforzarse. Hay que copiar la
   ficha, no reescribirla.
4. **`src/lib/productos/` mal cortado.** Si el índice reexporta con efectos de
   orden, el prerender puede generar rutas incompletas. Cubierto por la prueba
   de slugs.

## Pendientes de información

Bloquean partes concretas del schema, no el trabajo entero:

- **¿"Cobertura nacional" es exacto?** Define `areaServed`. Si en la práctica se
  litiga solo en la Región Metropolitana, declarar Chile entero perjudica.
- **URLs reales de Instagram, LinkedIn y Facebook.** Hoy el footer las tiene como
  `href="#"`. Van en `sameAs`, que es de las señales más fuertes para que una IA
  conecte el sitio con los perfiles del estudio.
- **Horario exacto y NAP literal de la ficha de Google Business.** El footer dice
  "Lun-Vie 9:00-18:00, emergencias 24/7"; hay que confirmar que coincide.
- **Contenido de 2 productos** (Cotizaciones Impagas, Divorcio Express) y **FAQ
  de 6 de los 7**.

## Fuera de alcance

Páginas de área de práctica, páginas por comuna, marcado de reseñas, y cualquier
cambio a `vercel.json`, dominios o headers.
