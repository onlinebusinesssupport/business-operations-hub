import { motion } from "framer-motion";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const projects = [
  {
    title: "Operations Workflow Setup",
    status: "In Progress",
    statusColor: "bg-foreground",
    description: "Building standardised workflows for daily operations and team coordination.",
    deliverables: ["Process maps", "Task templates", "Handoff procedures"],
    timeline: "Feb — Mar 2026",
  },
  {
    title: "Client Reporting Framework",
    status: "In Review",
    statusColor: "bg-muted-foreground",
    description: "Designing a recurring reporting structure for weekly and monthly client updates.",
    deliverables: ["Report templates", "KPI dashboard", "Delivery schedule"],
    timeline: "Feb 2026",
  },
  {
    title: "Vendor Onboarding",
    status: "In Progress",
    statusColor: "bg-foreground",
    description: "Coordinating onboarding for two new service vendors including agreements and access setup.",
    deliverables: ["Vendor profiles", "Agreements", "Access configuration"],
    timeline: "Feb — Mar 2026",
  },
  {
    title: "SOP Documentation",
    status: "Completed",
    statusColor: "bg-muted-foreground/50",
    description: "Comprehensive standard operating procedures for core business functions.",
    deliverables: ["SOP documents", "Training guides", "Quick reference cards"],
    timeline: "Completed Jan 2026",
  },
];

const ActiveWork = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Active Work</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Current projects and their progress. Each item is tracked so nothing
          falls through.
        </p>
      </motion.div>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            {...fade}
            transition={{ ...fade.transition, delay: i * 0.08 }}
            className="bg-background border border-divider rounded-md p-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-serif text-lg text-foreground">{project.title}</h3>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${project.statusColor}`} />
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={14} strokeWidth={1.5} />
                {project.timeline}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-divider">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Key Deliverables
              </p>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 text-xs text-foreground bg-secondary px-3 py-1.5 rounded-sm"
                  >
                    {project.status === "Completed" ? (
                      <CheckCircle2 size={12} strokeWidth={1.5} />
                    ) : (
                      <ArrowRight size={12} strokeWidth={1.5} />
                    )}
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActiveWork;
