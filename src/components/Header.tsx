import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AREAS, AREA_LABELS } from "@/lib/leadSchema";
import { Menu, X, Phone } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/56995336140?text=Hola,%20necesito%20hablar%20con%20un%20abogado.";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card-soft">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
         <img
  src="/logo.png"
  alt="Arteaga & Aldunate "
  className="
    h-12
    sm:h-16
    md:h-24
    lg:h-40
    xl:h-48
    2xl:h-56
    w-auto
    max-w-full
    object-contain
    cursor-pointer
  "
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
                            onClick={() => scrollTo("areas")}
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
            <button
              onClick={() => scrollTo("contacto")}
              className="font-body text-sm font-medium hover:text-legal-primary"
            >
              CONTACTO
            </button>
          </nav>

          {/* Contact Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-legal-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-legal-primary/90 transition"
            >
              <Phone className="w-4 h-4" /> Habla con un abogado
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
