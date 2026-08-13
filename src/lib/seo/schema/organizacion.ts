import { ESTUDIO, ESTUDIO_ID, SITE } from "../estudio";
import { getProductosPublicados } from "@/lib/productosJuridicos";

/**
 * La entidad raíz del sitio.
 *
 * Se emite una sola vez, desde el Layout. Todo lo demás la referencia por
 * `@id` en vez de repetirla: si cada página declarara su propia organización,
 * un cambio de teléfono dejaría once versiones distintas circulando.
 */
export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": ESTUDIO_ID,
    name: ESTUDIO.nombre,
    alternateName: ESTUDIO.nombreCorto,
    description: ESTUDIO.descripcion,
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/logo.png`,
    telephone: ESTUDIO.telefono,
    email: ESTUDIO.email,
    inLanguage: "es-CL",
    address: {
      "@type": "PostalAddress",
      streetAddress: ESTUDIO.direccion.calle,
      addressLocality: ESTUDIO.direccion.ciudad,
      addressRegion: ESTUDIO.direccion.region,
      addressCountry: ESTUDIO.direccion.pais,
    },
    areaServed: ESTUDIO.areaServida,
    knowsAbout: [...ESTUDIO.areas],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...ESTUDIO.horario.dias],
        opens: ESTUDIO.horario.abre,
        closes: ESTUDIO.horario.cierra,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios jurídicos",
      itemListElement: getProductosPublicados().map((producto) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${SITE}/servicios/${producto.seo!.slug}#servicio`,
          name: producto.seo!.h1,
          url: `${SITE}/servicios/${producto.seo!.slug}`,
        },
      })),
    },
    // sameAs solo si hay perfiles reales: un enlace de relleno le pide al
    // buscador que confíe en algo roto.
    ...(ESTUDIO.redes.length > 0 ? { sameAs: [...ESTUDIO.redes] } : {}),
  };
}
