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
}

const Seo = ({ title, description, path = "/", type = "website" }: SeoProps) => {
  const url = SITE + path;
  const full = `${title} | Arteaga & Aldunate Abogados`;
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE}/logo.png`} />
      <meta property="og:site_name" content="Arteaga & Aldunate Abogados" />
      <meta property="og:locale" content="es_CL" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}/logo.png`} />
    </Head>
  );
};

export default Seo;
