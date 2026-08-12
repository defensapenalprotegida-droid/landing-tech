export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  /** Última revisión. Google la usa y el lector la necesita en temas legales. */
  updated?: string;
  category: string;
  excerpt: string;
  description: string;
  /** Quien redacta. Debe coincidir con el `name` de src/lib/team.ts. */
  author?: string;
  /** Quien revisa jurídicamente. También debe existir en el equipo. */
  reviewer?: string;
  /** Mientras sea true el artículo no se publica ni se indexa. */
  draft: boolean;
  content: string;
}

// Carga cruda de todos los .md en build (Vite import.meta.glob)
const files = import.meta.glob("/src/content/blog/*.md", {
  eager: true, query: "?raw", import: "default",
}) as Record<string, string>;

// Parser mínimo de frontmatter (evita depender de gray-matter, que usa
// `Buffer` y falla con ReferenceError en el navegador, donde ese global
// no existe). Devuelve la misma forma { data, content }.
function matter(raw: string): { data: Record<string, string>; content: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, content: m[2] };
}

function parse(path: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const fallbackSlug = path.split("/").pop()!.replace(/\.md$/, "");
  return {
    slug: (data.slug as string) || fallbackSlug,
    title: data.title as string,
    date: data.date as string,
    updated: (data.updated as string) || undefined,
    category: data.category as string,
    excerpt: data.excerpt as string,
    description: (data.description as string) || (data.excerpt as string),
    author: data.author as string | undefined,
    reviewer: (data.reviewer as string) || undefined,
    // Por defecto NO es borrador: los artículos ya publicados no traen el
    // campo y deben seguir visibles.
    draft: String(data.draft).toLowerCase() === "true",
    content: content.trim(),
  };
}

const posts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

/**
 * Artículos publicables. Los borradores existen en el repositorio para poder
 * revisarlos, pero no se listan ni se prerenderizan: un artículo jurídico sin
 * revisar no debe llegar a un cliente.
 */
const published: BlogPost[] = posts.filter((p) => !p.draft);

export function getAllPosts(): BlogPost[] {
  return published;
}

/** Incluye borradores. Solo para herramientas internas y pruebas. */
export function getAllPostsIncludingDrafts(): BlogPost[] {
  return posts;
}

/** Categorías presentes, con su conteo, para armar los clusters. */
export function getCategories(): Array<{ name: string; count: number }> {
  const conteo = new Map<string, number>();
  for (const p of published) {
    conteo.set(p.category, (conteo.get(p.category) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Artículos relacionados: primero los de la misma categoría. Es lo que hace
 * que alguien lea dos o tres y no una sola página suelta.
 */
export function getRelatedPosts(slug: string, limite = 3): BlogPost[] {
  const actual = published.find((p) => p.slug === slug);
  if (!actual) return [];
  const mismaCategoria = published.filter(
    (p) => p.slug !== slug && p.category === actual.category
  );
  const resto = published.filter(
    (p) => p.slug !== slug && p.category !== actual.category
  );
  return [...mismaCategoria, ...resto].slice(0, limite);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

// `new Date("2026-07-10")` se interpreta como medianoche UTC y al formatear
// en horario de Chile (UTC-3/-4) retrocede un día. Forzamos la lectura como
// fecha local agregando la hora.
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
