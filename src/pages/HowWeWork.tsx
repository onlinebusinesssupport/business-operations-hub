import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Discovery Consultation",
    description:
      "We begin with a structured conversation to understand your business model, team structure, current pain points, and operational priorities. This is not a sales pitch — it is a working session.",
    detail:
      "You walk away with clarity on what support you need, even if you choose not to work with us.",
  },
  {
    number: "02",
    title: "Proposal & Scope",
    description:
      "Based on the discovery session, we prepare a tailored scope of work with clear deliverables, timelines, and pricing. No ambiguity, no hidden costs.",
    detail:
      "We recommend a starting engagement and scale from there based on results.",
  },
  {
    number: "03",
    title: "Onboarding & Setup",
    description:
      "Your dedicated client portal is configured with the tools, systems, and reporting structure tailored to your operations. We set up communication channels and establish working rhythms.",
    detail:
      "Most clients are fully onboarded within 5 business days.",
  },
  {
    number: "04",
    title: "Ongoing Execution",
    description:
      "We deliver consistent, reliable execution across your operational priorities — week after week. Progress is tracked through your portal with transparent reporting and regular check-ins.",
    detail:
      "You maintain full visibility without needing to manage the work.",
  },
  {
    number: "05",
    title: "Review & Scale",
    description:
      "Monthly reviews ensure the support remains aligned with your evolving business needs. As your business grows, we adapt systems, processes, and team allocation accordingly.",
    detail:
      "Support Studio scales with you — from solo founder to full operational team.",
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
            className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground"
          >
            A clear process. No guesswork.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            We believe operational support should be structured from the first conversation.
            Here is exactly how an engagement with Support Studio works.
          </motion.p>
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
                  <span className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                    {step.number}
                  </span>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
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

      {/* Principles */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              PRINCIPLES
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
              How we operate
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
                <h3 className="font-serif text-lg font-medium text-foreground">
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
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-medium leading-snug">
              Ready to get started?
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed opacity-70">
              Book a discovery consultation. It takes 30 minutes and costs nothing.
            </p>
            <div className="mt-8">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="text-sm tracking-wide">
                  Book a Consultation
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
