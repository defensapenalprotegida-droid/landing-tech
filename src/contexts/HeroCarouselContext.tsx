import { createContext, useContext, useState, ReactNode } from "react";

interface HeroCarouselContextType {
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  scrollToHero: () => void;
}

const HeroCarouselContext = createContext<HeroCarouselContextType | undefined>(undefined);

export const HeroCarouselProvider = ({ children }: { children: ReactNode }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollToHero = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <HeroCarouselContext.Provider value={{ activeSlide, setActiveSlide, scrollToHero }}>
      {children}
    </HeroCarouselContext.Provider>
  );
};

export const useHeroCarousel = () => {
  const context = useContext(HeroCarouselContext);
  if (!context) {
    throw new Error("useHeroCarousel must be used within HeroCarouselProvider");
  }
  return context;
};
