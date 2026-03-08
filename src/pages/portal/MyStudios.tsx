import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Briefcase,
  Cpu,
  PenTool,
  Plane,
  Award,
  Power,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Pod {
  id: string;
  client_id: string;
  name: string;
  status: string;
  config: Record<string, unknown> | null;
  created_at: string;
}

interface PodDefinition {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const AVAILABLE_PODS: PodDefinition[] = [
  {
    name: "Marketing Studio",
    description: "Social media management, content strategy, and brand campaigns.",
    icon: Megaphone,
    color: "hsl(var(--primary))",
  },
  {
    name: "Executive Ops Pod",
    description: "Calendar, inbox, and executive-level operational support.",
    icon: Briefcase,
    color: "hsl(var(--accent-foreground))",
  },
  {
    name: "Systems Build",
    description: "CRM setup, automations, and workflow architecture.",
    icon: Cpu,
    color: "hsl(var(--primary))",
  },
  {
    name: "Content Production",
    description: "Copywriting, video editing, graphic design, and asset creation.",
    icon: PenTool,
    color: "hsl(var(--accent-foreground))",
  },
  {
    name: "Travel & Experiences",
    description: "Curated travel booking, itineraries, and team experiences.",
    icon: Plane,
    color: "hsl(var(--primary))",
  },
  {
    name: "Grants & Awards",
    description: "Grant research, application writing, and award submissions.",
    icon: Award,
    color: "hsl(var(--accent-foreground))",
  },
];

const ONBOARDING_STEPS = [
  "Pod activated",
  "NDA / MOU review",
  "Kick-off brief",
  "Pod live",
];

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const MyStudios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const { data: cid } = await supabase.rpc("get_my_client_id");
    if (cid) {
      setClientId(cid);
      const { data } = await supabase
        .from("pods")
        .select("*")
        .eq("client_id", cid);
      if (data) setPods(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel("my-pods")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pods", filter: `client_id=eq.${clientId}` },
        () => fetchData()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId, fetchData]);

  const getPodStatus = (podName: string): Pod | undefined =>
    pods.find((p) => p.name === podName);

  const getOnboardingStep = (pod: Pod): number => {
    const cfg = pod.config as Record<string, unknown> | null;
    return (cfg?.onboarding_step as number) ?? 1;
  };

  const handleActivate = async (podDef: PodDefinition) => {
    if (!clientId || activating) return;
    setActivating(podDef.name);

    try {
      const { error } = await supabase.functions.invoke("activate-pod", {
        body: { client_id: clientId, pod_name: podDef.name },
      });

      if (error) throw error;

      toast({
        title: "Pod activated",
        description: `${podDef.name} is being set up. You'll see progress here shortly.`,
      });
      await fetchData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast({ title: "Activation failed", description: msg, variant: "destructive" });
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          My Studios
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Activate the service pods you need. Each pod spins up a dedicated workspace with its own onboarding flow.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {AVAILABLE_PODS.map((podDef, i) => {
          const existing = getPodStatus(podDef.name);
          const isActive = existing?.status === "active";
          const isOnboarding = existing && existing.status !== "active";
          const step = existing ? getOnboardingStep(existing) : 0;
          const isCurrentlyActivating = activating === podDef.name;
          const Icon = podDef.icon;

          return (
            <motion.div
              key={podDef.name}
              {...fade}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`border p-6 space-y-4 transition-all duration-200 ${
                isActive
                  ? "border-primary/30 bg-primary/[0.03]"
                  : "border-border hover:border-foreground/20"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center"
                    style={{ color: isActive ? podDef.color : undefined }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className={isActive ? "" : "text-muted-foreground"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{podDef.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                      {isActive ? "Live" : isOnboarding ? "Onboarding" : "Available"}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <CheckCircle2
                    size={16}
                    className="text-primary shrink-0 mt-1"
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {podDef.description}
              </p>

              {/* Onboarding progress */}
              <AnimatePresence>
                {isOnboarding && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        Onboarding {step}/{ONBOARDING_STEPS.length}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {ONBOARDING_STEPS[step - 1] || "In progress"}
                      </p>
                    </div>
                    <Progress
                      value={(step / ONBOARDING_STEPS.length) * 100}
                      className="h-1"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action */}
              {!existing && (
                <button
                  onClick={() => handleActivate(podDef)}
                  disabled={!!activating}
                  className="flex items-center gap-2 text-xs font-medium text-foreground border border-border px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-150 disabled:opacity-40"
                >
                  {isCurrentlyActivating ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Power size={12} strokeWidth={1.5} />
                  )}
                  {isCurrentlyActivating ? "Activating…" : "Activate Pod"}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyStudios;
