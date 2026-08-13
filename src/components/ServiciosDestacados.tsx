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
