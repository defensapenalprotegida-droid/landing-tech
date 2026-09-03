import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PracticeAreas from "@/components/PracticeAreas";
import DocumentsDownload from "@/components/DocumentsDownload";
import WhyChooseUs from "@/components/WhyChooseUs";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import SocialFeedSection from "@/components/SocialFeedSection";
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
        description="Estudio jurídico en Santiago con atención en derecho penal, civil, laboral, de familia, corporativo, inmobiliario y tributario. Evaluamos tu caso sin costo."
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
        <DocumentsDownload />
        <SocialFeedSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
