// Los productos viven en TypeScript y estos scripts corren en Node, que no lo
// entiende. Se transpila con esbuild (ya instalado como dependencia de Vite)
// en vez de duplicar los datos en un manifiesto JSON: dos copias se
// desincronizan, y todo el diseño se apoya en que haya una sola fuente.
import { build } from "esbuild";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function cargarProductosPublicados() {
  // El archivo temporal se crea dentro de node_modules/.cache (y no en el
  // tmpdir del sistema) para que, al marcar @fortawesome/* como externo, la
  // resolución de módulos de Node encuentre node_modules subiendo desde ahí.
  // Fuera del proyecto esa resolución falla.
  const base = join("node_modules", ".cache");
  mkdirSync(base, { recursive: true });
  const temporal = mkdtempSync(join(base, "aya-productos-"));
  const salida = join(temporal, "productos.mjs");

  try {
    await build({
      entryPoints: ["src/lib/productosJuridicos.ts"],
      outfile: salida,
      bundle: true,
      format: "esm",
      platform: "node",
      logLevel: "silent",
      // Los iconos de fontawesome no aportan nada a sitemap ni a llms.txt, y
      // quedan como import externo real (Node los resuelve vía node_modules,
      // ver más abajo por qué el archivo temporal vive dentro del proyecto).
      external: ["@fortawesome/*"],
      // Las imágenes (importadas con alias "@/assets/...") no son un paquete
      // real: esbuild no puede resolverlas como módulo Node. Como su
      // contenido no importa para leer slugs y textos, se reemplazan por un
      // string vacío en vez de intentar resolverlas.
      plugins: [
        {
          name: "stub-imagenes",
          setup(build) {
            build.onResolve({ filter: /\.(jpg|jpeg|png|svg)$/ }, (args) => ({
              path: args.path,
              namespace: "stub-imagenes",
            }));
            build.onLoad({ filter: /.*/, namespace: "stub-imagenes" }, () => ({
              contents: "export default '';",
              loader: "js",
            }));
          },
        },
      ],
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
