import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-foreground"
          >
            Business support that brings structure to how you operate.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl"
          >
            I work with founders and teams who need reliable operational support
            without hiring full-time infrastructure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="mt-10 flex gap-4"
          >
            <Button size="lg" className="text-sm tracking-wide">
              Book a Consultation
            </Button>
            <Button variant="outline" size="lg" className="text-sm tracking-wide">
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
