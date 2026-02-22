import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Settings, Zap, Target, Globe, Sparkles, Compass, ArrowRight } from "lucide-react";

const studios = [
  {
    name: "OPERATIONS",
    icon: Settings,
    description: "Centralised task management, SOPs, and workflow infrastructure.",
    status: "Building" as const,
    href: "/portal/studios/operations",
  },
  {
    name: "AUTOMATION",
    icon: Zap,
    description: "Live automation pipelines and workflow orchestration.",
    status: "Building" as const,
    href: "/portal/studios/automation",
  },
  {
    name: "LEAD ENGINE",
    icon: Target,
    description: "Pipeline management, campaigns, and conversion tracking.",
    status: "Inactive" as const,
    href: "/portal/studios/lead-engine",
  },
  {
    name: "SOCIALS",
    icon: Globe,
    description: "Reviews, engagement, content calendar, and brand voice.",
    status: "Inactive" as const,
    href: "/portal/studios/socials",
  },
  {
    name: "TRAVEL & ACTIVITIES",
    icon: Sparkles,
    description: "Curated travel logistics, team experiences, and event coordination.",
    status: "Inactive" as const,
    href: "/portal/studios/experiences",
  },
  {
    name: "GRANTS & AWARDS",
    icon: Compass,
    description: "Grant writing, award submissions, and funding applications.",
    status: "Inactive" as const,
    href: "/portal/studios/experiences",
  },
];

const statusColors = {
  Active: "bg-primary/10 text-primary",
  Building: "bg-amber-500/10 text-amber-600",
  Inactive: "bg-secondary text-muted-foreground",
};

const StudiosHub = () => {
  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
          Studios
        </h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-lg">
          Modular engines powering your business infrastructure. Each studio operates as an independent system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studios.map((studio, i) => (
          <motion.div
            key={studio.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              to={studio.href}
              className="block border border-border p-6 hover:border-primary/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <studio.icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${statusColors[studio.status]}`}>
                  {studio.status}
                </span>
              </div>
              <h3 className="font-display text-sm font-bold tracking-[0.15em] text-foreground uppercase">
                {studio.name}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {studio.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open Studio <ArrowRight size={12} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudiosHub;
