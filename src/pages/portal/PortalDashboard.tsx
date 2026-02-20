import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Zap,
  Target,
  Globe,
  Sparkles,
  TrendingUp,
  Bell,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WelcomeDashboard from "@/components/WelcomeDashboard";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/* Studio modules */
const studioModules = [
  { name: "Operations", icon: Settings, active: false },
  { name: "Automation", icon: Zap, active: false },
  { name: "Lead Engine", icon: Target, active: false },
  { name: "Digital Presence", icon: Globe, active: false },
  { name: "Experience", icon: Sparkles, active: false },
];

/* Metric placeholders */
const metrics = [
  { label: "Leads This Month", value: "—", icon: Target },
  { label: "Automations Live", value: "—", icon: Zap },
  { label: "Tasks Completed", value: "—", icon: CheckCircle2 },
  { label: "Revenue Pipeline", value: "—", icon: TrendingUp },
  { label: "Response Rate", value: "—", icon: MessageSquare },
];

/* Activity feed placeholder */
const activityFeed: { type: "task" | "message" | "automation"; text: string; time: string }[] = [
  { type: "task", text: "Task updated: Onboarding checklist finalised", time: "Just now" },
  { type: "message", text: "New message from your operations lead", time: "2h ago" },
  { type: "automation", text: "Automation deployed: Weekly digest pipeline", time: "Yesterday" },
  { type: "task", text: "Task completed: Vendor agreement review", time: "2 days ago" },
  { type: "message", text: "Quarterly review notes shared", time: "3 days ago" },
];

const activityIcon = {
  task: CheckCircle2,
  message: MessageSquare,
  automation: Zap,
};

const PortalDashboard = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed, full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setShowWelcome(!data.onboarding_completed);
        setUserName(data.full_name || "");
      } else {
        setShowWelcome(false);
      }
    };
    checkOnboarding();
  }, [user]);

  if (showWelcome === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeDashboard userName={userName} onDismiss={() => setShowWelcome(false)} />;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {userName ? `Welcome back, ${userName}.` : "Welcome back."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-border px-4 py-2">
              <TrendingUp size={14} className="text-primary" />
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                Growth Score
              </span>
              <span className="font-display text-sm font-bold text-foreground ml-1">—</span>
            </div>
            <button className="relative p-2 border border-border hover:bg-secondary transition-colors">
              <Bell size={16} className="text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Studio Overview */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Studio Overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {studioModules.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
              className="border border-border p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <mod.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                <span
                  className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                    mod.active
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {mod.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="font-display text-xs font-bold tracking-[0.1em] text-foreground uppercase">
                {mod.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Metrics Snapshot */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Metrics Snapshot
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.18 + i * 0.04 }}
              className="border border-border p-5"
            >
              <metric.icon size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="font-display text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.25 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Recent Activity
        </p>
        <div className="border border-border divide-y divide-border">
          {activityFeed.map((item, i) => {
            const Icon = activityIcon[item.type];
            return (
              <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={14} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <p className="text-sm text-foreground truncate">{item.text}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{item.time}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PortalDashboard;
