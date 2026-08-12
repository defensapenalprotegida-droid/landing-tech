import { getAllProductos, type Producto } from "@/lib/productosJuridicos";

export type SlideId = "legal" | "corretaje" | Producto;

export interface HeroSlideData {
  id: SlideId;
  emoji: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
  whatsappMessage: string;
}

// Slides originales (2)
const ORIGINAL_SLIDES: HeroSlideData[] = [
  {
    id: "legal",
    emoji: "⚖️",
    eyebrow: "Asesoría legal",
    title: "Consulta tu caso con nuestros abogados",
    description: "Evaluación gratuita de tu situación legal con profesionales especializados.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f4f8' width='400' height='300'/%3E%3C/svg%3E",
    ctaLabel: "Asesoría legal",
    ctaTarget: "formulario",
    whatsappMessage: "Hola, quiero consultar mi caso con un abogado.",
  },
  {
    id: "corretaje",
    emoji: "🏘️",
    eyebrow: "Corretaje inmobiliario",
    title: "Vende o arrienda tu propiedad con seguridad legal",
    description: "Servicio integral de corretaje con respaldo jurídico completo.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f8f4f0' width='400' height='300'/%3E%3C/svg%3E",
    ctaLabel: "Consultar propiedad",
    ctaTarget: "formulario",
    whatsappMessage: "Hola, quiero asesoría sobre mi propiedad.",
  },
];

// Slides de productos (7)
const PRODUCTO_SLIDES: HeroSlideData[] = getAllProductos().map((producto) => ({
  id: producto.id,
  emoji: producto.emoji,
  eyebrow: producto.eyebrow,
  title: producto.title,
  description: producto.description,
  image: producto.image,
  ctaLabel: producto.cta,
  ctaTarget: "formulario",
  whatsappMessage: producto.whatsappMessage,
}));

// Combinar: 2 originales + 7 productos = 9 slides totales
export const HERO_SLIDES: HeroSlideData[] = [...ORIGINAL_SLIDES, ...PRODUCTO_SLIDES];
