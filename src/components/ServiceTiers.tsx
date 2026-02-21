import { motion } from "framer-motion";
import { MessageCircle, Radio, GitBranch, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    icon: MessageCircle,
    name: "Digital Presence",
    price: "From R2,500/mo",
    label: "Social Media Management",
    features: [
      "Content planning and scheduling",
      "Caption writing and hashtag strategy",
      "Community management",
      "Monthly insights",
    ],
    href: "/services/digital-presence",
  },
  {
    icon: Radio,
    name: "Lead Engine",
    price: "From R7,500/mo",
    label: "Lead Generation",
    features: [
      "Ideal customer profiling",
      "Lead research and validation",
      "Email + LinkedIn sourcing",
      "Weekly pipeline reporting",
    ],
    href: "/services/lead-engine",
  },
  {
    icon: GitBranch,
    name: "Automation",
    price: "From R6,500",
    label: "Once-off builds",
    features: [
      "Lead capture automation",
      "Nurture sequences",
      "Client onboarding flows",
      "Custom automation builds",
    ],
    href: "/services/automation",
  },
  {
    icon: Layers,
    name: "Operations",
    price: "From R6,000/mo",
    label: "Executive Virtual Support",
    features: [
      "Inbox + calendar management",
      "Admin coordination",
      "Stakeholder communication",
      "Research + reporting",
    ],
    href: "/services/operations",
  },
];

const ServiceTiers = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">
            SERVICE PILLARS
          </span>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-foreground">
            Choose the support you need
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={tier.href}
                className="group bg-background border-l-2 border-primary p-8 md:p-10 flex flex-col h-full hover:shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)] transition-all duration-200"
              >
                <tier.icon size={24} className="text-primary mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="font-serif text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-medium">{tier.label}</p>
                <p className="mt-2 text-lg font-medium text-primary">{tier.price}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
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
            <Button size="lg" className="text-sm tracking-wide px-8">
              View Full Service Details
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceTiers;
