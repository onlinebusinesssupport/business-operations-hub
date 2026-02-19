import { motion } from "framer-motion";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const projects = [
  {
    title: "Operations Workflow Setup",
    status: "In Progress",
    active: true,
    description: "Building standardised workflows for daily operations and team coordination.",
    deliverables: ["Process maps", "Task templates", "Handoff procedures"],
    timeline: "Feb — Mar 2026",
    progress: 55,
  },
  {
    title: "Client Reporting Framework",
    status: "In Review",
    active: true,
    description: "Designing a recurring reporting structure for weekly and monthly client updates.",
    deliverables: ["Report templates", "KPI dashboard", "Delivery schedule"],
    timeline: "Feb 2026",
    progress: 90,
  },
  {
    title: "Vendor Onboarding",
    status: "In Progress",
    active: true,
    description: "Coordinating onboarding for two new service vendors including agreements and access setup.",
    deliverables: ["Vendor profiles", "Agreements", "Access configuration"],
    timeline: "Feb — Mar 2026",
    progress: 40,
  },
  {
    title: "SOP Documentation",
    status: "Completed",
    active: false,
    description: "Comprehensive standard operating procedures for core business functions.",
    deliverables: ["SOP documents", "Training guides", "Quick reference cards"],
    timeline: "Completed Jan 2026",
    progress: 100,
  },
];

const ActiveWork = () => {
  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Projects</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Current projects and their progress. Each item is tracked to ensure nothing is missed.
        </p>
      </motion.div>

      <div className="space-y-4">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            {...stagger}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-card border border-divider rounded-xl p-6 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-serif text-lg text-foreground">{project.title}</h3>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${project.active ? "bg-foreground" : "bg-muted-foreground/50"}`} />
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Progress value={project.progress} className="w-24 h-1.5" />
                <span className="text-xs text-muted-foreground">{project.progress}%</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} strokeWidth={1.5} />
                  {project.timeline}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-divider">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
                Key Deliverables
              </p>
              <div className="flex flex-wrap gap-2">
                {project.deliverables.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 text-xs text-foreground bg-accent px-3 py-1.5 rounded-lg"
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
