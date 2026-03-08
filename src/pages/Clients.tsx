import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const industries = [
  {
    title: "Fintech & Financial Services",
    description: "Operational infrastructure for fast-moving financial technology companies scaling their teams and processes.",
  },
  {
    title: "E-commerce & Retail",
    description: "Systems enablement for online and hybrid retail businesses managing inventory, logistics, and customer operations.",
  },
  {
    title: "Professional Services",
    description: "Executive support for consultancies, agencies, and advisory firms that need structure without overhead.",
  },
  {
    title: "Social Impact & NGOs",
    description: "Grant readiness, donor reporting, and operational support for organisations doing meaningful work across Southern Africa.",
  },
  {
    title: "Startups & Scale-ups",
    description: "Founder operations support for early-stage and growth-stage companies moving from chaos to systems.",
  },
  {
    title: "SMEs & Township Enterprise",
    description: "Business formalisation, systems setup, and operational enablement for South African small and medium enterprises.",
  },
];

const stats = [
  { value: "50+", label: "Businesses supported" },
  { value: "3 years", label: "Operational experience" },
  { value: "98%", label: "Client retention rate" },
  { value: "5 days", label: "Average onboarding time" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Clients = () => {
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
            CLIENTS
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground"
          >
            Trusted by founders building real businesses.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            We work with South African businesses across industries — from early-stage startups
            to established enterprises seeking operational clarity.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-3xl md:text-4xl font-medium text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
              INDUSTRIES
            </span>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
              Sectors we serve
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              Our operational experience spans multiple industries, with a deep understanding
              of the South African business landscape.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-divider">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-secondary p-8 md:p-10"
              >
                <h3 className="font-serif text-lg font-medium text-foreground">
                  {ind.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {ind.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-serif text-2xl md:text-3xl font-medium text-foreground"
          >
            See how we can support your business
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Every engagement starts with a conversation. No pressure, no obligation.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-4 justify-center flex-wrap"
          >
            <Link to="/contact">
              <Button size="lg" className="text-sm tracking-wide gap-2">
                Start a Conversation
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="text-sm tracking-wide">
                View Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Clients;
