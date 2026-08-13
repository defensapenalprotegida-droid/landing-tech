import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CookieConsent from "@/components/cookies/CookieConsent";
import { initTracking } from "@/lib/cookies/trackingLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroCarouselProvider } from "@/contexts/HeroCarouselContext";
import JsonLd from "@/components/seo/JsonLd";
import { legalServiceSchema } from "@/lib/seo/schema/organizacion";

const queryClient = new QueryClient();

// vite-react-ssg monta el router y el HelmetProvider; aquí solo van los
// providers propios de la app.
const Layout = () => {
  // Arranca el consentimiento de cookies en cuanto hay cliente. Deja los
  // permisos de Google en `denied` y solo entonces aplica lo que la persona
  // haya decidido antes. No corre durante el prerender, que es justo lo que
  // queremos: ningún script de terceros debe salir en el HTML estático.
  useEffect(() => initTracking(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroCarouselProvider>
        <TooltipProvider>
          {/* La identidad del estudio se emite una vez para todo el sitio.
              El resto de los schemas la referencian por @id. */}
          <JsonLd schema={legalServiceSchema()} />
          <Toaster />
          <Sonner />
          <Outlet />
          <CookieConsent />
        </TooltipProvider>
      </HeroCarouselProvider>
    </QueryClientProvider>
  );
};

export default Layout;
