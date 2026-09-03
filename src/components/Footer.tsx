import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useSectionNav } from "@/hooks/use-section-nav";
import { openCookiePreferences } from "@/lib/cookies/preferencesBus";
import { ESTUDIO } from "@/lib/seo/estudio";

const WHATSAPP_URL = `https://wa.me/${ESTUDIO.telefono.replace("+", "")}?text=${encodeURIComponent(
  "Hola, necesito hablar con un abogado."
)}`;

/** lucide no trae TikTok; el trazo es el glifo oficial simplificado. */
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const ICONOS: Record<string, LucideIcon | typeof TikTokIcon> = {
  Instagram,
  LinkedIn: Linkedin,
  Facebook,
  TikTok: TikTokIcon,
};

const NAVEGACION = [
  { label: "Inicio", id: "hero" },
  { label: "Quiénes somos", id: "nosotros" },
  { label: "Áreas de práctica", id: "areas" },
  { label: "Equipo", id: "equipo" },
  { label: "Contacto", id: "contacto" },
] as const;

const RECURSOS = [
  { label: "Blog jurídico", to: "/blog" },
  { label: "Documentos y plantillas", to: "/documentos" },
] as const;

const LEGALES = [
  { label: "Privacidad", to: "/privacidad" },
  { label: "Términos", to: "/terminos" },
  { label: "Cookies", to: "/cookies" },
] as const;

const enlace =
  "font-body text-sm text-gray-300 hover:text-white transition-colors duration-200";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Funciona igual desde el home que desde /blog o las páginas legales.
  const scrollToSection = useSectionNav();

  return (
    <footer className="bg-legal-dark text-white">
      <div className="max-w-7xl mx-auto container-padding">
        {/*
          4 columnas en lg; en tablet la marca ocupa el ancho y las otras tres
          van en fila; en móvil todo apilado pero con la marca compacta (logo
          de 64px, no 176px) para no gastar una pantalla entera en el footer.
        */}
        <div className="py-12 lg:py-16 grid gap-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8">
          {/* Marca */}
          <div className="sm:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block" aria-label="Ir al inicio">
              <img
                src="/logo_blanco.png"
                alt="Arteaga & Aldunate Abogados y Asociados"
                width={240}
                height={120}
                loading="lazy"
                className="h-16 lg:h-20 w-auto object-contain"
              />
            </Link>
            <p className="font-body text-sm text-gray-300 leading-relaxed mt-5 max-w-md">
              Estudio jurídico con sede en Santiago y atención en todo Chile.
              Asesoramos y representamos a personas y empresas en materias
              penales, civiles, laborales, de familia, inmobiliarias,
              corporativas y tributarias.
            </p>

            <div className="flex items-center gap-3 mt-6">
              {ESTUDIO.redes.map(({ nombre, url }) => {
                const Icon = ICONOS[nombre];
                return (
                  <a
                    key={nombre}
                    href={url}
                    aria-label={`${nombre} de Arteaga & Aldunate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-legal-primary hover:bg-legal-primary/20 transition-colors"
                  >
                    {Icon && <Icon className="w-[18px] h-[18px]" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* En móvil Navegación y Recursos comparten fila; desde sm el
              wrapper desaparece (contents) y cada nav ocupa su columna. */}
          <div className="grid grid-cols-2 gap-6 sm:contents">
          {/* Navegación */}
          <nav aria-label="Secciones del sitio">
            <h4 className="font-heading text-base font-bold mb-5">Navegación</h4>
            <ul className="space-y-3">
              {NAVEGACION.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={enlace}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Recursos */}
          <nav aria-label="Recursos">
            <h4 className="font-heading text-base font-bold mb-5">Recursos</h4>
            <ul className="space-y-3">
              {RECURSOS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={enlace}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-heading text-base font-bold mb-5">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${ESTUDIO.telefono}`} className={`${enlace} flex items-center gap-3`}>
                  <Phone className="w-4 h-4 text-legal-primary shrink-0" />
                  +56 9 9533 6140
                </a>
              </li>
              <li>
                <a href={`mailto:${ESTUDIO.email}`} className={`${enlace} flex items-center gap-3 break-all`}>
                  <Mail className="w-4 h-4 text-legal-primary shrink-0" />
                  {ESTUDIO.email}
                </a>
              </li>
              <li className={`${enlace} flex items-start gap-3`}>
                <MapPin className="w-4 h-4 text-legal-primary shrink-0 mt-0.5" />
                <span>
                  {ESTUDIO.direccion.calle}
                  <br />
                  {ESTUDIO.direccion.ciudad}, Chile
                </span>
              </li>
              <li className={`${enlace} flex items-start gap-3`}>
                <Clock className="w-4 h-4 text-legal-primary shrink-0 mt-0.5" />
                <span>
                  Lun a vie, 9:00 a 18:00
                  <br />
                  <span className="text-legal-primary">Urgencias penales 24/7</span>
                </span>
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-legal-primary px-4 py-2.5 font-body text-sm font-semibold text-white hover:bg-legal-primary/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        {/* Pie */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-body text-xs text-gray-400">
            © {currentYear} {ESTUDIO.nombre}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-xs text-gray-400">
            {LEGALES.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
            {/* Obligatorio poder cambiar de opinión: sin esta puerta, quien
                rechazó o aceptó queda atrapado en su decisión. */}
            <button
              type="button"
              onClick={openCookiePreferences}
              className="rounded-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-legal-primary"
            >
              Preferencias de cookies
            </button>
          </div>
        </div>

        <p className="pb-6 font-body text-[11px] leading-relaxed text-gray-500 text-center max-w-3xl mx-auto">
          La información de este sitio es de carácter informativo y no
          constituye asesoría jurídica. Para tu caso concreto, contáctanos
          directamente.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
