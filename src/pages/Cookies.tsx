import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { CATEGORIES, CONSENT_VERSION } from "@/lib/cookies/categories";
import { openCookiePreferences } from "@/lib/cookies/preferencesBus";

/**
 * Registro de cookies del sitio.
 *
 * Hoy la tabla tiene una sola fila porque el sitio solo carga reCAPTCHA. La
 * estructura queda armada para ir sumando filas a medida que se incorporen
 * proveedores: cada uno que se registre en `trackingLoader` debe aparecer acá
 * el mismo día, o la política deja de describir lo que el sitio hace.
 */
interface FilaCookie {
  cookie: string;
  proveedor: string;
  finalidad: string;
  categoria: string;
  duracion: string;
  tipo: "Propia" | "De terceros";
  dominio: string;
}

const COOKIES_REGISTRADAS: FilaCookie[] = [
  {
    cookie: "aya_cookie_consent",
    proveedor: "Arteaga & Aldunate",
    finalidad:
      "Guardar tu decisión sobre las cookies para no volver a preguntarte en cada visita.",
    categoria: "Estrictamente necesaria",
    duracion: "Permanente hasta que la borres o cambie la versión",
    tipo: "Propia",
    dominio: "arteagayaldunate.cl",
  },
  {
    cookie: "_GRECAPTCHA",
    proveedor: "Google (reCAPTCHA Enterprise)",
    finalidad:
      "Distinguir personas de robots en los formularios de contacto y evitar envíos automatizados.",
    categoria: "Estrictamente necesaria",
    duracion: "6 meses",
    tipo: "De terceros",
    dominio: "google.com",
  },
];

const Cookies = () => (
  <div className="min-h-screen">
    <Seo
      title="Política de Cookies"
      description="Qué cookies utiliza el sitio de Arteaga & Aldunate Abogados, con qué finalidad y cómo gestionar tus preferencias."
      path="/cookies"
    />
    <Header />

    <main className="max-w-4xl mx-auto container-padding pt-32 pb-20">
      <div className="prose prose-lg prose-headings:font-heading prose-a:text-primary max-w-none">
        <h1>Política de Cookies</h1>
        <p>
          Las cookies son pequeños archivos que un sitio guarda en tu navegador.
          Algunas son imprescindibles para que la página funcione; otras solo se
          activan si tú lo autorizas.
        </p>

        <h2>Categorías que utilizamos</h2>
      </div>

      <ul className="mt-6 space-y-4">
        {CATEGORIES.map((categoria) => (
          <li
            key={categoria.id}
            className="rounded-lg border border-border bg-card/60 p-5"
          >
            <h3 className="font-body text-base font-bold text-foreground">
              {categoria.title}
            </h3>
            <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
              {categoria.description}
            </p>
            {categoria.alwaysOn && (
              <p className="mt-2 font-body text-xs font-medium text-legal-primary">
                Siempre activas: no requieren tu consentimiento.
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="prose prose-lg prose-headings:font-heading prose-a:text-primary max-w-none mt-10">
        <h2>Detalle de cookies</h2>
        <p>
          Este es el listado de las cookies que el sitio puede instalar. Si
          incorporamos herramientas nuevas, se agregan aquí antes de activarse.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[52rem] border-collapse font-body text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              {[
                "Cookie",
                "Proveedor",
                "Finalidad",
                "Categoría",
                "Duración",
                "Tipo",
                "Dominio",
              ].map((encabezado) => (
                <th
                  key={encabezado}
                  scope="col"
                  className="px-4 py-3 font-bold text-foreground"
                >
                  {encabezado}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COOKIES_REGISTRADAS.map((fila) => (
              <tr key={fila.cookie} className="border-t border-border align-top">
                <td className="px-4 py-3 font-mono text-xs text-foreground">
                  {fila.cookie}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fila.proveedor}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fila.finalidad}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fila.categoria}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fila.duracion}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{fila.tipo}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {fila.dominio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-lg prose-headings:font-heading prose-a:text-primary max-w-none mt-10">
        <h2>Cómo cambiar tu decisión</h2>
        <p>
          Puedes modificar o retirar tu consentimiento cuando quieras. Al
          retirarlo dejamos de cargar los servicios afectados y eliminamos las
          cookies que estén a nuestro alcance.
        </p>
      </div>

      <button
        type="button"
        onClick={openCookiePreferences}
        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-legal-primary px-6 font-body text-sm font-bold text-white transition-colors hover:bg-legal-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Abrir preferencias de cookies
      </button>

      <div className="prose prose-lg prose-headings:font-heading prose-a:text-primary max-w-none mt-10">
        <p>
          El tratamiento de los datos personales que nos entregas a través de
          los formularios se rige por nuestra{" "}
          <Link to="/privacidad">Política de Privacidad</Link>.
        </p>
        <p className="text-sm text-muted-foreground">
          Versión vigente del consentimiento de cookies: {CONSENT_VERSION}.
        </p>
      </div>
    </main>

    <Footer />
  </div>
);

export default Cookies;
