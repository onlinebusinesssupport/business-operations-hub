import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tiers = [
  {
    name: "Core Support",
    price: "From R6,000",
    frequency: "/ month",
    features: [
      "Inbox + calendar management",
      "Admin coordination",
      "Weekly check-ins",
    ],
  },
  {
    name: "Executive Support",
    price: "From R12,500",
    frequency: "/ month",
    highlight: true,
    features: [
      "Priority support",
      "Stakeholder coordination",
      "Research + reporting",
    ],
  },
  {
    name: "Chief of Staff Lite",
    price: "From R25,000",
    frequency: "/ month",
    features: [
      "Strategic execution support",
      "Multi-project coordination",
      "Founder enablement",
    ],
  },
];

const deliverables = [
  "Inbox and calendar governance",
  "Meeting preparation and follow-ups",
  "Administrative coordination",
  "Stakeholder communication",
  "Research, reporting, and documentation",
];

const idealFor = [
  "Founders drowning in admin",
  "Executives who need high-trust operational support",
  "Growing teams that need structured coordination",
];

const OperationsService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }} className="flex items-center gap-3 mb-6">
            <Layers size={22} className="text-primary" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">EXECUTIVE VIRTUAL SUPPORT</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: easeOut }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight">
            Operations
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOut }} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            High-trust operational support for busy operators.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">What We Do</h2>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            Premium virtual support, not generic VA work. We provide structured, high-trust operational assistance that lets you focus on what matters most — growing your business.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight text-center">Packages</h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
                className={`relative flex flex-col border p-8 md:p-10 ${tier.highlight ? "border-primary bg-primary/[0.03] shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.12)]" : "border-border bg-background"}`}
              >
                {tier.highlight && <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.15em] font-medium text-primary bg-accent px-2 py-0.5">Popular</span>}
                <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">{tier.name}</h3>
                <div className="mt-4">
                  <span className="font-display text-3xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.frequency}</span>
                </div>
                <div className="mt-6 h-px bg-border" />
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/apply">
                    <Button className="w-full text-[11px] tracking-[0.15em] uppercase gap-2" variant={tier.highlight ? "default" : "outline"}>
                      Add operational support <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-tight">What's Included</h2>
          <ul className="mt-6 space-y-3">
            {deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-tight">Who This Is For</h2>
          <ul className="mt-6 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Ready for operational support?</h2>
          <p className="mt-4 text-sm text-primary-foreground/70">Apply today and get matched with a dedicated operations specialist.</p>
          <div className="mt-8">
            <Link to="/apply"><Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">Add operational support <ArrowRight size={14} /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OperationsService;
