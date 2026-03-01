import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Settings, Zap, Target, Globe, Sparkles, Compass, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const studios = [
  {
    name: "Digital Presence",
    icon: Globe,
    description: "Brand voice, content strategy, social presence, and digital visibility.",
    href: "/portal/studios/socials",
    category: "primary",
  },
  {
    name: "Lead Engine",
    icon: Target,
    description: "Pipeline management, campaigns, outreach, and conversion tracking.",
    href: "/portal/studios/lead-engine",
    category: "primary",
  },
  {
    name: "Automation",
    icon: Zap,
    description: "Workflow automation, system integrations, and process orchestration.",
    href: "/portal/studios/automation",
    category: "primary",
  },
  {
    name: "Operations",
    icon: Settings,
    description: "Task management, SOPs, vendor coordination, and daily ops infrastructure.",
    href: "/portal/studios/operations",
    category: "primary",
  },
  {
    name: "Travel & Activities",
    icon: Sparkles,
    description: "Curated travel logistics, team experiences, and event coordination.",
    href: "/portal/studios/experiences",
    category: "premium",
  },
  {
    name: "Grants & Awards",
    icon: Compass,
    description: "Grant writing, award submissions, and funding applications.",
    href: "/portal/studios/experiences",
    category: "premium",
  },
];

const phaseLabel: Record<string, string> = {
  discovery: "Discovery",
  audit: "Audit",
  execution: "Execution",
  optimisation: "Optimisation",
};

const phaseColor: Record<string, string> = {
  discovery: "bg-amber-500/10 text-amber-600",
  audit: "bg-blue-500/10 text-blue-600",
  execution: "bg-primary/10 text-primary",
  optimisation: "bg-purple-500/10 text-purple-600",
};

const StudiosHub = () => {
  const { data: clientData } = useQuery({
    queryKey: ["portal-client-info"],
    queryFn: async () => {
      const { data: clientId } = await supabase.rpc("get_my_client_id");
      if (!clientId) return null;
      const { data } = await supabase.from("clients").select("services, status").eq("id", clientId).maybeSingle();
      return data;
    },
  });

  const { data: workItems = [] } = useQuery({
    queryKey: ["portal-studios-work"],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("id, title, status, updated_at").order("updated_at", { ascending: false });
      return data || [];
    },
  });

  const activeServices = clientData?.services || [];

  const getStudioStatus = (name: string) => {
    const isActive = activeServices.some((s: string) =>
      name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(name.toLowerCase().split(" ")[0])
    );
    return isActive;
  };

  // Determine phase from work items
  const getPhase = (name: string) => {
    const items = workItems.filter((w: any) =>
      w.title?.toLowerCase().includes(name.toLowerCase().split(" ")[0])
    );
    if (items.length === 0) return "discovery";
    const hasInProgress = items.some((w: any) => w.status === "in_progress");
    const allDone = items.every((w: any) => w.status === "done");
    if (allDone) return "optimisation";
    if (hasInProgress) return "execution";
    return "audit";
  };

  const lastUpdate = (name: string) => {
    const items = workItems.filter((w: any) =>
      w.title?.toLowerCase().includes(name.toLowerCase().split(" ")[0])
    );
    if (items.length === 0) return null;
    return items[0]?.updated_at;
  };

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Studios
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Modular engines powering your business infrastructure. Each studio operates as an independent system with dedicated strategy, execution, and reporting.
        </p>
      </motion.div>

      {/* Primary Studios */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Core Studios
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studios.filter(s => s.category === "primary").map((studio, i) => {
            const active = getStudioStatus(studio.name);
            const phase = active ? getPhase(studio.name) : null;
            const updated = active ? lastUpdate(studio.name) : null;
            return (
              <motion.div
                key={studio.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  to={studio.href}
                  className="block border border-border p-6 hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <studio.icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                    <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                      active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-[0.12em] text-foreground uppercase">
                    {studio.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {studio.description}
                  </p>

                  {active && phase && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${phaseColor[phase] || "bg-secondary text-muted-foreground"}`}>
                        {phaseLabel[phase] || phase}
                      </span>
                      {updated && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock size={10} strokeWidth={1.5} />
                          Updated {getTimeAgo(updated)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {active ? "Open Studio" : "Learn More"} <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Premium Add-ons */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Premium Add-ons
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studios.filter(s => s.category === "premium").map((studio, i) => {
            const active = getStudioStatus(studio.name);
            return (
              <motion.div
                key={studio.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              >
                <Link
                  to={studio.href}
                  className="block border border-border p-6 hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <studio.icon size={20} className="text-muted-foreground" strokeWidth={1.5} />
                    <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                      active ? "bg-primary/10 text-primary" : "bg-accent text-muted-foreground"
                    }`}>
                      {active ? "Active" : "Add-on"}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold tracking-[0.12em] text-foreground uppercase">
                    {studio.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {studio.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default StudiosHub;
