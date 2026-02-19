import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  MessageSquarePlus,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const tiles = [
  { label: "Active Projects", value: "3", icon: Briefcase, href: "/portal/active-work", change: "+1 this week" },
  { label: "Tasks in Progress", value: "7", icon: Target, href: "/portal/active-work", change: "2 near deadline" },
  { label: "Recent Updates", value: "5", icon: Bell, href: "/portal/updates", change: "Last: today" },
  { label: "Documents Shared", value: "18", icon: FileText, href: "/portal/documents", change: "3 new" },
  { label: "Open Requests", value: "2", icon: MessageSquarePlus, href: "/portal/requests", change: "1 in progress" },
  { label: "Completed", value: "12", icon: CheckCircle2, href: "/portal/active-work", change: "This quarter" },
];

const ongoingWork = [
  { title: "Process documentation", status: "In progress", progress: 65 },
  { title: "Calendar and scheduling system", status: "In progress", progress: 40 },
  { title: "Client reporting template", status: "Review", progress: 90 },
  { title: "Vendor onboarding pack", status: "In progress", progress: 55 },
];

const latestUpdates = [
  { text: "Weekly report delivered", date: "14 Feb" },
  { text: "Vendor agreement reviewed", date: "12 Feb" },
  { text: "SOP v2 completed", date: "10 Feb" },
];

const milestones = [
  { text: "Finalise onboarding checklist", date: "20 Feb" },
  { text: "Launch recurring reports", date: "28 Feb" },
  { text: "Quarterly review preparation", date: "5 Mar" },
];

const PortalDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Welcome back.
        </h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Your operations are on track. Here is an overview of current progress and upcoming milestones.
        </p>
      </motion.div>

      {/* Overview Tiles */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
          Overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
            >
              <Link
                to={tile.href}
                className="block bg-card border border-divider rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <tile.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                  <ArrowRight
                    size={14}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <p className="font-serif text-3xl text-foreground">{tile.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{tile.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} strokeWidth={1.5} />
                  {tile.change}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ongoing work */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
          Ongoing Work
        </p>
        <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
          {ongoingWork.map((item) => (
            <div key={item.title} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Clock size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Progress value={item.progress} className="w-24 h-1.5" />
                <span className="text-xs text-muted-foreground w-8 text-right">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Updates + Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.25 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
            Latest Updates
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {latestUpdates.map((u) => (
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

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.3 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
            Upcoming Milestones
          </p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {milestones.map((m) => (
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
