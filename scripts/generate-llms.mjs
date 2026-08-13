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
