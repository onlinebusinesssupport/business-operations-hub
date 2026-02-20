import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Automation = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
          Automation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor your active automation pipelines.
        </p>
      </motion.div>

      <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
        <Zap size={32} className="text-muted-foreground/40 mb-4" strokeWidth={1} />
        <p className="text-sm text-muted-foreground">No automations deployed yet.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Automation modules will appear here once activated.</p>
      </div>
    </div>
  );
};

export default Automation;
