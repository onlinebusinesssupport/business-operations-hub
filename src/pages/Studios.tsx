import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layers,
  GitBranch,
  Radio,
  MessageCircle,
  Sparkles,
  Compass,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Studio {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  label?: string;
  hoverText: string;
  expanded: {
    poeticLine: string;
    description: string;
    includes: string[];
    idealFor: string[];
  };
}

const studios: Studio[] = [
  {
    id: "operations",
    name: "Operations",
    tagline: "The backbone of your business.",
    icon: Layers,
    label: "Foundational",
    hoverText:
      "Inbox, scheduling, admin workflows, and execution — handled with precision.",
    expanded: {
      poeticLine: "Structure is freedom.",
      description:
        "The Operations Studio builds the invisible infrastructure behind high-performing teams. From SOPs to task orchestration, this is where your business learns to run without you.",
      includes: [
        "Workflow design and process mapping",
        "SOP documentation and governance",
        "Task management systems",
        "Operational reporting cadence",
        "Team coordination infrastructure",
      ],
      idealFor: [
        "Founders scaling past 10 people",
        "Lean teams drowning in manual work",
        "Businesses preparing for investment",
      ],
    },
  },
  {
    id: "automation",
    name: "Automation",
    tagline: "Automate what slows you down.",
    icon: GitBranch,
    label: "Most Popular",
    hoverText:
      "Lead flows, CRM setup, and smart automations that scale with you.",
    expanded: {
      poeticLine: "Build once. Run forever.",
      description:
        "The Automation Studio eliminates repetitive work through intelligent pipelines. We connect your tools, trigger actions automatically, and give you time back.",
      includes: [
        "Custom automation pipelines",
        "Tool integration and API connections",
        "Trigger-based workflow orchestration",
        "Data sync across platforms",
        "Performance monitoring dashboards",
      ],
      idealFor: [
        "Teams doing the same task more than twice",
        "Ops-heavy businesses with manual handoffs",
        "Founders who value leverage over effort",
      ],
    },
  },
  {
    id: "lead-engine",
    name: "Lead Engine",
    tagline: "Predictable demand, engineered.",
    icon: Radio,
    hoverText:
      "From capture to conversion, structured pipelines that turn attention into revenue.",
    expanded: {
      poeticLine: "Attention is an asset. We compound it.",
      description:
        "The Lead Engine Studio builds and runs your demand infrastructure. Campaigns, funnels, and conversion tracking — all managed as a system, not a scramble.",
      includes: [
        "Pipeline architecture and CRM setup",
        "Campaign design and deployment",
        "Landing page and funnel management",
        "Conversion tracking and attribution",
        "Weekly performance reporting",
      ],
      idealFor: [
        "B2B and B2C founders needing predictable leads",
        "Teams running campaigns without structure",
        "Growth-stage businesses entering new markets",
      ],
    },
  },
  {
    id: "digital-presence",
    name: "Digital Presence",
    tagline: "Your digital presence, actively managed.",
    icon: MessageCircle,
    hoverText:
      "Social media, reputation management, and online conversations handled daily.",
    expanded: {
      poeticLine: "Perception is reality. We shape it.",
      description:
        "The Digital Presence Studio manages your brand's online footprint. Reviews, social engagement, content calendars, and brand voice — controlled from a single system.",
      includes: [
        "Review monitoring and response management",
        "Content calendar and social scheduling",
        "Brand voice guidelines and enforcement",
        "Community engagement strategy",
        "Monthly perception reporting",
      ],
      idealFor: [
        "Brands with growing online visibility",
        "Service businesses reliant on reputation",
        "Founders who want control over their narrative",
      ],
    },
  },
  {
    id: "experience",
    name: "Experience",
    tagline: "Corporate moments, elevated.",
    icon: Sparkles,
    hoverText:
      "Team experiences, curated gatherings, and memorable brand moments.",
    expanded: {
      poeticLine: "Culture is built in moments.",
      description:
        "The Experience Studio designs and executes events, activations, and internal culture programs. We turn gatherings into strategic assets.",
      includes: [
        "Event planning and logistics",
        "Budget management and vendor coordination",
        "Checklist and timeline management",
        "Post-event reporting and insights",
        "Internal culture program design",
      ],
      idealFor: [
        "Companies investing in culture",
        "Teams hosting client-facing events",
        "Founders who understand brand = experience",
      ],
    },
  },
  {
    id: "strategy",
    name: "Strategy & Advisory",
    tagline: "Clarity before commitment.",
    icon: Compass,
    label: "New",
    hoverText:
      "Business model review, growth planning, and strategic advisory for founders at inflection points.",
    expanded: {
      poeticLine: "Direction determines speed.",
      description:
        "The Strategy & Advisory Studio provides structured thinking for founders navigating pivotal decisions. From market entry to operational scaling, we help you move with conviction.",
      includes: [
        "Business model analysis and refinement",
        "Growth roadmap and milestone planning",
        "Market positioning and competitive strategy",
        "Investor readiness and pitch support",
        "Quarterly strategic review sessions",
      ],
      idealFor: [
        "Founders approaching a growth inflection point",
        "Businesses entering new markets or verticals",
        "Teams preparing for fundraising or partnership",
      ],
    },
  },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Studios = () => {
  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            STUDIOS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Choose your Studio.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            Every Studio is designed to remove friction, increase clarity, and create momentum.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xs text-muted-foreground/60 tracking-wide"
          >
            Activate what you need. Expand as you grow.
          </motion.p>
        </div>
      </section>

      {/* Tile Grid */}
      <section className="pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {studios.map((studio, i) => (
              <motion.button
                key={studio.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: easeOut,
                }}
                onClick={() => setActiveStudio(studio)}
                className="group relative text-left bg-background border border-border p-8 md:p-10 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)] hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Label badge */}
                {studio.label && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.15em] font-medium text-primary bg-accent px-2 py-0.5">
                    {studio.label}
                  </span>
                )}

                <studio.icon
                  size={22}
                  className="text-muted-foreground group-hover:text-primary transition-colors duration-200"
                  strokeWidth={1.5}
                />

                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-foreground uppercase">
                  {studio.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed italic">
                  {studio.tagline}
                </p>

                {/* Hover reveal text */}
                <p className="mt-4 text-xs text-muted-foreground/80 leading-relaxed max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-300">
                  {studio.hoverText}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore Studio <ArrowRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* How Studios Work Together */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
          >
            ECOSYSTEM
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight"
          >
            How Studios Work Together
          </motion.h2>

          {/* Flow diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-3"
          >
            {["Operations", "Automation", "Lead Engine", "Presence", "Experience", "Strategy"].map(
              (name, i, arr) => (
                <span key={name} className="flex items-center gap-2 md:gap-3">
                  <span className="text-xs md:text-sm font-display font-medium text-foreground uppercase tracking-wide">
                    {name}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight size={14} className="text-primary" />
                  )}
                </span>
              )
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Individually powerful. Together transformative.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Link to="/apply">
              <Button
                size="lg"
                className="text-[11px] tracking-[0.15em] uppercase px-8 gap-2"
              >
                Apply for Studio Access
                <ArrowRight size={14} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Editorial closing */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Infrastructure should feel invisible.
            <br />
            Until it isn't.
          </p>
        </div>
      </section>

      <Footer />

      {/* Expanded Studio Modal */}
      <AnimatePresence>
        {activeStudio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveStudio(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-background border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-[0_25px_60px_-15px_hsl(var(--foreground)/0.15)]"
            >
              {/* Close */}
              <button
                onClick={() => setActiveStudio(null)}
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              <div className="p-8 md:p-12">
                {/* Header */}
                <activeStudio.icon
                  size={24}
                  className="text-primary"
                  strokeWidth={1.5}
                />
                <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
                  {activeStudio.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground italic">
                  {activeStudio.expanded.poeticLine}
                </p>

                {/* Divider */}
                <div className="mt-8 h-px bg-border" />

                {/* Description */}
                <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                  {activeStudio.expanded.description}
                </p>

                {/* What You Get */}
                <h3 className="mt-10 text-[10px] uppercase tracking-[0.2em] text-foreground font-medium">
                  What You Get
                </h3>
                <ul className="mt-4 space-y-3">
                  {activeStudio.expanded.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 text-primary shrink-0"
                        strokeWidth={2}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Ideal For */}
                <h3 className="mt-10 text-[10px] uppercase tracking-[0.2em] text-foreground font-medium">
                  Ideal For
                </h3>
                <ul className="mt-4 space-y-2">
                  {activeStudio.expanded.idealFor.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-start gap-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-12">
                  <Link to="/apply">
                    <Button className="text-[11px] tracking-[0.15em] uppercase px-6 gap-2">
                      Discuss Activation
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Studios;
