import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    label: "LET'S TALK",
    description:
      "You choose: discovery call or no-pressure email. Whether you prefer to talk it out or type it up, we'll get to know your needs and explore how our team can support your next phase — calmly and strategically.",
  },
  {
    label: "GAME PLAN",
    description:
      "We'll take what we've learned, noodle on it some, and then develop a proposal tailored to meet your specific needs. We'll keep your goals and big vision in mind too!",
  },
  {
    label: "WE GET TO WORK",
    description:
      "Once the proposal is approved, we will send you an agreement and invoice. After those boxes are checked, we'll start working our magic. We'll start with an assessment or audit first.",
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
            How It Works
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-lg">
            A clear path from first contact to full execution. No guesswork, no pressure.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-0">
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
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
