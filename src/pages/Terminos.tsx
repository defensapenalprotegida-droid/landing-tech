import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Terminos = () => (
  <div className="min-h-screen">
    <Seo
      title="Términos de Servicio"
      description="Términos de uso del sitio de Arteaga & Aldunate Abogados."
      path="/terminos"
    />
    <Header />
    <main className="max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading prose-a:text-primary">
      <h1>Términos de Servicio</h1>
      <p>
        La información de este sitio tiene carácter meramente informativo y no
        constituye asesoría jurídica. La relación profesional con el estudio se
        formaliza únicamente mediante un contrato de prestación de servicios.
      </p>

      <h2>Uso del sitio</h2>
      <p>
        El envío del formulario no crea por sí solo una relación
        abogado-cliente. Hasta que exista un contrato firmado, ninguna consulta
        realizada por este medio genera obligaciones para el estudio.
      </p>

      <h2>Contenido</h2>
      <p>
        Los artículos publicados en el blog describen reglas generales del
        ordenamiento jurídico chileno vigentes a la fecha de publicación. Cada
        caso tiene particularidades que pueden alterar por completo el
        resultado, por lo que no deben tomarse como recomendación para una
        situación concreta.
      </p>
    </main>
    <Footer />
  </div>
);

export default Terminos;
