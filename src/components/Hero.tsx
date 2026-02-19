import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-16 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
          >
            Structure for the ones still building.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl"
          >
            Operational infrastructure that lets founders focus on growth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-10"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide px-8">
                Book a Free Discovery Call
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
