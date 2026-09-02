import { Head } from "vite-react-ssg";
import type { BlogPost } from "@/lib/blog";
import { ESTUDIO_ID, SITE } from "@/lib/seo/estudio";

/**
 * Datos estructurados BlogPosting.
 *
 * Es lo que permite a Google atribuir el artículo a un autor concreto y no al
 * sitio en abstracto. Se emite dentro de <Head> para que quede en el HTML
 * prerenderizado, no inyectado después por JavaScript.
 */
const ArticleSchema = ({ post }: { post: BlogPost }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "es-CL",
    ...(post.image ? { image: `${SITE}${post.image}` } : {}),
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE}/blog/${post.slug}`,
    },
    ...(post.author
      ? { author: { "@type": "Person", name: post.author } }
      : {}),
    ...(post.reviewer
      ? { reviewedBy: { "@type": "Person", name: post.reviewer } }
      : {}),
    publisher: { "@id": ESTUDIO_ID },
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
};

export default ArticleSchema;
