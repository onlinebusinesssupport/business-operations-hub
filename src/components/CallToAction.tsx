import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/50 font-medium">
            GET STARTED
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[1.1]">
            Operate better. Grow faster. Stay focused.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-primary-foreground/70 max-w-lg">
            We work with a limited number of partners at any given time. 
            If you're building something serious, apply to explore whether the Studio model is the right support layer for your growth.
          </p>
          <div className="mt-10">
            <Link to="/apply">
              <Button
                size="lg"
                variant="outline"
                className="text-sm tracking-[0.1em] uppercase px-8 gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Enter the Studio
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
