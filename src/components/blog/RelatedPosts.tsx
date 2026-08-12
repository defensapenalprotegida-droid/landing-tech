import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getRelatedPosts } from "@/lib/blog";

/**
 * Artículos relacionados al pie del post.
 *
 * Sin esto cada artículo es una página huérfana: la persona lee, no encuentra
 * a dónde seguir y se va. Priorizar la misma categoría es lo que arma el
 * cluster temático.
 */
const RelatedPosts = ({ slug }: { slug: string }) => {
  const relacionados = getRelatedPosts(slug);
  if (relacionados.length === 0) return null;

  return (
    <aside className="not-prose mt-16 pt-8 border-t border-border">
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">
        Sigue leyendo
      </h2>

      <ul className="grid sm:grid-cols-2 gap-4">
        {relacionados.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/blog/${p.slug}`}
              className="group block h-full rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-hover hover:-translate-y-0.5"
            >
              <p className="text-primary/70 font-semibold text-[11px] tracking-widest uppercase mb-2">
                {p.category}
              </p>
              <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-2">
                {p.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {p.excerpt}
              </p>
              <span className="inline-flex items-center text-primary text-sm font-semibold mt-3">
                Leer
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RelatedPosts;
