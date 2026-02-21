import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const logos = [
  { name: "Yoco" },
  { name: "SweepSouth" },
  { name: "Takealot" },
  { name: "Shoprite" },
  { name: "Discovery" },
];

const testimonials = [
  {
    quote: "Support Studio brought structure to our internal operations faster than any agency we've worked with. Practical, responsive, and deeply reliable.",
    name: "Sarah M.",
    role: "Operations Manager",
    company: "Fintech Startup",
    metric: "40% time saved on admin",
  },
  {
    quote: "They helped us move from reactive to structured within weeks. The difference in our day-to-day operations was immediate.",
    name: "James K.",
    role: "Founder & CEO",
    company: "E-commerce Brand",
    metric: "3x faster onboarding",
  },
  {
    quote: "A dependable operational partner for fast-moving teams. Their understanding of the South African business landscape is a real advantage.",
    name: "Thandi N.",
    role: "Programme Lead",
    company: "SME Development Organisation",
    metric: "18 SOPs documented",
  },
];

const caseSnapshots = [
  {
    client: "B2B SaaS Startup",
    before: "Founder doing all admin, sales, and ops manually",
    after: "Automated lead capture, onboarding flows, and weekly reporting in place within 6 weeks",
    service: "Automation + Operations",
  },
  {
    client: "E-commerce Brand",
    before: "Inconsistent social presence, no content calendar",
    after: "20+ posts/month across 3 platforms, 2x engagement in 90 days",
    service: "Digital Presence",
  },
  {
    client: "Professional Services Firm",
    before: "No structured pipeline, relying on referrals only",
    after: "25 qualified leads/month, 3 new retainer clients within first quarter",
    service: "Lead Engine",
  },
];

const industries = [
  "Technology & SaaS",
  "E-commerce & Retail",
  "Professional Services",
  "Financial Services",
  "Healthcare & Wellness",
  "Hospitality & Events",
  "Real Estate & Property",
  "Creative & Media",
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            RESULTS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Proof, not promises.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto"
          >
            Real companies. Real momentum.
          </motion.p>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 border-t border-divider">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.p
            {...fadeUp}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium text-center mb-10"
          >
            TRUSTED BY GROWING SOUTH AFRICAN BUSINESSES
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo, i) => (
              <motion.span
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-sm font-sans font-semibold tracking-wide text-muted-foreground/40 uppercase select-none"
              >
                {logo.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              TESTIMONIALS
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              What our clients say
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-secondary border-l-2 border-primary p-8 flex flex-col"
              >
                <Quote size={18} className="text-primary/30 mb-3" />
                <p className="text-sm leading-relaxed text-foreground flex-1">
                  "{t.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-divider">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  <p className="mt-2 text-xs font-medium text-primary">{t.metric}</p>
                </div>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Case Snapshots */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              CASE SNAPSHOTS
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Before → After
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseSnapshots.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-background border border-border p-8"
              >
                <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-primary">
                  {cs.service}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-foreground uppercase tracking-tight">
                  {cs.client}
                </h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">Before</span>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{cs.before}</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.15em] text-primary font-medium">After</span>
                    <p className="mt-1 text-sm text-foreground leading-relaxed">{cs.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              INDUSTRIES WE SERVE
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Built for operators across sectors
            </h2>
          </motion.div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {industries.map((ind, i) => (
              <motion.span
                key={ind}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="text-xs font-medium text-muted-foreground border border-border px-4 py-2 bg-secondary"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <motion.h2
            {...fadeUp}
            className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight"
          >
            Your results start here.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm text-primary-foreground/70"
          >
            Apply today and join the businesses already building with structure.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/apply">
              <Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">
                Apply for Access <ArrowRight size={14} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-[11px] tracking-[0.15em] uppercase px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Book a Call
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
