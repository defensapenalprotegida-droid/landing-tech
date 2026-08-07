import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getPostBySlug, formatPostDate } from "@/lib/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen">
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
      />
      <Header />
      <main className="max-w-3xl mx-auto container-padding pt-32 pb-20">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary font-semibold mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al blog
        </Link>
        <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-3">
          {post.category}
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-10">
          <CalendarDays className="w-4 h-4" />
          <span>{formatPostDate(post.date)}</span>
          {post.author && <span>· {post.author}</span>}
        </div>
        <article className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
