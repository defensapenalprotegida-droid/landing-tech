import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ServicesSection from "@/components/ServicesSection";
import ApproachSection from "@/components/ApproachSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PracticeAreas from "@/components/PracticeAreas";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import Seo from "@/components/Seo";


const Index = () => {
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
        <TeamSection/>
        <WhatsAppButton />
        <AboutSection/>
       <PracticeAreas/>  
       <BlogSection/>
        <ContactSection /> 
      </main>
      <Footer />
    </div>
  );
};

export default Index;