import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Radio,
  GitBranch,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  label: string;
  tagline: string;
  icon: React.ElementType;
  badge?: string;
  href: string;
}

const primaryServices: Service[] = [
  {
    id: "digital-presence",
    name: "Digital Presence",
    label: "Social Media Management",
    tagline: "Your digital presence, actively managed.",
    icon: MessageCircle,
    href: "/services/digital-presence",
  },
  {
    id: "lead-engine",
    name: "Lead Engine",
    label: "Lead Generation",
    tagline: "Predictable demand, engineered.",
    icon: Radio,
    href: "/services/lead-engine",
  },
  {
    id: "automation",
    name: "Automation",
    label: "Business Automation",
    tagline: "Automate what slows you down.",
    icon: GitBranch,
    badge: "Most Popular",
    href: "/services/automation",
  },
  {
    id: "operations",
    name: "Operations",
    label: "Executive Virtual Support",
    tagline: "The backbone of your business.",
    icon: Layers,
    href: "/services/operations",
  },
];

const secondaryServices: Service[] = [
  {
    id: "travel-activities",
    name: "Travel & Activities",
    label: "Premium Add-on",
    tagline: "Curated travel, team experiences, and event logistics.",
    icon: Sparkles,
    href: "/services/travel-activities",
  },
  {
    id: "grants-awards",
    name: "Grants & Awards",
    label: "Premium Add-on",
    tagline: "Grant writing, award submissions, and funding applications.",
    icon: Compass,
    badge: "New",
    href: "/services/grants-awards",
  },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ServiceTile = ({ service, i }: { service: Service; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: i * 0.06, ease: easeOut }}
  >
    <Link
      to={service.href}
      className="group relative block text-left bg-background border border-border p-8 md:p-10 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)] hover:border-primary/30"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {service.badge && (
        <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.15em] font-medium text-primary bg-accent px-2 py-0.5">
          {service.badge}
        </span>
      )}

      <service.icon
        size={22}
        className="text-muted-foreground group-hover:text-primary transition-colors duration-200"
        strokeWidth={1.5}
      />

      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-foreground uppercase">
        {service.name}
      </h3>

      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">
        {service.label}
      </p>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed italic">
        {service.tagline}
      </p>

      <div className="mt-5 flex items-center gap-1.5 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        View packages <ArrowRight size={12} />
      </div>
    </Link>
  </motion.div>
);

const Studios = () => {
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
            SERVICES
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: easeOut }}
            className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground uppercase tracking-tight"
          >
            Activate what you need. Expand as you grow.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
            className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
          >
            Six commercial pillars built for growth. Each one a full studio — with defined scope, measurable outcomes, and structured pricing.
          </motion.p>
        </div>
      </section>

      {/* Primary Services Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {primaryServices.map((service, i) => (
              <ServiceTile key={service.id} service={service} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Services */}
      <section className="pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium mb-6"
          >
            PREMIUM ADD-ONS
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {secondaryServices.map((service, i) => (
              <ServiceTile key={service.id} service={service} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
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
            How Our Services Work Together
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-3"
          >
            {["Presence", "Lead Engine", "Automation", "Operations"].map(
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
                Apply for Access
                <ArrowRight size={14} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Editorial closing */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-xl text-center">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Clarity builds momentum. Systems build freedom. THE BUSINESS SUPPORT STUDIO™ builds both.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Studios;
