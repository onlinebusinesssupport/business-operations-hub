import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium"
          >
            OPERATIONAL SUPPORT
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-foreground"
          >
            Support for businesses building beyond survival.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl"
          >
            We help South African founders and teams build structure through systems,
            operational support, and real execution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            className="mt-10 flex gap-4"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide">
                Work With Us
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="text-sm tracking-wide">
                View Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
