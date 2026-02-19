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
      "Inbox management, calendar scheduling, travel bookings, and document formatting. The backbone of day-to-day operations.",
    pricing: "From R4k/month",
  },
  {
    icon: TrendingUp,
    title: "Sales Support",
    description:
      "CRM setup, lead list building, outreach scheduling, pipeline tracking, and proposal follow-ups. Moving you from admin to revenue.",
    pricing: "From R8k/month",
  },
  {
    icon: Settings,
    title: "Operations Support",
    description:
      "SOP creation, workflow automation, Notion workspace builds, dashboards, and task system setup. Helping chaotic businesses run like systems.",
    pricing: "From R8k/month",
  },
  {
    icon: Receipt,
    title: "Finance Admin",
    description:
      "Invoice creation, expense tracking, payment reminders, basic bookkeeping prep, and monthly reporting summaries.",
    pricing: "From R5k/month",
  },
  {
    icon: PenTool,
    title: "Content + Online Presence",
    description:
      "Social media scheduling, content repurposing, blog uploads, newsletter formatting, and Canva graphics for personal brands.",
    pricing: "From R4k/month",
  },
  {
    icon: Search,
    title: "Research Services",
    description:
      "Market research, competitor analysis, lead research, grant and funding research, and supplier sourcing.",
    pricing: "From R5k/month",
  },
  {
    icon: PackageOpen,
    title: "Systems Setup",
    description:
      "Business-in-a-Box packages: email, workspace, file structure, task systems, and CRM — all configured and ready to go.",
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
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground">
            Services
          </h2>
          <p className="mt-3 text-muted-foreground text-base max-w-lg">
            Practical, outcome-focused support across the areas that matter most to your operations.
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
