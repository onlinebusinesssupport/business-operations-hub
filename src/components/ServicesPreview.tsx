import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Settings, Zap, Target, Globe, Award, Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Settings,
    title: "Operations",
    pain: "Drowning in admin while your business runs on memory and maybes.",
    outcome: "The backbone that lets you focus on growth.",
    idealFor: "Scaling founders, 5–30 person teams",
    pricing: "R8 500 – R15 000/mo",
    href: "/services/operations",
  },
  {
    icon: Zap,
    title: "Automation & Systems",
    pain: "Manual processes eating hours. No one knows the workflow except you.",
    outcome: "Systems that run while you sleep.",
    idealFor: "Operators eliminating bottlenecks",
    pricing: "R6 500 – R12 000/mo",
    href: "/services/automation",
  },
  {
    icon: Target,
    title: "Lead Engine",
    pain: "Inconsistent pipeline. Feast-or-famine revenue cycles.",
    outcome: "Predictable demand, engineered.",
    idealFor: "Founders ready to scale revenue",
    pricing: "R9 500 – R18 000/mo",
    href: "/services/lead-engine",
  },
  {
    icon: Globe,
    title: "Digital Presence",
    pain: "Your brand looks amateur. Competitors are outpacing you online.",
    outcome: "A presence that commands respect.",
    idealFor: "Professionals, consultants, creators",
    pricing: "R7 500 – R14 000/mo",
    href: "/services/digital-presence",
  },
  {
    icon: Award,
    title: "Grants & Funding",
    pain: "Leaving money on the table. Applications going nowhere.",
    outcome: "Funding secured. Recognition earned.",
    idealFor: "Impact-driven businesses, NGOs",
    pricing: "Project from R25 000",
    href: "/services/grants-awards",
  },
  {
    icon: Plane,
    title: "Executive Travel & Experiences",
    pain: "Wasting hours on logistics. Trips that don't match your standards.",
    outcome: "Travel planned like business — flawlessly.",
    idealFor: "Executives, HNWIs, corporate teams",
    pricing: "Project from R12 000",
    href: "/services/travel-activities",
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
            SERVICES
          </span>
          <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold text-foreground">
            Six engines. One studio.
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            Activate what you need. Scale when you're ready. Every engagement is built around measurable outcomes.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-divider">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={service.href}
                className="group bg-secondary p-8 md:p-10 flex flex-col h-full hover:bg-background transition-colors duration-200"
              >
                <service.icon size={22} className="text-foreground group-hover:text-primary transition-colors mb-5" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground italic">
                  {service.pain}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80 font-medium">
                  {service.outcome}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  {service.idealFor}
                </p>
                <p className="mt-4 text-xs font-medium tracking-wide text-foreground/70">
                  {service.pricing}
                </p>
                <span className="mt-3 flex items-center gap-1.5 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  View details <ArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link to="/services">
            <Button variant="outline" size="lg" className="text-sm tracking-[0.1em] uppercase">
              View Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
