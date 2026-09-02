import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { useSectionNav } from "@/hooks/use-section-nav";
import { openCookiePreferences } from "@/lib/cookies/preferencesBus";

// TODO: reemplazar por las URLs reales de las redes del estudio.
const SOCIALS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Facebook", href: "#", Icon: Facebook },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Funciona igual desde el home que desde /blog o las páginas legales.
  const scrollToSection = useSectionNav();

  return (
    <footer className="bg-legal-dark text-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
               <img
  src="/logo_blanco.png"
  alt="Defensa legal"
  className="max-h-44 w-auto object-contain"
/>

          
            </div>
            
            <p className="font-body text-gray-300 leading-relaxed mb-6 max-w-md">
              Estudio jurídico de servicios legales integrales, con sede en Santiago y
              atención en todo Chile. Asesoramos y representamos a personas y empresas
              en materias penales, civiles, laborales, familiares, inmobiliarias,
              corporativas y tributarias.
            </p>
            
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-legal-primary" />
                <span className="font-body text-gray-300">+56 9 9533 6140</span>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                <Mail  className="w-5 h-5 text-legal-primary" />
                 <span className="font-body text-gray-300">abogados@arteagayaldunate.cl</span>
                 </div>
             </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-legal-primary" />
                <span className="font-body text-gray-300">Bombero Salas 1369, of. 701, Santiago</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-legal-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <nav className="space-y-3">
              {[
                { label: "Inicio", id: "hero" },
                { label: "Quiénes somos", id: "nosotros" },
                { label: "Áreas de práctica", id: "areas" },
                { label: "Equipo", id: "equipo" },
                { label: "Contacto", id: "contacto" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block font-body text-gray-300 hover:text-legal-primary transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Contacto</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-legal-primary" />
                  <span className="font-body text-sm font-medium text-gray-200">Horarios</span>
                </div>
                <div className="font-body text-sm text-gray-300 space-y-1">
                  <p>Lun - Vie: 9:00 - 18:00</p>
                  <p className="text-legal-primary">Emergencias: 24/7</p>
                </div>
              </div>
              
              <div className="bg-legal-primary/10 p-4 rounded-lg">
                <h5 className="font-body text-sm font-bold text-legal-primary mb-2">
                  Atención de Emergencia
                </h5>
                <p className="font-body text-xs text-gray-300">
                  Si has sido detenido o citado, contáctanos inmediatamente por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-body text-sm text-gray-400">
              © {currentYear} Arteaga y Aldunate | Abogados & Asociados. Todos los derechos reservados.
            </div>
            
            {/* flex-wrap: con cuatro enlaces ya no caben en una línea en
                móvil y sin esto se salían del contenedor. */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-sm text-gray-400">
              <Link
                to="/documentos"
                className="hover:text-legal-primary transition-colors"
              >
                Documentos
              </Link>
              <Link
                to="/privacidad"
                className="hover:text-legal-primary transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terminos"
                className="hover:text-legal-primary transition-colors"
              >
                Términos de Servicio
              </Link>
              <Link
                to="/cookies"
                className="hover:text-legal-primary transition-colors"
              >
                Política de Cookies
              </Link>
              {/* Obligatorio poder cambiar de opinión: sin esta puerta, quien
                  rechazó o aceptó queda atrapado en su decisión. */}
              <button
                type="button"
                onClick={openCookiePreferences}
                className="rounded-sm hover:text-legal-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-legal-primary"
              >
                Preferencias de cookies
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="font-body text-xs text-gray-500 text-center max-w-4xl mx-auto">
              <strong>Aviso Legal:</strong> La información contenida en este sitio web tiene carácter meramente informativo 
              y no constituye asesoramiento jurídico. Para obtener asesoramiento específico sobre su caso, 
              es necesario contactar directamente con nuestro estudio jurídico.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;