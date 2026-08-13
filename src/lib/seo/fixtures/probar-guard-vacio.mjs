// Ejecuta cargarProductosPublicados() contra un fixture sin productos
// publicados, en un proceso Node plano (no jsdom): esbuild rompe su
// invariante de TextEncoder dentro del entorno jsdom de vitest, así que el
// test de generadores.test.ts dispara este script por separado, igual que
// ya hace con generate-sitemap.mjs y generate-llms.mjs.
import { cargarProductosPublicados } from "../../../../scripts/lib/cargar-productos.mjs";

try {
  await cargarProductosPublicados(
    "src/lib/seo/fixtures/productos-sin-publicar.ts"
  );
  console.error("No lanzó error con 0 productos publicados");
  process.exit(1);
} catch (error) {
  console.log(error.message);
}
