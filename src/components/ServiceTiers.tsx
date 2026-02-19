import { motion } from "framer-motion";
import { Briefcase, Building2, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    icon: Briefcase,
    name: "Executive Operations Support",
    price: "$3,500–$6,500/mo",
    hours: "20–30 hrs/week",
    bestFor: "Early-stage founders, 5–20 person teams",
    features: [
      "Calendar management & inbox governance",
      "Meeting preparation & follow-ups",
      "Logistics & workflow optimization",
      "Monthly reporting",
    ],
  },
  {
    icon: Building2,
    name: "Fractional Operations Director",
    price: "$6,500–$12,000/mo",
    hours: "30–40 hrs/week",
    bestFor: "Growing businesses, Series A-B, 15–50 person teams",
    features: [
      "Everything in Executive Support",
      "Operations strategy & systems design",
      "Financial operations & expense tracking",
      "HR coordination & vendor management",
    ],
  },
  {
    icon: Lightbulb,
    name: "Specialized Consulting",
    price: "$8,000–$30,000+",
    hours: "Project-based",
    bestFor: "Specific operational challenges or initiatives",
    features: [
      "Cash flow architecture & hiring systems",
      "Vendor optimization & process documentation",
      "Growth transition planning",
      "Custom systems implementation",
    ],
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
            SERVICE TIERS
          </span>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-foreground">
            Choose the level of support you need
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background border-l-2 border-primary p-8 md:p-10 flex flex-col"
            >
              <tier.icon size={24} className="text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-bold text-foreground">
                {tier.name}
              </h3>
              <p className="mt-2 text-lg font-medium text-primary">{tier.price}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tier.hours}</p>
              <p className="mt-4 text-sm text-muted-foreground italic">
                Best for: {tier.bestFor}
              </p>
              <ul className="mt-6 space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
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
