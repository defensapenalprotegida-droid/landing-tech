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
          path="/"
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
