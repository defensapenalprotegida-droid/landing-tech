import { useParams, Link, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getPostBySlug } from "@/lib/blog";
import ArticleByline from "@/components/blog/ArticleByline";
import ArticleSchema from "@/components/blog/ArticleSchema";
import RelatedPosts from "@/components/blog/RelatedPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen">
      <ArticleSchema post={post} />
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.image}
        publishedTime={post.date}
        modifiedTime={post.updated}
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
        <ArticleByline
          author={post.author}
          reviewer={post.reviewer}
          date={post.date}
          updated={post.updated}
        />
        {post.image && (
          <img
            src={post.image}
            alt={post.imageAlt ?? ""}
            width={696}
            height={418}
            className="w-full aspect-[5/3] object-cover rounded-2xl mb-10 shadow-soft"
          />
        )}
        <article className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>

        <RelatedPosts slug={post.slug} />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
