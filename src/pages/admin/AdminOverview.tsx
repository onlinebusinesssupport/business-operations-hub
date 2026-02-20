import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ListChecks,
  Inbox,
  ArrowRight,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

type DateRange = "7d" | "30d" | "90d";

const kpiTiles = [
  { label: "Active Clients", value: "6", icon: Users, href: "/admin/clients", delta: "+1" },
  { label: "Revenue This Month", value: "R 42,500", icon: DollarSign, href: "/admin/reports", delta: "+12%" },
  { label: "Task Pipeline", value: "14", icon: ListChecks, href: "/admin/work", delta: "3 due soon" },
  { label: "Open Requests", value: "3", icon: Inbox, href: "/admin/requests", delta: "1 high priority" },
  { label: "Team Capacity", value: "78%", icon: Activity, href: "/admin/reports", delta: "Healthy" },
  { label: "Overdue Items", value: "1", icon: AlertTriangle, href: "/admin/work", delta: "Resolve today" },
];

const workInProgress = [
  { title: "Operations workflow — Apex Ltd", status: "In progress", due: "21 Feb", progress: 65 },
  { title: "Reporting framework — Nova Co", status: "In review", due: "18 Feb", progress: 90 },
  { title: "Vendor onboarding — Apex Ltd", status: "In progress", due: "28 Feb", progress: 40 },
  { title: "SOP update — Meridian Group", status: "Drafting", due: "25 Feb", progress: 20 },
];

const recentRequests = [
  { client: "Apex Ltd", title: "Update weekly report format", priority: "Medium", date: "14 Feb" },
  { client: "Nova Co", title: "Prepare investor summary", priority: "High", date: "13 Feb" },
  { client: "Meridian Group", title: "Add new team member to contacts", priority: "Low", date: "12 Feb" },
];

const activityFeed = [
  { text: "Weekly report delivered to Apex Ltd", time: "2 hours ago" },
  { text: "Nova Co request acknowledged", time: "4 hours ago" },
  { text: "SOP v2 uploaded for Meridian Group", time: "Yesterday" },
  { text: "Vertex Partners onboarding started", time: "Yesterday" },
  { text: "Prism Digital monthly report sent", time: "2 days ago" },
];

const clientRevenue = [
  { client: "Apex Ltd", amount: "R 12,000", share: 28 },
  { client: "Nova Co", amount: "R 10,500", share: 25 },
  { client: "Prism Digital", amount: "R 8,000", share: 19 },
  { client: "Meridian Group", amount: "R 7,000", share: 16 },
  { client: "Vertex Partners", amount: "R 5,000", share: 12 },
];

const AdminOverview = () => {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Studio Control</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Oversee operations across every partner workspace.
          </p>
        </div>
        <div className="flex gap-1 bg-accent/50 rounded-lg p-0.5">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`text-[11px] px-3 py-1.5 rounded-md transition-all duration-150 ${
                dateRange === range
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Tiles */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiTiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.08 + i * 0.04 }}
            >
              <Link
                to={tile.href}
                className="block bg-card border border-divider rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <tile.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <p className="font-serif text-3xl text-foreground">{tile.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{tile.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} strokeWidth={1.5} />
                  {tile.delta}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work in progress */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">
            Work Pipeline
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {workInProgress.map((w) => (
              <div key={w.title} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{w.status}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Progress value={w.progress} className="w-20 h-1.5" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock size={12} strokeWidth={1.5} /> {w.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent requests */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">
            Recent Requests
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {recentRequests.map((r) => (
              <div key={r.title} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.client} · {r.priority}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{r.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue breakdown */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.25 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">
            Revenue by Client
          </p>
          <div className="bg-card border border-divider rounded-xl p-5 space-y-4">
            {clientRevenue.map((c) => (
              <div key={c.client} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-32 shrink-0 truncate">{c.client}</span>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.share}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-20 text-right shrink-0">{c.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.3 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">
            Activity Feed
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {activityFeed.map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Zap size={14} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <p className="text-sm text-foreground truncate">{a.text}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance snapshot */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.35 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">
          Performance Snapshot
        </p>
        <div className="bg-card border border-divider rounded-xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Requests closed this month", value: "9" },
              { label: "On-time delivery rate", value: "96%" },
              { label: "Active work items", value: "14" },
              { label: "Documents shared", value: "32" },
            ].map((m) => (
              <div key={m.label}>
                <p className="font-serif text-2xl text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
