// Genera public/sitemap.xml desde los artículos del blog.
// Antes se mantenía a mano y quedó desactualizado apenas crecieron los posts.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cargarProductosPublicados } from "./lib/cargar-productos.mjs";

const SITE = "https://arteagayaldunate.cl";
const DIR = "src/content/blog";

const productos = await cargarProductosPublicados();

const posts = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = readFileSync(join(DIR, f), "utf8");
    const campo = (k) =>
      raw.match(new RegExp(`^${k}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
    return {
      slug: campo("slug") ?? f.replace(/\.md$/, ""),
      lastmod: campo("updated") ?? campo("date"),
      draft: String(campo("draft")).toLowerCase() === "true",
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.slug < b.slug ? -1 : 1));

const url = (loc, lastmod, priority) =>
  `  <url>\n    <loc>${loc}</loc>\n${
    lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""
  }    <priority>${priority}</priority>\n  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(`${SITE}/`, undefined, "1.0")}
${url(`${SITE}/blog`, undefined, "0.8")}
${posts.map((p) => url(`${SITE}/blog/${p.slug}`, p.lastmod, "0.7")).join("\n")}
${productos.map((p) => url(`${SITE}/servicios/${p.slug}`, undefined, "0.9")).join("\n")}
${url(`${SITE}/privacidad`, undefined, "0.3")}
${url(`${SITE}/terminos`, undefined, "0.3")}
${url(`${SITE}/cookies`, undefined, "0.3")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml generado: ${posts.length} articulos publicados`);
