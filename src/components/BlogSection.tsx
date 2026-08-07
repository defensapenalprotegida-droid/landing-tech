import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  ArrowRight,
  Scale,
  Briefcase,
  Heart,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { getAllPosts, formatPostDate } from "@/lib/blog";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Derecho Penal": Scale,
  "Derecho Laboral": Briefcase,
  "Derecho de Familia": Heart,
};

const BlogSection = () => {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Blog legal
          </p>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Información legal clara para tomar mejores decisiones
          </h2>

          <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" />

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Publicamos contenidos prácticos sobre materias penales, civiles,
            laborales, familiares, corporativas y tributarias, para orientar a
            personas y empresas antes de tomar una decisión legal relevante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const Icon = CATEGORY_ICONS[post.category] ?? FileText;
            return (
              <Card
                key={post.slug}
                className="group overflow-hidden bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
              >
                <Link to={`/blog/${post.slug}`} className="block p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatPostDate(post.date)}</span>
                    </div>
                  </div>

                  <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
                    {post.category}
                  </p>

                  <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center text-primary font-semibold group-hover:underline">
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center justify-center rounded-xl border border-primary/30 px-7 py-4 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition"
          >
            Ver todos los artículos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
