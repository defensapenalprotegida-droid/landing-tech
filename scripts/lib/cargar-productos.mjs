// Los productos viven en TypeScript y estos scripts corren en Node, que no lo
// entiende. Se transpila con esbuild (ya instalado como dependencia de Vite)
// en vez de duplicar los datos en un manifiesto JSON: dos copias se
// desincronizan, y todo el diseño se apoya en que haya una sola fuente.
import { build } from "esbuild";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function cargarProductosPublicados(
  entryPoint = "src/lib/productosJuridicos.ts"
) {
  // El archivo temporal se crea dentro de node_modules/.cache (y no en el
  // tmpdir del sistema) para que, al marcar @fortawesome/* como externo, la
  // resolución de módulos de Node encuentre node_modules subiendo desde ahí.
  // Fuera del proyecto esa resolución falla.
  // Asume que node_modules es escribible. En un CI con instalación
  // --production o de solo lectura, mkdirSync fallará aquí; es un
  // trade-off conocido, no un descuido.
  const base = join("node_modules", ".cache");
  mkdirSync(base, { recursive: true });
  const temporal = mkdtempSync(join(base, "aya-productos-"));
  const salida = join(temporal, "productos.mjs");

  try {
    await build({
      entryPoints: [entryPoint],
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
    const productos = modulo.getProductosPublicados();

    // Un resultado vacío no es un build exitoso: significa que sitemap.xml y
    // llms.txt se generarían sin ninguna página de servicio, deindexando el
    // sitio en silencio (el único rastro sería un console.log fácil de
    // ignorar en CI). Si algún día "cero productos publicados" es un estado
    // legítimo, quien lo necesite debe quitar este guard a propósito.
    if (productos.length === 0) {
      throw new Error(
        "cargarProductosPublicados() devolvió 0 productos publicados. " +
          "Esto detendría el build silenciosamente generando sitemap.xml y " +
          "llms.txt sin ninguna página /servicios/*. Revisa " +
          "getProductosPublicados() en src/lib/productosJuridicos.ts: " +
          "¿algún producto perdió su bloque `seo` o su flag de publicación " +
          "por error?"
      );
    }

    return productos.map((producto) => ({
      slug: producto.seo.slug,
      h1: producto.seo.h1,
      metaDescription: producto.seo.metaDescription,
      resumen: producto.seo.resumen,
    }));
  } finally {
    rmSync(temporal, { recursive: true, force: true });
  }
}
