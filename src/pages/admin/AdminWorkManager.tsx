import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

type Status = "To Do" | "In Progress" | "In Review" | "Done";

interface WorkItem {
  id: string;
  title: string;
  client: string;
  status: Status;
  deadline: string;
  notes: string;
  progress: number;
}

const workItems: WorkItem[] = [
  { id: "1", title: "Finalise operations workflow", client: "Apex Ltd", status: "In Progress", deadline: "21 Feb", notes: "Awaiting feedback on process maps.", progress: 65 },
  { id: "2", title: "Build reporting framework", client: "Nova Co", status: "In Review", deadline: "18 Feb", notes: "Draft shared. Reviewing KPI selection.", progress: 90 },
  { id: "3", title: "Vendor onboarding pack", client: "Apex Ltd", status: "In Progress", deadline: "28 Feb", notes: "Two vendors confirmed. Agreements pending.", progress: 40 },
  { id: "4", title: "SOP v3 — internal ops", client: "Meridian Group", status: "To Do", deadline: "25 Feb", notes: "Incorporate feedback from last review.", progress: 0 },
  { id: "5", title: "Weekly report delivery", client: "Prism Digital", status: "Done", deadline: "14 Feb", notes: "Delivered on time.", progress: 100 },
  { id: "6", title: "Onboarding workspace setup", client: "Vertex Partners", status: "In Progress", deadline: "22 Feb", notes: "Portal configured. Awaiting document uploads.", progress: 55 },
  { id: "7", title: "Communication templates", client: "Nova Co", status: "To Do", deadline: "1 Mar", notes: "Standard client comms pack.", progress: 0 },
  { id: "8", title: "Quarterly review prep", client: "Apex Ltd", status: "To Do", deadline: "5 Mar", notes: "Compile performance data for Q1.", progress: 0 },
];

const statusOrder: Status[] = ["In Progress", "To Do", "In Review", "Done"];

const statusIcon = (s: Status) => {
  if (s === "Done") return <CheckCircle2 size={14} strokeWidth={1.5} className="text-muted-foreground" />;
  return <Clock size={14} strokeWidth={1.5} className="text-muted-foreground" />;
};

const statusBadge = (s: Status) => {
  const styles: Record<Status, string> = {
    "To Do": "bg-accent text-foreground",
    "In Progress": "bg-foreground text-background",
    "In Review": "bg-accent text-foreground",
    "Done": "bg-accent text-muted-foreground",
  };
  return styles[s];
};

const AdminWorkManager = () => {
  const [filter, setFilter] = useState<Status | "All">("All");

  const filtered = filter === "All" ? workItems : workItems.filter((w) => w.status === filter);
  const sorted = [...filtered].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Work Manager</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage all delivery work.</p>
        </div>
        <button className="flex items-center gap-2 text-xs bg-foreground text-background px-4 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors">
          <Plus size={14} /> Add Work Item
        </button>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="flex gap-2 flex-wrap">
          {(["All", ...statusOrder] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                filter === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-divider hover:border-foreground/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
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
                  <Progress value={item.progress} className="w-20 h-1.5" />
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${statusBadge(item.status)}`}>
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
