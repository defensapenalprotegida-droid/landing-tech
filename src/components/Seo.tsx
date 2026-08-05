import { Helmet } from "react-helmet-async";

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
    <Helmet>
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
    </Helmet>
  );
};

export default Seo;
