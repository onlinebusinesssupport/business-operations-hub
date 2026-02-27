import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Reach Out",
    description:
      "Tell us a little about you. Fill out our quick support form and give us a glimpse of your business, your goals, and what's weighing on you right now. We'll make sure it's a good fit before moving forward.",
    detail:
      "It takes less than 5 minutes. No commitment required.",
  },
  {
    number: "02",
    title: "Let's Talk (Or Not!)",
    description:
      "You choose: discovery call or no-pressure email. Whether you prefer to talk it out or type it up, we'll get to know your needs and explore how our team can support your next phase — calmly and strategically.",
    detail:
      "We meet you where you're comfortable. No hard sell, ever.",
  },
  {
    number: "03",
    title: "Game Plan",
    description:
      "We'll take what we've learned, noodle on it some, and then develop a proposal tailored to meet your specific needs. We'll keep your goals and big vision in mind too!",
    detail:
      "Every proposal is custom-built. No cookie-cutter packages.",
  },
  {
    number: "04",
    title: "We Get to Work",
    description:
      "Once the proposal is approved, we will send you an agreement and invoice. After those boxes are checked, we'll start working our magic. We'll start with an assessment or audit first.",
    detail:
      "Most clients are fully onboarded within 5 business days.",
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
            From first contact to full execution — here is exactly how an engagement with The Business Support Studio works.
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
                  <span className="text-xs font-sans tracking-widest text-terracotta uppercase">
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
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-medium leading-snug">
              Ready to get started?
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed opacity-70">
              Fill out our quick form. It takes less than 5 minutes and costs nothing.
            </p>
            <div className="mt-8">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="text-sm tracking-wide">
                  Let's Partner
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
