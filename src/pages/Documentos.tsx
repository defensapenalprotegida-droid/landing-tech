import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { getDocumentos } from "@/lib/documentos";
import { breadcrumbSchema } from "@/lib/seo/schema/breadcrumb";

/** Índice de plantillas descargables. */
const Documentos = () => {
  const docs = getDocumentos();

  return (
    <div className="min-h-screen">
      <Seo
        title="Documentos y plantillas legales gratis"
        description="Modelos en Word editables y gratuitos: poder simple, carta de renuncia voluntaria, declaración jurada de testigo, checklists para comprar o arrendar propiedades y mandato especial."
        path="/documentos"
      />
      <JsonLd
        schema={breadcrumbSchema([
          { nombre: "Inicio", path: "/" },
          { nombre: "Documentos", path: "/documentos" },
        ])}
      />
      <Header />
      <main className="max-w-6xl mx-auto container-padding pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Recursos útiles
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Documentos y plantillas legales para descargar
          </h1>
          <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
            Modelos en formato Word, editables y gratuitos, preparados por el
            estudio. Cada uno explica cuándo sirve, cómo completarlo y qué
            precauciones tomar antes de usarlo.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docs.map((d) => (
            <Link
              key={d.slug}
              to={`/documentos/${d.slug}`}
              className="group bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-2">
                {d.area}
              </p>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 leading-snug">
                {d.nombre}
              </h2>
              <p className="text-muted-foreground leading-relaxed flex-grow">
                {d.metaDescription}
              </p>
              <span className="inline-flex items-center text-primary font-semibold mt-4">
                Ver y descargar
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentos;
