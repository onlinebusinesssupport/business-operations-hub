import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Target } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const PortalDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Welcome back.
        </h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Here's a summary of where things stand. Everything is progressing as
          planned — nothing requires your immediate attention.
        </p>
      </motion.div>

      {/* Focus areas */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
        <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-4">
          Current Focus Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Operations Setup", detail: "Finalising workflows and SOPs" },
            { label: "Weekly Reporting", detail: "Recurring structure in place" },
            { label: "Vendor Coordination", detail: "Onboarding 2 new partners" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-background border border-divider rounded-md p-5"
            >
              <div className="flex items-start gap-3">
                <Target size={16} className="text-foreground mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ongoing work summary */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }}>
        <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-4">
          Ongoing Work
        </h3>
        <div className="bg-background border border-divider rounded-md divide-y divide-divider">
          {[
            { title: "Process documentation", status: "In progress", progress: 65 },
            { title: "Calendar and scheduling system", status: "In progress", progress: 40 },
            { title: "Client reporting template", status: "Review", progress: 90 },
          ].map((item) => (
            <div key={item.title} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Latest updates + milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.3 }}>
          <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-4">
            Latest Updates
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
            {[
              { text: "Weekly report delivered", date: "14 Feb" },
              { text: "Vendor agreement reviewed", date: "12 Feb" },
              { text: "SOP v2 completed", date: "10 Feb" },
            ].map((u) => (
              <div key={u.text} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-foreground" strokeWidth={1.5} />
                  <p className="text-sm text-foreground">{u.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.35 }}>
          <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-4">
            Next Milestones
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
            {[
              { text: "Finalise onboarding checklist", date: "20 Feb" },
              { text: "Launch recurring reports", date: "28 Feb" },
              { text: "Quarterly review preparation", date: "5 Mar" },
            ].map((m) => (
              <div key={m.text} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ArrowRight size={14} className="text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-sm text-foreground">{m.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">{m.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalDashboard;
