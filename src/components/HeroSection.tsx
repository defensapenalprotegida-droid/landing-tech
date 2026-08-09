import HeroCarousel from "./hero/HeroCarousel";
import LegalQuickForm from "./hero/LegalQuickForm";
import BrokerageQuickForm from "./hero/BrokerageQuickForm";
import { HERO_SLIDES } from "@/lib/heroSlides";

const FORMULARIOS: Record<string, React.ReactNode> = {
  legal: <LegalQuickForm />,
  corretaje: <BrokerageQuickForm />,
};

const HeroSection = () => (
  <HeroCarousel
    slides={HERO_SLIDES.map((data) => ({ data, form: FORMULARIOS[data.id] }))}
  />
);

export default HeroSection;
