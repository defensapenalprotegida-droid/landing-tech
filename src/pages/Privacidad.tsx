import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Privacidad = () => (
  <div className="min-h-screen">
    <Seo
      title="Política de Privacidad"
      description="Política de privacidad y tratamiento de datos personales de Arteaga & Aldunate Abogados."
      path="/privacidad"
    />
    <Header />
    <main className="max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading prose-a:text-primary">
      <h1>Política de Privacidad</h1>
      <p>
        En Arteaga &amp; Aldunate Abogados y Asociados resguardamos la
        información que nos entregas a través de este sitio. Los datos del
        formulario de contacto se utilizan exclusivamente para responder tu
        consulta y no se comparten con terceros.
      </p>

      <h2>Datos que recopilamos</h2>
      <p>
        Nombre, teléfono, correo electrónico y la descripción de tu caso que
        decidas compartir.
      </p>

      <h2>Confidencialidad</h2>
      <p>
        Toda la información está protegida por el secreto profesional del
        abogado.
      </p>

      <h2>Contacto</h2>
      <p>
        Para ejercer tus derechos sobre tus datos, escríbenos a{" "}
        <a href="mailto:abogados@arteagayaldunate.cl">
          abogados@arteagayaldunate.cl
        </a>
        .
      </p>
    </main>
    <Footer />
  </div>
);

export default Privacidad;
