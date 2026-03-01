import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowRight, CheckCircle2, Edit, FileUp, DollarSign, GripVertical, MessageSquare } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const actionIcons: Record<string, any> = {
  drag: GripVertical,
  status_change: ArrowRight,
  field_edit: Edit,
  file_upload: FileUp,
  payment_marked: DollarSign,
  created: CheckCircle2,
  comment: MessageSquare,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface ActivityFeedProps {
  clientId?: string | null; // null = global (admin), string = filtered (client)
  limit?: number;
  title?: string;
  className?: string;
}

export const ActivityFeed = ({ clientId, limit = 15, title = "Activity", className = "" }: ActivityFeedProps) => {
  const queryClient = useQueryClient();
  const queryKey = clientId ? ["activity-log", clientId] : ["activity-log-global"];

  const { data: activities = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (clientId) {
        query = query.eq("client_id", clientId);
      }
      const { data } = await query;
      return (data as any[]) || [];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("activity-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey]);

  return (
    <div className={className}>
      <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3">
        {title}
      </p>
      <div className="border border-border divide-y divide-border">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <Activity size={22} className="mx-auto text-muted-foreground/40 mb-2" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          </div>
        ) : (
          activities.map((a: any, i: number) => {
            const Icon = actionIcons[a.action] || Activity;
            const details = a.details || {};
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="p-3 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {details.actor_initial ? (
                      <span className="text-[10px] font-bold text-primary">{details.actor_initial}</span>
                    ) : (
                      <Icon size={12} className="text-primary" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="text-[13px] text-foreground truncate">
                    {details.summary || `${a.action} on ${a.entity_type}`}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                  {timeAgo(a.created_at)}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
