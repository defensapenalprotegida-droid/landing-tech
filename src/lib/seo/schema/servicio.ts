import { ESTUDIO, ESTUDIO_ID, SITE } from "../estudio";
import type { ProductoJuridico } from "@/lib/productosJuridicos";

/** Un servicio concreto, siempre atribuido a la entidad del estudio. */
export function servicioSchema(producto: ProductoJuridico) {
  const seo = producto.seo!;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/servicios/${seo.slug}#servicio`,
    name: seo.h1,
    description: seo.resumen,
    url: `${SITE}/servicios/${seo.slug}`,
    serviceType: seo.h1,
    inLanguage: "es-CL",
    provider: { "@id": ESTUDIO_ID },
    areaServed: ESTUDIO.areaServida,
  };
}
