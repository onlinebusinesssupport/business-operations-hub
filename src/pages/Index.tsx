import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemStatement from "@/components/ProblemStatement";
import SolutionOverview from "@/components/SolutionOverview";
import ServiceTiers from "@/components/ServiceTiers";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProblemStatement />
      <SolutionOverview />
      <ServiceTiers />
      <Testimonials />
      <BlogPreview />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
