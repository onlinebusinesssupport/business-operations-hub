import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Settings,
  Zap,
  Target,
  Globe,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Inbox,
  Clock,
  Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import OnboardingWizard from "@/components/OnboardingWizard";
import GrowthScore from "@/components/GrowthScore";
import { ActivityFeed } from "@/components/ActivityFeed";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const studioModules = [
  { name: "Digital Presence", icon: Globe, href: "/portal/studios/socials" },
  { name: "Lead Engine", icon: Target, href: "/portal/studios/lead-engine" },
  { name: "Automation", icon: Zap, href: "/portal/studios/automation" },
  { name: "Operations", icon: Settings, href: "/portal/studios/operations" },
  { name: "Travel & Activities", icon: Sparkles, href: "/portal/studios/experiences", premium: true },
  { name: "Grants & Awards", icon: Compass, href: "/portal/studios/experiences", premium: true },
];

const activityIcon: Record<string, any> = {
  progress: CheckCircle2,
  decision: MessageSquare,
  improvement: Zap,
  note: MessageSquare,
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

  const { data: workItems = [] } = useQuery({
    queryKey: ["portal-dash-work"],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("id, status, priority, title, deadline, updated_at");
      return data || [];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["portal-dash-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("requests").select("id, status");
      return data || [];
    },
  });

  const { data: recentUpdates = [] } = useQuery({
    queryKey: ["portal-dash-updates"],
    queryFn: async () => {
      const { data } = await supabase
        .from("updates")
        .select("id, content, update_type, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  const { data: clientServices } = useQuery({
    queryKey: ["portal-client-services"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_my_client_id");
      if (!data) return null;
      const { data: client } = await supabase.from("clients").select("services, status").eq("id", data).maybeSingle();
      return client;
    },
  });

  const inProgress = workItems.filter((w: any) => w.status === "in_progress").length;
  const completed = workItems.filter((w: any) => w.status === "done").length;
  const totalWork = workItems.length;
  const openRequests = requests.filter((r: any) => r.status === "new" || r.status === "in_progress").length;

  const taskCompletion = totalWork > 0 ? Math.round((completed / totalWork) * 25) : 0;
  const executionRate = totalWork > 0 ? Math.round((inProgress / totalWork) * 25) : 0;
  const growthScore = Math.min(taskCompletion + executionRate, 100);

  // Determine active studios from client services
  const activeServices = clientServices?.services || [];

  // Current priorities: in-progress work items
  const priorities = workItems
    .filter((w: any) => w.status === "in_progress" || w.status === "in_review")
    .slice(0, 4);

  if (showWelcome === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showWelcome) {
    return <OnboardingWizard initialName={userName} onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {userName ? `Welcome back, ${userName}.` : "Welcome back."}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Let's build momentum.
            </p>
          </div>
          <GrowthScore score={growthScore} />
        </div>
      </motion.div>

      {/* Active Studios */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.05 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Active Studios
          </p>
          <Link to="/portal/studios" className="text-[11px] text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {studioModules.map((mod, i) => {
            const isActive = activeServices.some((s: string) =>
              mod.name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(mod.name.toLowerCase().split(" ")[0])
            );
            return (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
              >
                <Link
                  to={mod.href}
                  className="block border border-border p-5 hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <mod.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                    <span
                      className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isActive ? "Active" : mod.premium ? "Add-on" : "Inactive"}
                    </span>
                  </div>
                  <p className="font-display text-xs font-bold tracking-[0.1em] text-foreground uppercase">
                    {mod.name}
                  </p>
                  {isActive && (
                    <p className="text-[10px] text-muted-foreground mt-1.5">In execution</p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Momentum Metrics */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Momentum Metrics
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Automation Level", value: 0, max: 25 },
            { label: "Lead Flow Consistency", value: 0, max: 25 },
            { label: "Execution Rate", value: executionRate, max: 25 },
            { label: "Digital Responsiveness", value: taskCompletion, max: 25 },
          ].map((dim) => (
            <div key={dim.label} className="border border-border p-4">
              <p className="text-[11px] text-muted-foreground">{dim.label}</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="font-display text-lg font-bold text-foreground">{dim.value}</span>
                <span className="text-[10px] text-muted-foreground/60 mb-0.5">/ {dim.max}</span>
              </div>
              <div className="mt-2 h-1 bg-border overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(dim.value / dim.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Priorities */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Current Priorities
        </p>
        {priorities.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <Activity size={24} className="mx-auto text-muted-foreground/40 mb-2" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">All clear. No active priorities right now.</p>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            {priorities.map((item: any) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {item.priority || "medium"} priority
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary uppercase tracking-wider font-medium">
                    {item.status === "in_review" ? "In Review" : "In Progress"}
                  </span>
                  {item.deadline && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock size={10} strokeWidth={1.5} />
                      {new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Movement Feed — now powered by activity_log */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Recent Movement
          </p>
          <Link to="/portal/progress" className="text-[11px] text-primary font-medium flex items-center gap-1 hover:underline">
            Full timeline <ArrowRight size={10} />
          </Link>
        </div>
        <ActivityFeed clientId={clientServices ? undefined : undefined} title="" limit={8} />
      </motion.div>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default PortalDashboard;
