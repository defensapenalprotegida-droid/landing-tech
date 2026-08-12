import HeroCarousel from "./hero/HeroCarousel";
import ProductoForm from "./hero/ProductoForm";
import { HERO_SLIDES } from "@/lib/heroSlides";
import type { Producto } from "@/lib/productosJuridicos";

const HeroSection = () => (
  <HeroCarousel
    slides={HERO_SLIDES.map((data) => ({
      data,
      form: <ProductoForm productoId={data.id as Producto} />,
    }))}
  />
);

export default HeroSection;
