import { useState } from "react";
import { Link } from "react-router-dom";
import { useSectionNav } from "@/hooks/use-section-nav";
import { focusArea } from "@/lib/areaFocus";
import { useHeroCarousel } from "@/contexts/HeroCarouselContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AREAS, AREA_LABELS } from "@/lib/leadSchema";
import { HERO_SLIDES } from "@/lib/heroSlides";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WHATSAPP_URL =
  "https://wa.me/56995336140?text=Hola,%20necesito%20hablar%20con%20un%20abogado.";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);

  const goToSection = useSectionNav();
  const { setActiveSlide, scrollToHero } = useHeroCarousel();

  // Funciona igual desde el home que desde /blog o las páginas legales.
  const scrollTo = (id: string) => {
    goToSection(id);
    setIsMenuOpen(false);
  };

  // Navegar a un slide específico del hero
  const goToSlide = (slideIndex: number) => {
    setActiveSlide(slideIndex);
    scrollToHero();
    setIsCaseDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card-soft">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
         <img
  src="/logo.png"
  alt="Arteaga & Aldunate"
  className="
    h-12
    sm:h-14
    md:h-16
    lg:h-20
    max-w-[160px]
    sm:max-w-[200px]
    md:max-w-[220px]
    lg:max-w-xs
    w-auto
    object-contain
    cursor-pointer
    transition-all duration-200
  "
  style={{
    maxWidth: 'clamp(80px, 20vw, 220px)',
    height: 'auto',
  }}
  onClick={() => scrollTo('hero')}
/>

    {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => scrollTo("hero")}
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              INICIO
            </button>

            {/* Case Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-body text-sm font-medium">
                    ¿CUÁL ES TU CASO?
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[630px] grid-cols-3 gap-1 p-3">
                      {HERO_SLIDES.map((slide, idx) => (
                        <li key={slide.id}>
                          <button
                            onClick={() => goToSlide(idx)}
                            className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-legal-primary/5 hover:text-legal-primary transition-colors flex items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={slide.icon}
                              className="w-4 h-4 text-legal-primary"
                            />
                            <span className="font-body text-sm">{slide.eyebrow}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <button
              onClick={() => scrollTo("nosotros")}
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              NOSOTROS
            </button>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-body text-sm font-medium">
                    ÁREAS DE PRÁCTICA
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] grid-cols-2 gap-1 p-3">
                      {AREAS.map((a) => (
                        <li key={a}>
                          <button
                            onClick={() => {
                              // Abre esa área concreta, no solo la sección.
                              focusArea(a);
                              scrollTo("areas");
                            }}
                            className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-legal-primary/5 hover:text-legal-primary"
                          >
                            {AREA_LABELS[a]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <button
              onClick={() => scrollTo("equipo")}
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              EQUIPO
            </button>
            <Link
              to="/blog"
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              BLOG
            </Link>
            <Link
              to="/documentos"
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              DOCUMENTOS
            </Link>
            <button
              onClick={() => scrollTo("contacto")}
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              CONTACTO
            </button>
          </nav>

          {/* Contact Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-2 sm:ml-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2.5 bg-legal-primary text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-full text-sm lg:text-base font-semibold hover:bg-legal-primary/90 transition whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> Habla con un abogado
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-legal-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <nav className="py-4 space-y-2">
              <button
                onClick={() => scrollTo("hero")}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Inicio
              </button>

              {/* Mobile Case Dropdown */}
              <div>
                <button
                  onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
                  className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  ¿CUÁL ES TU CASO?
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isCaseDropdownOpen ? "rotate-180" : ""
                  }`} />
                </button>
                {isCaseDropdownOpen && (
                  <div className="bg-gray-50 border-t border-border">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => goToSlide(idx)}
                        className="block w-full text-left px-8 py-2.5 font-body text-sm text-foreground hover:text-legal-primary hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <FontAwesomeIcon
                          icon={slide.icon}
                          className="w-4 h-4 text-legal-primary"
                        />
                        <span>{slide.eyebrow}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollTo("nosotros")}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Nosotros
              </button>
              <button
                onClick={() => scrollTo("areas")}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Áreas de Práctica
              </button>
              <button
                onClick={() => scrollTo("equipo")}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Equipo
              </button>
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                to="/documentos"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Documentos
              </Link>
              <button
                onClick={() => scrollTo("contacto")}
                className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
              >
                Contacto
              </button>
              <div className="px-4 pt-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-legal-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-legal-primary/90 transition"
                >
                  <Phone className="w-4 h-4" /> Habla con un abogado
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
