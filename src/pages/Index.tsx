import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PracticeAreas from "@/components/PracticeAreas";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Seo from "@/components/Seo";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

const Index = () => {
  useScrollToHash();

  return (
    <div className="min-h-screen">
      <Seo
        title="Abogados en Chile"
        description="Estudio jurídico chileno con defensa penal, laboral, civil, de familia, corporativa y tributaria. Asesoría clara y estrategia desde la primera reunión."
        path="/"
      />
      <Header />
      <main>
        <HeroSection />
        <PracticeAreas />
        <AboutSection />
        <TeamSection />
        <WhyChooseUs />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
