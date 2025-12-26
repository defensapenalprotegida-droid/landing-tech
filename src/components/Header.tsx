import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Scale, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: "Inicio", id: "inicio" },
    { label: "Servicios", id: "servicios" },
    { label: "Enfoque", id: "enfoque" },
    { label: "Equipo", id: "equipo" },
    { label: "Contacto", id: "contacto" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card-soft">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
         <img
  src="/logo.png"
  alt="Defensa Penal Protegida"
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
  onClick={() => scrollToSection('inicio')}
/>

    {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-body text-sm font-medium text-foreground hover:text-legal-primary transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="legal"
              size="lg"
              className="hidden sm:flex"
              onClick={() => scrollToSection("contacto")}
            >
              <Phone className="w-4 h-4" />
              Contactar
            </Button>
            
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 font-body text-base text-foreground hover:text-legal-primary hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  variant="legal"
                  size="lg"
                  className="w-full"
                  onClick={() => scrollToSection("contacto")}
                >
                  <Phone className="w-4 h-4" />
                  Contactar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;