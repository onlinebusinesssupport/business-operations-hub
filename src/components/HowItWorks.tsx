import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    label: "REACH OUT",
    description:
      "Tell us where you're stuck. One message starts everything.",
  },
  {
    label: "DISCOVERY",
    description:
      "We meet on your terms — 30-minute call or written brief.",
  },
  {
    label: "PROPOSAL",
    description:
      "You receive a precise, no-surprises plan with clear investment ranges.",
  },
  {
    label: "EXECUTION",
    description:
      "Your private studio activates. Work begins. You stay in control.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-28 border-t border-divider">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
            PROCESS
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
            From stuck to structured.
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-lg">
            Four steps. No guesswork. No pressure. Just clarity.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative p-8 border border-border"
            >
              <span className="text-[11px] tracking-[0.2em] text-muted-foreground/60 font-medium">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-[0.1em] text-foreground">
                {step.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <ArrowRight
                  size={16}
                  className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-primary"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust Signal */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60"
        >
          Proudly built in Johannesburg • Trusted by founders at Yoco, SweepSouth, Takealot-scale businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link to="/contact">
            <Button size="lg" className="text-sm tracking-[0.1em] uppercase px-8 gap-2">
              Start a Conversation
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
