import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeroCarouselProvider } from "@/contexts/HeroCarouselContext";

const queryClient = new QueryClient();

// vite-react-ssg monta el router y el HelmetProvider; aquí solo van los
// providers propios de la app.
const Layout = () => (
  <QueryClientProvider client={queryClient}>
    <HeroCarouselProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </HeroCarouselProvider>
  </QueryClientProvider>
);

export default Layout;
