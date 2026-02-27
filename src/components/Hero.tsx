import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center pt-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            BUSINESS ENABLEMENT
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground uppercase"
          >
            Business support, reimagined.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-6 text-xl md:text-2xl font-display font-medium text-foreground/80"
          >
            The operating system behind modern founders.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl"
          >
            THE BUSINESS SUPPORT STUDIO combines operational support, digital brand management, and curated experiences into one intelligent platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/apply">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase px-8 gap-2">
                Enter the Studio
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="text-sm tracking-[0.1em] uppercase px-8">
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
