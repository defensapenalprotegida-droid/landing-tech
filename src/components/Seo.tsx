// `Head` es el wrapper de Helmet que expone vite-react-ssg. Importarlo desde
// aquí garantiza que usemos la MISMA instancia de react-helmet-async que el
// HelmetProvider que monta el prerender; con una copia propia el contexto
// llega undefined y el build SSR falla.
import { Head } from "vite-react-ssg";

const SITE = "https://arteagayaldunate.cl";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  /** Ruta absoluta desde la raíz del sitio. Por defecto, el logo. */
  image?: string;
  /** Excluye la página de los índices. Se usa en páginas sin valor de búsqueda. */
  noIndex?: boolean;
  /** Solo para type="article". ISO 8601. */
  publishedTime?: string;
  modifiedTime?: string;
}

const Seo = ({
  title,
  description,
  path = "/",
  type = "website",
  image = "/logo.png",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoProps) => {
  const url = SITE + path;
  const full = `${title} | Arteaga & Aldunate Abogados`;
  const imagenAbsoluta = image.startsWith("http") ? image : SITE + image;

  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, follow"
            : // max-image-preview:large es lo que permite que la miniatura
              // salga grande en resultados y en vistas generadas por IA.
              "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagenAbsoluta} />
      <meta property="og:site_name" content="Arteaga & Aldunate Abogados" />
      <meta property="og:locale" content="es_CL" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imagenAbsoluta} />
    </Head>
  );
};

export default Seo;
