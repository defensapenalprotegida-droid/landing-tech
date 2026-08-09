# Carrusel del hero: corretaje + respaldo legal — Diseño

**Fecha:** 2026-08-08
**Proyecto:** landing-tech (arteagayaldunate.cl)

## Contexto

El estudio suma una segunda línea de negocio: corretaje de propiedades acompañado de
asesoría legal y representación judicial. La propuesta de valor es que el mismo estudio
que corretea la propiedad resuelve el conflicto legal que la afecta — herencias sin
posesión efectiva, arriendos impagos, copropiedad en disputa, juicios en curso.

El hero actual muestra un solo servicio (defensa legal) con un formulario rápido de
cuatro campos que ya funciona y envía a través de `/api/contact` → backend SES.

## Objetivo

Que el hero alterne entre las dos líneas de negocio mediante un carrusel, con un
formulario de primer contacto propio para cada una, sin degradar la conversión ni el
SEO del servicio legal.

## Decisiones tomadas

| Decisión | Elección | Motivo |
|---|---|---|
| Qué rota | Hero completo, formulario incluido | Cada servicio necesita campos distintos |
| Campos de corretaje | Calificador + pregunta de conflicto legal | Conecta ambas líneas de negocio |
| Comportamiento | Fijo en legal, avance manual | Protege el H1 indexado y no interrumpe al usuario |

## Arquitectura

`HeroSection.tsx` concentra hoy layout, textos, estado de formulario, validación y
envío. Con dos slides el archivo crece más allá de lo razonable, así que se divide en
unidades con una responsabilidad cada una:

```
src/components/hero/
  HeroCarousel.tsx        Carrusel (embla) + controles. No sabe de formularios.
  HeroSlide.tsx           Layout compartido: fondo, titular, bajada, CTAs, children.
  LegalQuickForm.tsx      Formulario legal actual, extraído sin cambios de conducta.
  BrokerageQuickForm.tsx  Formulario de corretaje.
src/lib/heroSlides.ts     Textos, imágenes y CTAs de cada slide.
src/lib/brokerageSchema.ts  Schema zod del formulario de corretaje.
```

`HeroSection.tsx` queda como ensamblador delgado: compone el carrusel con sus dos
slides y sus formularios.

**Interfaces:**

- `HeroSlide` recibe los datos de presentación (`heroSlides.ts`) y el formulario como
  `children`. No conoce ninguna lógica de envío.
- Cada formulario es autónomo: su propio estado, validación y llamada a `submitLead`.
- `HeroCarousel` solo controla qué slide está activo y marca el inactivo como `inert`.

## Formulario de corretaje

| Campo | Tipo | Requerido |
|---|---|---|
| `name` | texto | sí |
| `phone` | texto | sí |
| `email` | correo | sí |
| `operacion` | `vender` \| `arrendar` \| `comprar` \| `busco_arriendo` | sí |
| `tipoPropiedad` | `casa` \| `departamento` \| `oficina` \| `local` \| `terreno` | no |
| `comuna` | texto | no |
| `temaLegal` | `no_lo_se` \| `no` \| `si` | no |
| `message` | texto, mín. 5 caracteres | sí |
| `website` | honeypot, debe ir vacío | — |

El mínimo de 5 caracteres iguala al del formulario legal.

## Contrato con el backend

Se reutiliza `/api/contact` y el stack SES ya desplegado. **No hay infraestructura
nueva.**

Al payload se agrega `servicio: "legal" | "corretaje"`.

`LeadPayload` en `src/lib/leadApi.ts` está tipado hoy como
`Partial<LeadFormValues> & { name; email; message }`, que **no admite campos ajenos al
formulario legal**: enviar `operacion` o `servicio` no compilaría. Hay que ampliarlo a
la unión de ambos formularios (`Partial<LeadFormValues> & Partial<BrokerageFormValues>`
más los tres obligatorios), manteniendo el mismo contrato de retorno.

En el backend
(`arteagayaldunate-contact-backend`):

- `ContactPayload` incorpora los campos de corretaje.
- `buildEmailContent` agrega una sección **Propiedad** (operación, tipo, comuna, tema
  legal) que solo aparece cuando llegan esos campos.
- El asunto pasa a incluir el servicio: `[CORRETAJE · VENDER] Nueva consulta — Nombre`.
  Los leads legales conservan el formato actual.

El destinatario no cambia: `abogados@arteagayaldunate.cl`.

## SEO

- **Un solo `<h1>` en el documento**: el del slide legal. El titular de corretaje es
  `<h2>`.
- Ambos slides se prerenderizan, de modo que el texto de corretaje es indexable aunque
  el visitante nunca avance el carrusel.
- El carrusel arranca siempre en el slide legal, así el contenido que Google ve primero
  no cambia respecto de hoy.

## Accesibilidad

- Sin rotación automática: nada se mueve sin acción del usuario.
- El slide inactivo lleva `inert`, para que el tabulador y los lectores de pantalla no
  entren en un formulario invisible. Sin esto, navegar con teclado cae en campos que no
  se ven.
- Controles con `aria-label` explícito y `aria-roledescription="carousel"` en el
  contenedor.
- Los puntos indicadores son botones reales, no `div` con `onClick`.

## Manejo de errores

Se mantiene el actual: validación en cliente antes de enviar, `toast` destructivo si
falta algo, `toast` de éxito y limpieza del formulario al recibir `ok: true`. El
honeypot responde `ok` sin enviar, igual que hoy.

## Pruebas

- `brokerageSchema`: rechaza sin campos requeridos, acepta el mínimo válido, bloquea
  cuando el honeypot viene lleno.
- `BrokerageQuickForm`: envía `servicio: "corretaje"` y los campos de propiedad.
- `HeroCarousel`: renderiza ambos slides; el inactivo queda `inert`.
- Backend: `buildEmailContent` incluye la sección Propiedad y el asunto con
  `[CORRETAJE · …]` solo cuando el servicio es corretaje.

## Riesgos

**Reparto de atención en el punto de conversión.** El hero es la principal entrada de
leads legales. Un carrusel introduce un control de navegación donde antes había un
mensaje único. Arrancar fijo en legal y sin autoplay lo mitiga, pero no lo elimina.

*Señal de alarma:* caída sostenida de consultas legales tras el lanzamiento.
*Salida:* mover el corretaje a su propia sección bajo el hero, que fue la alternativa
descartada en el diseño y sigue disponible sin rehacer los formularios.

## Fuera de alcance

- Página dedicada de corretaje, listado de propiedades o buscador.
- Enrutar los leads de corretaje a un destinatario distinto.
- Cambios en el formulario extenso de la sección de contacto.
