import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Radio, GitBranch, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: MessageCircle,
    title: "Digital Presence",
    label: "Social Media Management",
    description: "Your digital presence, actively managed.",
    pricing: "From R2,500/month",
    href: "/services/digital-presence",
  },
  {
    icon: Radio,
    title: "Lead Engine",
    label: "Lead Generation",
    description: "Predictable demand, engineered.",
    pricing: "From R7,500/month",
    href: "/services/lead-engine",
  },
  {
    icon: GitBranch,
    title: "Automation",
    label: "Business Automation",
    description: "Automate what slows you down.",
    pricing: "From R6,500 once-off",
    href: "/services/automation",
  },
  {
    icon: Layers,
    title: "Operations",
    label: "Executive Virtual Support",
    description: "The backbone of your business.",
    pricing: "From R6,000/month",
    href: "/services/operations",
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
          <h2 className="mt-4 font-serif text-2xl md:text-3xl font-medium text-foreground">
            Activate what you need. Expand as you grow.
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            Four commercial pillars built for growth — with clear pricing and measurable outcomes.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-divider">
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
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {service.title}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">
                  {service.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1 italic">
                  {service.description}
                </p>
                <p className="mt-4 text-xs font-medium tracking-wide text-foreground/70">
                  {service.pricing}
                </p>
                <span className="mt-3 flex items-center gap-1.5 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  View packages <ArrowRight size={12} />
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
            <Button variant="outline" size="lg" className="text-sm tracking-wide">
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
