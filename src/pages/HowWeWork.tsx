import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Reach Out",
    description: "Tell us where you're stuck. One message starts everything.",
    detail: "Email, form, or DM — pick what works. No sales pitch, no pressure.",
  },
  {
    number: "02",
    title: "Discovery",
    description: "We meet on your terms — 30-minute call or written brief.",
    detail: "We listen. We ask sharp questions. We understand your context.",
  },
  {
    number: "03",
    title: "Proposal",
    description: "You receive a precise, no-surprises plan with clear investment ranges.",
    detail: "Every proposal is custom-built. No cookie-cutter packages.",
  },
  {
    number: "04",
    title: "Execution",
    description: "Your private studio activates. Work begins. You stay in control.",
    detail: "Most clients are fully onboarded within 5 business days.",
  },
];

const principles = [
  {
    title: "Structured, not reactive",
    description: "Every engagement follows a defined process. We do not operate on ad-hoc requests without context.",
  },
  {
    title: "Transparent reporting",
    description: "You will always know what has been done, what is in progress, and what is planned. No black boxes.",
  },
  {
    title: "Founder-first approach",
    description: "We understand the realities of building a business in South Africa. Our support is designed around those realities.",
  },
  {
    title: "Systems over effort",
    description: "We build repeatable systems that reduce dependency on individuals. Structure outlasts hustle.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const HowWeWork = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.span
            {...fadeUp}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium"
          >
            PROCESS
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
          >
            From stuck to structured.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Four steps. No guesswork. No pressure. Just clarity — from first contact to full execution.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-[0.1em] uppercase gap-2">
                Start a Conversation
                <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="space-y-0 divide-y divide-divider">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12"
              >
                <div className="md:col-span-2">
                  <span className="text-xs font-sans tracking-widest text-primary uppercase">
                    {step.number}
                  </span>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl">
                    {step.description}
                  </p>
                  <p className="mt-3 text-sm text-foreground/60 italic">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signal */}
      <section className="py-12 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Proudly built in Johannesburg • Trusted by founders at Yoco, SweepSouth, Takealot-scale businesses.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              PRINCIPLES
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
              How we operate.
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-background p-8 md:p-10"
              >
                <h3 className="font-display text-lg font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
              Ready to get started?
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed opacity-70">
              Start a conversation. No pressure. No obligation. Just clarity.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="text-sm tracking-[0.1em] uppercase gap-2">
                  Start a Conversation
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost" size="lg" className="text-sm tracking-[0.1em] uppercase text-background/70 hover:text-background hover:bg-background/10">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowWeWork;
