import { motion } from "framer-motion";
import { Settings, UserCheck, Layers, Briefcase } from "lucide-react";

const services = [
  {
    icon: Settings,
    title: "Operations Support",
    description:
      "Day-to-day operational management that keeps your business running smoothly. From workflow coordination to process oversight, everything stays on track.",
  },
  {
    icon: UserCheck,
    title: "Executive Assistance",
    description:
      "Structured support for decision-makers. Calendar management, communications, and priority handling so you can focus on what matters most.",
  },
  {
    icon: Layers,
    title: "Systems and Processes",
    description:
      "Building and refining the systems your business needs. Documentation, automation, and process design that scales with your growth.",
  },
  {
    icon: Briefcase,
    title: "Business Coordination",
    description:
      "Cross-functional coordination between teams, vendors, and stakeholders. Ensuring nothing falls through the cracks.",
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
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
            Services
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            Structured support across the areas that matter most to your operations.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-divider">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-secondary p-8 md:p-10"
            >
              <service.icon size={22} className="text-foreground mb-5" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-medium text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
