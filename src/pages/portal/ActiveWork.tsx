import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Inbox,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WorkflowEngine from "@/components/WorkflowEngine";
import { useAuth } from "@/contexts/AuthContext";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusLabel: Record<string, string> = {
  queued: "Queued",
  in_progress: "In Progress",
  awaiting_client: "Awaiting Client",
  in_review: "In Review",
  complete: "Complete",
};

const ActiveWork = () => {
  const { user } = useAuth();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc("get_my_client_id");
      if (data) setClientId(data);
    };
    load();
  }, [user]);

  const { data: workItems = [], isLoading } = useQuery({
    queryKey: ["portal-work-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Realtime
  useEffect(() => {
    if (!clientId) return;
    const ch = supabase
      .channel("portal-work-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "work_items" }, () => {
        // Re-fetch handled by react-query refetch
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [clientId]);

  const { data: stageCounts = {} } = useQuery({
    queryKey: ["portal-stage-counts", workItems.map((w: any) => w.id).join(",")],
    enabled: workItems.length > 0,
    queryFn: async () => {
      const ids = workItems.map((w: any) => w.id);
      const { data } = await supabase
        .from("workflow_stages")
        .select("work_item_id, status")
        .in("work_item_id", ids);

      const counts: Record<string, { total: number; complete: number }> = {};
      data?.forEach((s: any) => {
        if (!counts[s.work_item_id]) counts[s.work_item_id] = { total: 0, complete: 0 };
        counts[s.work_item_id].total++;
        if (s.status === "complete") counts[s.work_item_id].complete++;
      });
      return counts;
    },
  });

  const active = workItems.filter((w: any) => w.status !== "complete");
  const completed = workItems.filter((w: any) => w.status === "complete");

  const getProgressValue = (item: any) => {
    const sc = stageCounts[item.id];
    if (sc && sc.total > 0) return (sc.complete / sc.total) * 100;
    // Fallback to status-based
    return ({ queued: 10, in_progress: 35, awaiting_client: 55, in_review: 80, complete: 100 }[item.status as string] || 0);
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Active Work
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Track every project through its production pipeline. Click to expand the workflow stages.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={18} className="animate-spin text-muted-foreground" />
        </div>
      ) : workItems.length === 0 ? (
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.06 }} className="border border-border p-12 text-center">
          <Inbox size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No projects yet. When your team starts work, it will appear here.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {[...active, ...completed].map((item: any, i: number) => {
            const isExpanded = expandedItem === item.id;
            const pv = getProgressValue(item);
            const sc = stageCounts[item.id];

            return (
              <motion.div
                key={item.id}
                {...stagger}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`border transition-all duration-200 ${
                  isExpanded ? "border-foreground/20" : "border-border hover:border-foreground/10"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="w-full p-5 flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "complete" ? "bg-primary" : "bg-foreground"
                        }`} />
                        {statusLabel[item.status] || item.status}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    )}
                    {sc && sc.total > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {sc.complete}/{sc.total} stages complete
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Progress value={pv} className="w-20 h-1" />
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{Math.round(pv)}%</span>
                    </div>
                    {item.deadline && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock size={10} strokeWidth={1.5} />
                        {new Date(item.deadline).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </div>
                    )}
                    {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded workflow */}
                <AnimatePresence>
                  {isExpanded && clientId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-5">
                        <WorkflowEngine
                          workItemId={item.id}
                          workItemTitle={item.title}
                          clientId={clientId}
                          isAdmin={false}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveWork;
