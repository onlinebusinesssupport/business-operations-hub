import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ArrowRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tiers = [
  {
    name: "Foundation",
    price: "R3,000",
    frequency: "/ month",
    features: [
      "6 posts",
      "2 platforms",
      "Monthly snapshot report",
    ],
  },
  {
    name: "Momentum",
    price: "R6,500",
    frequency: "/ month",
    highlight: true,
    badge: "Most Chosen",
    features: [
      "12 posts",
      "2–3 platforms",
      "Engagement management",
      "Monthly insights",
      "Content calendar",
    ],
  },
  {
    name: "Authority",
    price: "R11,500",
    frequency: "/ month",
    features: [
      "20+ posts",
      "Multi-platform",
      "Inbox management",
      "Dashboard reporting",
      "Quarterly strategy session",
    ],
  },
  {
    name: "Signal",
    price: "R22,000",
    frequency: "/ month",
    features: [
      "Executive positioning",
      "Thought leadership narrative",
      "Advanced strategy",
      "Monthly strategic advisory call",
    ],
  },
];

const whatWeDo = [
  "Platform strategy",
  "Content planning and narrative mapping",
  "Caption writing and design",
  "Engagement management",
  "Performance tracking",
  "Continuous testing and optimisation",
];

const outcomes = [
  "Increased engagement rate",
  "Improved content consistency",
  "Audience growth",
  "Clear brand positioning",
  "Monthly performance reports",
];

const idealFor = [
  "Solopreneurs building credibility",
  "Coaches and consultants scaling visibility",
  "Small teams without in-house marketing",
  "Founders tired of inconsistent posting",
];

const DigitalPresence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }} className="flex items-center gap-3 mb-6">
            <MessageCircle size={22} className="text-primary" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">SOCIAL MEDIA MANAGEMENT</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: easeOut }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight">
            Digital Presence
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: easeOut }} className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            Your brand is speaking every day. We make sure it says the right things.
          </motion.p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">Who This Is For</h2>
          <ul className="mt-6 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What We Actually Do */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">What We Actually Do</h2>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            We treat social media as a strategic communications system, not a posting calendar.
          </p>
          <ul className="mt-6 space-y-3">
            {whatWeDo.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Measurable Outcomes */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-tight">Measurable Outcomes</h2>
          <ul className="mt-6 space-y-3">
            {outcomes.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2} />{d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight text-center">Packages</h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {tiers.map((tier, i) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
                className={`relative flex flex-col border p-8 md:p-10 ${tier.highlight ? "border-primary bg-primary/[0.03] shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.12)]" : "border-border bg-background"}`}
              >
                {tier.badge && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.15em] font-medium text-primary bg-accent px-2 py-0.5">
                    {tier.badge}
                  </span>
                )}
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
                      Activate Digital Presence <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">Activate Digital Presence</h2>
          <p className="mt-4 text-sm text-primary-foreground/70">Your brand deserves more than silence. Let's build a presence that compounds.</p>
          <div className="mt-8">
            <Link to="/apply"><Button size="lg" variant="secondary" className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2">Activate This Studio <ArrowRight size={14} /></Button></Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Clarity builds momentum. Systems build freedom. SUPPORT STUDIO™ builds both.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DigitalPresence;
