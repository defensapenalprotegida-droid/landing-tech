import { getAllProductos, type Producto } from "@/lib/productosJuridicos";

export interface HeroSlideData {
  id: Producto;
  emoji: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
  whatsappMessage: string;
}

// Generar slides automáticamente desde productosJuridicos
export const HERO_SLIDES: HeroSlideData[] = getAllProductos().map((producto) => ({
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
