import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

type BillingCycle = "monthly" | "quarterly";

interface Plan {
  name: string;
  description: string;
  monthly: string;
  quarterly: string;
  savings?: string;
  studios: string;
  features: string[];
  highlight?: boolean;
  label?: string;
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    description: "One Studio, fully activated. For founders ready to delegate one critical function.",
    monthly: "R6,500",
    quarterly: "R5,500",
    savings: "Save R3k/quarter",
    studios: "1 Studio",
    features: [
      "Choose any two Studios",
      "Dedicated operator assigned",
      "Weekly progress reports",
      "Client portal access",
      "Async communication via portal",
    ],
    cta: "Start with one Studio",
  },
  {
    name: "Growth",
    description: "Three Studios working together. For businesses building real operational infrastructure.",
    monthly: "R15,000",
    quarterly: "R12,500",
    savings: "Save R7.5k/quarter",
    studios: "3 Studios",
    highlight: true,
    label: "Most Popular",
    features: [
      "Choose any 3 Studios",
      "Cross-studio coordination",
      "Bi-weekly strategy calls",
      "Priority request handling",
      "Monthly performance dashboard",
      "Automation & workflow design",
    ],
    cta: "Activate Growth",
  },
  {
    name: "Studio Suite",
    description: "All six Studios, fully integrated. The complete operational backbone for scaling businesses.",
    monthly: "R28,000",
    quarterly: "R24,000",
    savings: "Save R12k/quarter",
    studios: "All 6 Studios",
    features: [
      "All Studios activated",
      "Dedicated account lead",
      "Weekly strategy sessions",
      "Custom reporting & KPIs",
      "Strategic advisory included",
      "SLA-backed response times",
      "Quarterly business review",
    ],
    cta: "Go all in",
  },
];

const addOns = [
  { name: "Additional Studio", price: "R4,500/mo", note: "Add to any plan" },
  { name: "Strategy Sprint", price: "R8,000", note: "Once-off deep dive" },
  { name: "Systems Setup", price: "From R5,000", note: "CRM, workspace, tooling" },
  { name: "Event Production", price: "Custom quote", note: "Per event" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const Pricing = () => {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

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
            PRICING
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Invest in structure.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto"
          >
            Transparent pricing. No retainer surprises. Choose the Studios you need, scale when you're ready.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 inline-flex items-center border border-border p-1 gap-0"
          >
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("quarterly")}
              className={`px-5 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 flex items-center gap-1.5 ${
                billing === "quarterly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quarterly
              <Zap size={10} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
                className={`relative flex flex-col border p-8 md:p-10 transition-all duration-200 ${
                  plan.highlight
                    ? "border-primary bg-primary/[0.03] shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.12)]"
                    : "border-border bg-background"
                }`}
              >
                {/* Label */}
                {plan.label && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.15em] font-medium text-primary bg-accent px-2 py-0.5">
                    {plan.label}
                  </span>
                )}

                {/* Studio count */}
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  {plan.studios}
                </span>

                <h3 className="mt-3 font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                  {plan.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {billing === "monthly" ? plan.monthly : plan.quarterly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                {billing === "quarterly" && plan.savings && (
                  <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.1em] text-primary font-medium">
                    {plan.savings}
                  </span>
                )}

                {/* Divider */}
                <div className="mt-6 h-px bg-border" />

                {/* Features */}
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Link to="/apply">
                    <Button
                      className={`w-full text-[11px] tracking-[0.15em] uppercase gap-2 ${
                        plan.highlight ? "" : "variant-outline"
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              ADD-ONS
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Extend your engagement.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Available alongside any plan — or as standalone services.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border border-border bg-background p-6"
              >
                <h3 className="font-display text-sm font-bold tracking-tight text-foreground uppercase">
                  {addon.name}
                </h3>
                <p className="mt-2 text-lg font-display font-bold text-foreground">
                  {addon.price}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{addon.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Objection Handling */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              COMMON QUESTIONS
            </span>
            <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Before you decide.
            </h2>
          </motion.div>

          <div className="mt-12 space-y-0 divide-y divide-border">
            {[
              {
                q: "Can I switch Studios mid-engagement?",
                a: "Yes. Studios can be swapped at the start of any new billing cycle. We'll help you transition smoothly.",
              },
              {
                q: "What's included in the client portal?",
                a: "Real-time progress tracking, document management, request submission, financial overview, and direct communication with your operator.",
              },
              {
                q: "Is there a minimum commitment?",
                a: "Monthly plans are month-to-month. Quarterly plans lock in for 3 months at a reduced rate. No annual contracts required.",
              },
              {
                q: "How quickly can we get started?",
                a: "Most clients are onboarded within 5 business days. We assess your needs, assign your team, and begin execution immediately.",
              },
              {
                q: "What if I need more than the Studio Suite?",
                a: "We offer custom enterprise engagements for businesses with complex operational needs. Contact us for a tailored proposal.",
              },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="py-6"
              >
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wide">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
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
            Structure doesn't cost. It compounds.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-sm text-primary-foreground/70"
          >
            Apply today and we'll match you with the right Studios for your stage.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/apply">
              <Button
                size="lg"
                variant="secondary"
                className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2"
              >
                Apply for Access
                <ArrowRight size={14} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-[11px] tracking-[0.15em] uppercase px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
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
