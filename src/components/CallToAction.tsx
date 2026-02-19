import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug">
            Ready to reclaim your time?
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed opacity-70">
            Let's discuss your operational challenges. Book a free discovery call — 30 minutes, no obligation.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="text-sm tracking-wide px-8"
              >
                Book a Free Discovery Call
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-sm tracking-wide border-background/30 text-background hover:bg-background/10 hover:text-background"
              >
                Schedule a consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
