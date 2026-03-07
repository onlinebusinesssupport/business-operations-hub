import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Settings, Zap, Target, Globe, Sparkles, Compass, ArrowRight,
  CheckCircle2, MessageSquare, Inbox, Clock, Activity, Gauge,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OnboardingWizard from "@/components/OnboardingWizard";
import WelcomeTour from "@/components/WelcomeTour";
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

const retainerColor = (pct: number) => {
  if (pct >= 100) return "bg-destructive";
  if (pct >= 75) return "bg-amber-500";
  return "bg-emerald-500";
};

const PortalDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed, full_name, first_login")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setShowWelcome(!data.onboarding_completed);
        setUserName(data.full_name || "");
        // Show tour if onboarding is done but it's first login
        if (data.onboarding_completed && (data as any).first_login) {
          setShowTour(true);
        }
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

  const { data: clientData } = useQuery({
    queryKey: ["portal-client-full"],
    queryFn: async () => {
      const { data: clientId } = await supabase.rpc("get_my_client_id");
      if (!clientId) return null;
      const { data: client } = await supabase.from("clients")
        .select("services, status, subscription_status, retainer_limit, retainer_used, tier, monthly_rate")
        .eq("id", clientId).maybeSingle();
      return { ...(client || {}), clientId };
    },
  });

  const inProgress = workItems.filter((w: any) => w.status === "in_progress").length;
  const completed = workItems.filter((w: any) => w.status === "complete").length;
  const totalWork = workItems.length;
  const openRequests = requests.filter((r: any) => r.status === "new" || r.status === "in_progress").length;

  const taskCompletion = totalWork > 0 ? Math.round((completed / totalWork) * 25) : 0;
  const executionRate = totalWork > 0 ? Math.round((inProgress / totalWork) * 25) : 0;
  const growthScore = Math.min(taskCompletion + executionRate, 100);

  const activeServices = (clientData as any)?.services || [];
  const retainerUsed = (clientData as any)?.retainer_used || 0;
  const retainerLimit = (clientData as any)?.retainer_limit || 40;
  const retainerPct = retainerLimit > 0 ? Math.round((retainerUsed / retainerLimit) * 100) : 0;
  const subscriptionStatus = (clientData as any)?.subscription_status || "active";
  const tier = (clientData as any)?.tier || "standard";

  const priorities = workItems
    .filter((w: any) => w.status === "in_progress" || w.status === "awaiting_client" || w.status === "in_review")
    .slice(0, 4);

  if (showWelcome === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (showWelcome) {
    return <OnboardingWizard initialName={userName} onComplete={() => {
      setShowWelcome(false);
      setShowTour(true); // Show tour after onboarding completes
      queryClient.invalidateQueries({ queryKey: ["portal-dash-work"] });
      queryClient.invalidateQueries({ queryKey: ["portal-dash-requests"] });
      queryClient.invalidateQueries({ queryKey: ["portal-client-full"] });
    }} />;
  }

  const subStatusLabel: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600" },
    at_risk: { label: "At Risk", color: "bg-amber-500/10 text-amber-600" },
    paused: { label: "Paused", color: "bg-secondary text-muted-foreground" },
    cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
  };

  const tierLabels: Record<string, string> = {
    starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise",
  };

  return (
    <div className="space-y-10">
      {/* Welcome Tour Modal */}
      {showTour && (
        <WelcomeTour
          userName={userName}
          onClose={() => setShowTour(false)}
        />
      )}

      {/* Header */}
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {userName ? `Welcome back, ${userName}.` : "Welcome back."}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Let's build momentum.</p>
          </div>
          <GrowthScore score={growthScore} />
        </div>
      </motion.div>

      {/* Subscription & Retainer Summary */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.03 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-border p-5">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-2">Subscription</p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 ${subStatusLabel[subscriptionStatus]?.color || ""}`}>
                {subStatusLabel[subscriptionStatus]?.label || "Active"}
              </span>
              <span className="text-xs text-muted-foreground">· {tierLabels[tier] || "Standard"} Plan</span>
            </div>
          </div>
          <div className="border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Retainer Usage</p>
              <span className="text-xs text-muted-foreground">{retainerUsed}/{retainerLimit}h</span>
            </div>
            <div className="h-2.5 bg-accent rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${retainerColor(retainerPct)}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(retainerPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {retainerPct >= 100 ? "Retainer exceeded" : retainerPct >= 75 ? "Approaching limit" : "Healthy usage"}
            </p>
          </div>
          <div className="border border-border p-5">
            <Gauge size={16} className="text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-foreground">{openRequests}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Open Requests</p>
          </div>
        </div>
      </motion.div>

      {/* Active Studios */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.05 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Active Studios</p>
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
              <motion.div key={mod.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}>
                <Link to={mod.href} className="block border border-border p-5 hover:border-primary/40 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-3">
                    <mod.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                    <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {isActive ? "Active" : mod.premium ? "Add-on" : "Inactive"}
                    </span>
                  </div>
                  <p className="font-display text-xs font-bold tracking-[0.1em] text-foreground uppercase">{mod.name}</p>
                  {isActive && <p className="text-[10px] text-muted-foreground mt-1.5">In execution</p>}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Momentum Metrics */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Momentum Metrics</p>
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
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(dim.value / dim.max) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Priorities */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Current Priorities</p>
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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.priority || "medium"} priority</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary uppercase tracking-wider font-medium">
                    {item.status === "in_review" ? "In Review" : item.status === "awaiting_client" ? "Awaiting You" : "In Progress"}
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

      {/* Recent Activity Feed */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Recent Movement</p>
          <Link to="/portal/progress" className="text-[11px] text-primary font-medium flex items-center gap-1 hover:underline">
            Full timeline <ArrowRight size={10} />
          </Link>
        </div>
        <ActivityFeed title="" limit={8} />
      </motion.div>
    </div>
  );
};

export default PortalDashboard;
