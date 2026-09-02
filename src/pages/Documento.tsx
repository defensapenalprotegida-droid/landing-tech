import { Link, Navigate, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import JsonLd from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDocumentoBySlug, urlDescarga } from "@/lib/documentos";
import { documentoSchema } from "@/lib/seo/schema/documento";
import { faqSchema } from "@/lib/seo/schema/faq";
import { breadcrumbSchema } from "@/lib/seo/schema/breadcrumb";

/**
 * Página de una plantilla descargable.
 *
 * El resumen va justo después del H1 por la misma razón que en Servicio: es
 * el párrafo que un buscador extrae como respuesta. El botón de descarga va
 * arriba y abajo porque quien llega desde Google suele querer el archivo.
 */
const Documento = () => {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getDocumentoBySlug(slug) : undefined;
  if (!doc) return <Navigate to="/documentos" replace />;

  const ruta = `/documentos/${doc.slug}`;
  const descarga = urlDescarga(doc);

  const BotonDescarga = () => (
    <a
      href={descarga}
      download
      className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-4 font-body font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-hover hover:-translate-y-0.5"
    >
      <Download className="h-5 w-5" />
      Descargar {doc.nombre} (.docx)
    </a>
  );

  return (
    <div className="min-h-screen">
      <Seo title={doc.metaTitle} description={doc.metaDescription} path={ruta} />
      <JsonLd schema={documentoSchema(doc)} />
      <JsonLd schema={faqSchema(doc.faq)} />
      <JsonLd
        schema={breadcrumbSchema([
          { nombre: "Inicio", path: "/" },
          { nombre: "Documentos", path: "/documentos" },
          { nombre: doc.nombre, path: ruta },
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
            <li>
              <Link to="/documentos" className="hover:text-legal-primary">
                Documentos
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{doc.nombre}</li>
          </ol>
        </nav>

        <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-3">
          {doc.area}
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {doc.h1}
        </h1>

        <p className="mt-5 font-body text-lg leading-relaxed text-muted-foreground">
          {doc.resumen}
        </p>

        <div className="mt-8">
          <BotonDescarga />
          <p className="mt-3 font-body text-sm text-muted-foreground">
            Formato Word editable, gratuito. Reemplaza los campos entre
            corchetes con tus datos.
          </p>
        </div>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Cuándo usar este documento
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 font-body text-muted-foreground">
          {doc.cuandoUsar.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Cómo completarlo
        </h2>
        <ol className="mt-5 space-y-4">
          {doc.comoCompletar.map((paso, indice) => (
            <li
              key={paso}
              className="rounded-lg border border-border bg-card/60 p-5 font-body text-muted-foreground"
            >
              <span className="font-bold text-foreground">{indice + 1}.</span>{" "}
              {paso}
            </li>
          ))}
        </ol>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Antes de usarlo
        </h2>
        <ul className="mt-5 space-y-3">
          {doc.advertencias.map((item) => (
            <li
              key={item}
              className="rounded-lg border-l-4 border-primary/60 bg-primary/5 p-4 font-body text-sm leading-relaxed text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-bold text-foreground">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="mt-5 space-y-3">
          {doc.faq.map((entrada, indice) => (
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

        <div className="mt-12">
          <BotonDescarga />
        </div>

        {doc.articuloRelacionado && (
          <p className="mt-10 font-body">
            <Link
              to={`/blog/${doc.articuloRelacionado}`}
              className="text-legal-primary underline underline-offset-4"
            >
              Lee el artículo del blog sobre este tema
            </Link>
          </p>
        )}

        <p className="mt-12 rounded-xl border border-border bg-card/60 p-5 font-body text-sm leading-relaxed text-muted-foreground">
          Este modelo es de uso general e informativo. No constituye asesoría
          jurídica para un caso concreto. Si tienes dudas sobre cómo aplicarlo,{" "}
          <Link to="/#contacto" className="text-legal-primary underline underline-offset-4">
            escríbenos
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Documento;
