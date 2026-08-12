import HeroCarousel from "./hero/HeroCarousel";
import ProductoForm from "./hero/ProductoForm";
import LegalQuickForm from "./hero/LegalQuickForm";
import BrokerageQuickForm from "./hero/BrokerageQuickForm";
import { HERO_SLIDES } from "@/lib/heroSlides";
import type { Producto } from "@/lib/productosJuridicos";

const HeroSection = () => (
  <HeroCarousel
    slides={HERO_SLIDES.map((data) => {
      let form: React.ReactNode;

      if (data.id === "legal") {
        form = <LegalQuickForm />;
      } else if (data.id === "corretaje") {
        form = <BrokerageQuickForm />;
      } else {
        form = <ProductoForm productoId={data.id as Producto} />;
      }

      return { data, form };
    })}
  />
);

export default HeroSection;
