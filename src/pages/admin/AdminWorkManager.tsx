import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2 } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

type Status = "To Do" | "In Progress" | "In Review" | "Done";

interface WorkItem {
  id: string;
  title: string;
  client: string;
  status: Status;
  deadline: string;
  notes: string;
}

const workItems: WorkItem[] = [
  { id: "1", title: "Finalise operations workflow", client: "Apex Ltd", status: "In Progress", deadline: "21 Feb", notes: "Awaiting feedback on process maps." },
  { id: "2", title: "Build reporting framework", client: "Nova Co", status: "In Review", deadline: "18 Feb", notes: "Draft shared. Reviewing KPI selection." },
  { id: "3", title: "Vendor onboarding pack", client: "Apex Ltd", status: "In Progress", deadline: "28 Feb", notes: "Two vendors confirmed. Agreements pending." },
  { id: "4", title: "SOP v3 — internal ops", client: "Meridian Group", status: "To Do", deadline: "25 Feb", notes: "Incorporate feedback from last review." },
  { id: "5", title: "Weekly report delivery", client: "Prism Digital", status: "Done", deadline: "14 Feb", notes: "Delivered on time." },
  { id: "6", title: "Onboarding workspace setup", client: "Vertex Partners", status: "In Progress", deadline: "22 Feb", notes: "Portal configured. Awaiting document uploads." },
  { id: "7", title: "Communication templates", client: "Nova Co", status: "To Do", deadline: "1 Mar", notes: "Standard client comms pack." },
  { id: "8", title: "Quarterly review prep", client: "Apex Ltd", status: "To Do", deadline: "5 Mar", notes: "Compile performance data for Q1." },
];

const statusOrder: Status[] = ["In Progress", "To Do", "In Review", "Done"];

const statusIcon = (s: Status) => {
  if (s === "Done") return <CheckCircle2 size={14} strokeWidth={1.5} className="text-muted-foreground" />;
  return <Clock size={14} strokeWidth={1.5} className="text-muted-foreground" />;
};

const statusBadge = (s: Status) => {
  const styles: Record<Status, string> = {
    "To Do": "bg-secondary text-foreground",
    "In Progress": "bg-foreground text-background",
    "In Review": "bg-secondary text-foreground",
    "Done": "bg-secondary text-muted-foreground",
  };
  return styles[s];
};

const AdminWorkManager = () => {
  const [filter, setFilter] = useState<Status | "All">("All");

  const filtered = filter === "All" ? workItems : workItems.filter((w) => w.status === filter);
  const sorted = [...filtered].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return (
    <div className="space-y-6">
      <motion.div {...fade} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Work Manager</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage all delivery work.</p>
        </div>
        <button className="flex items-center gap-2 text-xs bg-foreground text-background px-4 py-2.5 rounded-md hover:bg-foreground/90 transition-colors">
          <Plus size={14} /> Add Work Item
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
        <div className="flex gap-2 flex-wrap">
          {(["All", ...statusOrder] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                filter === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-divider hover:border-foreground/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Work items */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
        <div className="bg-background border border-divider rounded-md divide-y divide-divider">
          {sorted.map((item) => (
            <div key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {statusIcon(item.status)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-sm ${statusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {item.deadline}
                  </span>
                </div>
              </div>
              {item.notes && (
                <p className="text-xs text-muted-foreground mt-2 ml-7">{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminWorkManager;
