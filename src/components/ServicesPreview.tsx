import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  TrendingUp,
  Settings,
  Receipt,
  PenTool,
  Search,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Mail,
    title: "Executive Admin Support",
    description:
      "Inbox management, calendar scheduling, travel coordination, and document formatting — the backbone of day-to-day operations.",
    pricing: "From R4k/month",
  },
  {
    icon: TrendingUp,
    title: "Sales Operations",
    description:
      "CRM configuration, lead pipeline management, outreach scheduling, and proposal follow-ups. Structured support that moves you from admin to revenue.",
    pricing: "From R8k/month",
  },
  {
    icon: Settings,
    title: "Operational Infrastructure",
    description:
      "SOP development, workflow automation, workspace builds, dashboards, and task system configuration for businesses ready to scale.",
    pricing: "From R8k/month",
  },
  {
    icon: Receipt,
    title: "Finance Administration",
    description:
      "Invoice management, expense tracking, payment reminders, bookkeeping preparation, and monthly reporting summaries.",
    pricing: "From R5k/month",
  },
  {
    icon: PenTool,
    title: "Content & Digital Presence",
    description:
      "Social media scheduling, content repurposing, blog management, newsletter formatting, and branded collateral for professional visibility.",
    pricing: "From R4k/month",
  },
  {
    icon: Search,
    title: "Research & Intelligence",
    description:
      "Market research, competitor analysis, lead sourcing, grant and funding research, and supplier identification.",
    pricing: "From R5k/month",
  },
  {
    icon: PackageOpen,
    title: "Systems Enablement",
    description:
      "End-to-end business setup: email, workspace, file architecture, task systems, and CRM — configured and operational.",
    pricing: "From R5k/project",
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
            Structured support across the functions that matter most
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            Practical, outcome-focused operational support — designed for founders
            and growing businesses.
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
              className="bg-secondary p-8 md:p-10 flex flex-col"
            >
              <service.icon size={22} className="text-foreground mb-5" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-medium text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
                {service.description}
              </p>
              <p className="mt-4 text-xs font-medium tracking-wide text-foreground/70">
                {service.pricing}
              </p>
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
              View Full Service Catalogue
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;
