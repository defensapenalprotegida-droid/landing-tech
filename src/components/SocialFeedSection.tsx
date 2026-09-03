import { useEffect, useState } from "react";
import { Instagram, Linkedin, Facebook, Cookie } from "lucide-react";
import { ESTUDIO } from "@/lib/seo/estudio";
import { SOCIAL_FEED_WIDGET, socialFeedConfigured } from "@/lib/socialFeed";
import { hasConsent, subscribe } from "@/lib/cookies/consentService";
import { openCookiePreferences } from "@/lib/cookies/preferencesBus";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const ICONOS = {
  Instagram,
  LinkedIn: Linkedin,
  Facebook,
  TikTok: TikTokIcon,
} as const;

const HANDLES: Record<string, string> = {
  Instagram: "@abogados.arteagayaldunate.cl",
  TikTok: "@abogadosarteagayaldunate",
  LinkedIn: "Arteaga & Aldunate",
  Facebook: "Arteaga & Aldunate",
};

/**
 * Feed de redes sociales.
 *
 * El script del proveedor se inyecta solo con consentimiento de marketing y
 * solo una vez. Si la persona lo revoca después, el script ya cargado no se
 * puede "descargar"; la política de cookies cubre ese caso al recargar.
 */
const SocialFeedSection = () => {
  const configurado = socialFeedConfigured(SOCIAL_FEED_WIDGET);
  const [permitido, setPermitido] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (!configurado) return;
    return subscribe(() => setPermitido(hasConsent("marketing")));
  }, [configurado]);

  useEffect(() => {
    if (!configurado || !permitido || cargado) return;
    const script = document.createElement("script");
    script.src = SOCIAL_FEED_WIDGET.scriptSrc;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    setCargado(true);
  }, [configurado, permitido, cargado]);

  return (
    <section id="redes" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-12">
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Síguenos en redes
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Contenido legal claro, todas las semanas
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Explicamos en simple lo que pasa en tribunales, cambios legales y
            respuestas a las dudas más frecuentes.
          </p>
        </div>

        {configurado && permitido && (
          <div
            className="mb-12 min-h-[320px]"
            // El HTML viene de la configuración del sitio, no de usuarios.
            dangerouslySetInnerHTML={{ __html: SOCIAL_FEED_WIDGET.containerHtml }}
          />
        )}

        {configurado && !permitido && (
          <div className="mb-12 rounded-2xl border border-dashed border-border bg-card p-8 text-center max-w-2xl mx-auto">
            <Cookie className="w-8 h-8 text-primary mx-auto mb-4" />
            <p className="font-body text-foreground font-medium mb-2">
              Las publicaciones se cargan desde un servicio externo.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-5">
              Para verlas aquí necesitas aceptar las cookies de marketing. También
              puedes visitar nuestros perfiles directamente.
            </p>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Ajustar cookies
            </button>
          </div>
        )}

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ESTUDIO.redes.map(({ nombre, url }) => {
            const Icon = ICONOS[nombre as keyof typeof ICONOS];
            return (
              <li key={nombre}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-hover hover:-translate-y-1 hover:border-primary/40"
                >
                  <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {Icon && <Icon className="w-6 h-6" />}
                  </span>
                  <span className="font-heading font-bold text-foreground">{nombre}</span>
                  <span className="font-body text-xs text-muted-foreground text-center break-all">
                    {HANDLES[nombre]}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default SocialFeedSection;
