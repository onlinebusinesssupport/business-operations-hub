import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const clientActivity = [
  { client: "Apex Ltd", workItems: 5, requests: 3, documents: 8, lastActive: "14 Feb" },
  { client: "Nova Co", workItems: 3, requests: 2, documents: 5, lastActive: "13 Feb" },
  { client: "Meridian Group", workItems: 2, requests: 1, documents: 4, lastActive: "12 Feb" },
  { client: "Prism Digital", workItems: 2, requests: 2, documents: 6, lastActive: "14 Feb" },
  { client: "Vertex Partners", workItems: 1, requests: 0, documents: 1, lastActive: "10 Feb" },
  { client: "Helix Ventures", workItems: 0, requests: 0, documents: 2, lastActive: "5 Jan" },
];

const AdminReports = () => {
  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl text-foreground">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review activity, workload, and delivery consistency.</p>
      </motion.div>

      {/* Summary metrics */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">This Month</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Work Items Completed", value: "9" },
            { label: "Requests Resolved", value: "7" },
            { label: "Documents Shared", value: "12" },
            { label: "On-Time Delivery", value: "96%" },
          ].map((m) => (
            <div key={m.label} className="bg-card border border-divider rounded-xl p-5 hover:shadow-sm transition-all duration-200">
              <p className="font-serif text-2xl text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Client activity table */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
          <BarChart3 size={14} strokeWidth={1.5} /> Client Activity
        </p>
        <div className="bg-card border border-divider rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Client</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Work Items</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Requests</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Documents</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {clientActivity.map((row) => (
                <tr key={row.client} className="hover:bg-accent/40 transition-colors">
                  <td className="px-5 py-3 text-foreground font-medium">{row.client}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.workItems}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.requests}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.documents}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Workload */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Workload Distribution</p>
        <div className="bg-card border border-divider rounded-xl p-5 space-y-4">
          {clientActivity.filter(c => c.workItems > 0).map((c) => (
            <div key={c.client} className="flex items-center gap-4">
              <span className="text-sm text-foreground w-36 shrink-0">{c.client}</span>
              <Progress value={(c.workItems / 5) * 100} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground w-6 text-right">{c.workItems}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;
