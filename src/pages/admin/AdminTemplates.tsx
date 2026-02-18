import { motion } from "framer-motion";
import { Copy, LayoutTemplate, FileText } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const templateCategories = [
  {
    name: "Onboarding Flows",
    templates: [
      { title: "New Client Onboarding Checklist", description: "Step-by-step onboarding for new clients including workspace setup, access, and kick-off." },
      { title: "Discovery Call Guide", description: "Structured agenda for initial client conversations to understand needs and scope." },
      { title: "Welcome Pack", description: "Introduction to services, communication protocols, and portal access instructions." },
    ],
  },
  {
    name: "SOP Templates",
    templates: [
      { title: "Standard Operating Procedure — Blank", description: "Base template for creating new SOPs with sections for purpose, scope, and steps." },
      { title: "Daily Operations Checklist", description: "Recurring task list for daily operational management." },
      { title: "Escalation Procedure", description: "Clear escalation paths and response protocols for issues." },
    ],
  },
  {
    name: "Report Structures",
    templates: [
      { title: "Weekly Progress Report", description: "Structured format for weekly client updates covering work completed and upcoming priorities." },
      { title: "Monthly Summary Report", description: "Comprehensive monthly overview with KPIs, completed work, and recommendations." },
      { title: "Quarterly Business Review", description: "End-of-quarter review template covering engagement health, outcomes, and next steps." },
    ],
  },
  {
    name: "Client Communication",
    templates: [
      { title: "Status Update Email", description: "Quick email template for routine progress updates." },
      { title: "Request Acknowledgment", description: "Standard response confirming receipt and next steps for client requests." },
      { title: "Meeting Follow-Up", description: "Post-meeting summary with action items and deadlines." },
    ],
  },
];

const AdminTemplates = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl text-foreground">Templates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable templates to standardise delivery and save time.
        </p>
      </motion.div>

      {templateCategories.map((cat, ci) => (
        <motion.div key={cat.name} {...fade} transition={{ ...fade.transition, delay: ci * 0.06 }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <LayoutTemplate size={14} strokeWidth={1.5} />
            {cat.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cat.templates.map((tpl) => (
              <div
                key={tpl.title}
                className="bg-background border border-divider rounded-md p-5 hover:border-foreground/20 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <FileText size={16} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                  <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                    <Copy size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <h4 className="text-sm font-medium text-foreground mt-3">{tpl.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tpl.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminTemplates;
