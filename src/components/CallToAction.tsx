import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-50 font-medium">
            GET STARTED
          </span>
          <h2 className="mt-6 font-serif text-2xl md:text-3xl font-medium leading-snug">
            Ready to build structure into your operations?
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed opacity-70">
            Book a consultation to discuss what operational support looks like for
            your business, or request access to the client portal.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/contact">
              <Button
                variant="secondary"
                size="lg"
                className="text-sm tracking-wide gap-2"
              >
                Book a Consultation
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="text-sm tracking-wide border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Request Access
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
