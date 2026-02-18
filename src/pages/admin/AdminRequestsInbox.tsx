import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

type ReqStatus = "Open" | "In Progress" | "Resolved";

interface Request {
  id: string;
  client: string;
  title: string;
  description: string;
  priority: string;
  status: ReqStatus;
  date: string;
}

const requestsData: Request[] = [
  { id: "1", client: "Apex Ltd", title: "Update weekly report format", description: "Client wants KPI section moved to top of report.", priority: "Medium", status: "In Progress", date: "14 Feb" },
  { id: "2", client: "Nova Co", title: "Prepare investor summary", description: "One-page summary of Q1 progress for investor update.", priority: "High", status: "Open", date: "13 Feb" },
  { id: "3", client: "Meridian Group", title: "Add team member to contacts", description: "New hire — Sarah M. needs access to shared docs.", priority: "Low", status: "Open", date: "12 Feb" },
  { id: "4", client: "Prism Digital", title: "Monthly report template update", description: "Add social metrics section to template.", priority: "Medium", status: "Resolved", date: "10 Feb" },
  { id: "5", client: "Apex Ltd", title: "Vendor agreement review", description: "Review new vendor contract terms before signing.", priority: "High", status: "Resolved", date: "8 Feb" },
];

const statusStyles: Record<ReqStatus, string> = {
  Open: "bg-foreground text-background",
  "In Progress": "bg-secondary text-foreground",
  Resolved: "bg-secondary text-muted-foreground",
};

const AdminRequestsInbox = () => {
  const [filter, setFilter] = useState<ReqStatus | "All">("All");

  const filtered = filter === "All" ? requestsData : requestsData.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl text-foreground">Requests Inbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">All client requests in one place.</p>
      </motion.div>

      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Open", "In Progress", "Resolved"] as const).map((s) => (
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

      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
        <div className="bg-background border border-divider rounded-md divide-y divide-divider">
          {filtered.map((req) => (
            <div key={req.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{req.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${statusStyles[req.status]}`}>{req.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{req.client} · {req.priority} priority · {req.date}</p>
                  <p className="text-xs text-muted-foreground mt-2">{req.description}</p>
                </div>
                {req.status !== "Resolved" && (
                  <button className="text-xs bg-secondary text-foreground px-3 py-1.5 rounded-sm hover:bg-accent transition-colors shrink-0 flex items-center gap-1">
                    Convert to Work <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRequestsInbox;
