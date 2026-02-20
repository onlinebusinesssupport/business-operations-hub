import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
          Reports
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Performance reports and operational metrics.
        </p>
      </motion.div>

      <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
        <BarChart3 size={32} className="text-muted-foreground/40 mb-4" strokeWidth={1} />
        <p className="text-sm text-muted-foreground">No reports generated yet.</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Reports will populate as studio modules become active.</p>
      </div>
    </div>
  );
};

export default Reports;
