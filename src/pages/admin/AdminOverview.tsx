import { motion } from "framer-motion";
import { Users, ListChecks, Inbox, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const stats = [
  { label: "Active Clients", value: "6", icon: Users, href: "/admin/clients" },
  { label: "Work Items", value: "14", icon: ListChecks, href: "/admin/work" },
  { label: "Open Requests", value: "3", icon: Inbox, href: "/admin/requests" },
];

const workInProgress = [
  { title: "Operations workflow — Apex Ltd", status: "In progress", due: "21 Feb" },
  { title: "Reporting framework — Nova Co", status: "In review", due: "18 Feb" },
  { title: "Vendor onboarding — Apex Ltd", status: "In progress", due: "28 Feb" },
  { title: "SOP update — Meridian Group", status: "Drafting", due: "25 Feb" },
];

const recentRequests = [
  { client: "Apex Ltd", title: "Update weekly report format", priority: "Medium", date: "14 Feb" },
  { client: "Nova Co", title: "Prepare investor summary", priority: "High", date: "13 Feb" },
  { client: "Meridian Group", title: "Add new team member to contacts", priority: "Low", date: "12 Feb" },
];

const priorities = [
  { text: "Finalise Apex onboarding checklist", due: "20 Feb" },
  { text: "Deliver Nova monthly report", due: "1 Mar" },
  { text: "Quarterly review preparation — all clients", due: "5 Mar" },
];

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your command centre. Everything at a glance.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.href}
              className="bg-background border border-divider rounded-md p-5 hover:border-foreground/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <s.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-serif text-3xl text-foreground mt-3">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work in progress */}
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Work in Progress
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
            {workInProgress.map((w) => (
              <div key={w.title} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{w.status}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock size={12} strokeWidth={1.5} /> {w.due}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent requests */}
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Recent Requests
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
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

      {/* Upcoming priorities + performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Upcoming Priorities
          </h3>
          <div className="bg-background border border-divider rounded-md divide-y divide-divider">
            {priorities.map((p) => (
              <div key={p.text} className="p-4 flex items-center justify-between gap-3">
                <p className="text-sm text-foreground">{p.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{p.due}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.25 }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Performance Snapshot
          </h3>
          <div className="bg-background border border-divider rounded-md p-5">
            <div className="grid grid-cols-2 gap-6">
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
    </div>
  );
};

export default AdminOverview;
