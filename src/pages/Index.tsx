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


const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <WhatsAppButton />
        <AboutSection/>
        <TeamSection/>
       <PracticeAreas/>  
        <ContactSection /> 
      </main>
      <Footer />
    </div>
  );
};

export default Index;