import { SITE } from "../estudio";

export function breadcrumbSchema(items: { nombre: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem" as const,
      position: indice + 1,
      name: item.nombre,
      item: `${SITE}${item.path}`,
    })),
  };
}
