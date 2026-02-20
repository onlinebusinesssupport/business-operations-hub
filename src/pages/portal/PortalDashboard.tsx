import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Zap,
  Target,
  Globe,
  Sparkles,
  Bell,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WelcomeDashboard from "@/components/WelcomeDashboard";
import GrowthScore from "@/components/GrowthScore";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/* Studio modules */
const studioModules = [
  { name: "Operations", icon: Settings, active: false },
  { name: "Automation", icon: Zap, active: false },
  { name: "Lead Engine", icon: Target, active: false },
  { name: "Socials", icon: Globe, active: false },
  { name: "Experiences", icon: Sparkles, active: false },
];

/* Metric placeholders */
const metrics = [
  { label: "Leads This Month", value: "—", icon: Target },
  { label: "Automations Live", value: "—", icon: Zap },
  { label: "In Motion", value: "—", icon: CheckCircle2 },
  { label: "Revenue Pipeline", value: "—", icon: Globe },
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

/* Placeholder score calculation */
const calculateGrowthScore = () => {
  const automationLevel = 0;   // 0-25
  const leadFlow = 0;          // 0-25
  const taskCompletion = 0;    // 0-25
  const digitalResponse = 0;   // 0-25
  return automationLevel + leadFlow + taskCompletion + digitalResponse;
};

const PortalDashboard = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const growthScore = calculateGrowthScore();

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
      {/* Header + Growth Score */}
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {userName ? `Welcome back, ${userName}. Let's move.` : "Welcome back. Let's move."}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="relative p-2 border border-border hover:bg-secondary transition-colors">
                <Bell size={16} className="text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
            </div>
          </div>
          <GrowthScore score={growthScore} />
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.03 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Growth Dimensions
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Automation Level", value: 0, max: 25 },
            { label: "Lead Flow Consistency", value: 0, max: 25 },
            { label: "Task Completion Rate", value: 0, max: 25 },
            { label: "Digital Responsiveness", value: 0, max: 25 },
          ].map((dim) => (
            <div key={dim.label} className="border border-border p-4">
              <p className="text-[11px] text-muted-foreground">{dim.label}</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="font-display text-lg font-bold text-foreground">{dim.value}</span>
                <span className="text-[10px] text-muted-foreground/60 mb-0.5">/ {dim.max}</span>
              </div>
              <div className="mt-2 h-1 bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(dim.value / dim.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Studio Overview */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.06 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Studios
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
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.12 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Insights
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
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
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }}>
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
