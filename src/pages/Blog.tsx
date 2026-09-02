import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getAllPosts, formatPostDate } from "@/lib/blog";

const Blog = () => {
  const posts = getAllPosts();
  return (
    <div className="min-h-screen">
      <Seo
        title="Blog jurídico"
        description="Artículos prácticos sobre derecho penal, laboral, familia y más. Información legal clara del estudio Arteaga & Aldunate."
        path="/blog"
      />
      <Header />
      <main className="max-w-6xl mx-auto container-padding pt-32 pb-20">
        <div className="text-center mb-14">
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Blog jurídico
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Información legal clara y actualizada
          </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all hover:-translate-y-1 flex flex-col"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.imageAlt ?? ""}
                  width={696}
                  height={418}
                  loading="lazy"
                  className="w-full aspect-[5/3] object-cover"
                />
              )}
              <div className="p-7 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <CalendarDays className="w-4 h-4" />
                <span>{formatPostDate(p.date)}</span>
              </div>
              <p className="text-primary/70 font-semibold text-xs tracking-widest uppercase mb-2">
                {p.category}
              </p>
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 leading-snug">
                {p.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed flex-grow">
                {p.excerpt}
              </p>
              <span className="inline-flex items-center text-primary font-semibold mt-4">
                Leer más
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
