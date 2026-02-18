import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Credibility from "@/components/Credibility";
import ServicesPreview from "@/components/ServicesPreview";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Credibility />
      <ServicesPreview />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
