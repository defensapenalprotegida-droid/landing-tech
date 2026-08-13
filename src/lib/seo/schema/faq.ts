/**
 * FAQPage a partir de las preguntas del producto.
 *
 * Devuelve `null` cuando no hay preguntas en vez de un objeto vacío: un
 * FAQPage sin entidades es marcado inválido y Google lo reporta como error.
 */
export function faqSchema(faq: { q: string; a: string }[]) {
  if (faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faq.map((entrada) => ({
      "@type": "Question" as const,
      name: entrada.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: entrada.a,
      },
    })),
  };
}
