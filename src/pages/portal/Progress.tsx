import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, MessageSquare, Wrench, Inbox, Clock, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const typeIcon: Record<string, any> = {
  progress: CheckCircle2,
  decision: ArrowUpRight,
  improvement: Wrench,
  note: MessageSquare,
};

const typeLabel: Record<string, string> = {
  progress: "Progress",
  decision: "Decision",
  improvement: "Improvement",
  note: "Note",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  complete: { label: "Complete", color: "bg-primary/10 text-primary" },
  in_progress: { label: "In Motion", color: "bg-amber-500/10 text-amber-600" },
  awaiting_client: { label: "Awaiting Client", color: "bg-amber-500/10 text-amber-600" },
  in_review: { label: "In Review", color: "bg-blue-500/10 text-blue-600" },
  queued: { label: "Queued", color: "bg-secondary text-muted-foreground" },
};

const Progress = () => {
  const { data: updates = [], isLoading: loadingUpdates } = useQuery({
    queryKey: ["portal-progress-updates"],
    queryFn: async () => {
      const { data } = await supabase
        .from("updates")
        .select("*, work_items(title)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: workItems = [], isLoading: loadingWork } = useQuery({
    queryKey: ["portal-progress-work"],
    queryFn: async () => {
      const { data } = await supabase
        .from("work_items")
        .select("id, title, status, description, deadline, updated_at, priority")
        .order("updated_at", { ascending: false });
      return data || [];
    },
  });

  const isLoading = loadingUpdates || loadingWork;

  const completed = workItems.filter((w: any) => w.status === "complete");
  const inMotion = workItems.filter((w: any) => ["in_progress", "awaiting_client", "in_review"].includes(w.status));
  const upcoming = workItems.filter((w: any) => w.status === "queued");

  // Group updates by date
  const grouped = updates.reduce((acc: Record<string, any[]>, update: any) => {
    const date = new Date(update.created_at).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(update);
    return acc;
  }, {});

  const dateGroups = Object.entries(grouped);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Progress
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Full transparency on what's been done, what's in motion, and what's coming next.
        </p>
      </motion.div>

      {/* Work Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed */}
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-primary" />
            Completed ({completed.length})
          </p>
          <div className="border border-border divide-y divide-border">
            {completed.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-muted-foreground">No completed work yet.</p>
              </div>
            ) : (
              completed.slice(0, 5).map((item: any) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-sm text-foreground">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* In Motion */}
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <Circle size={12} className="text-amber-500" />
            In Motion ({inMotion.length})
          </p>
          <div className="border border-border divide-y divide-border">
            {inMotion.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-muted-foreground">Nothing in motion right now.</p>
              </div>
            ) : (
              inMotion.map((item: any) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <Circle size={12} className="text-amber-500 mt-0.5 shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-sm text-foreground">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-medium ${statusConfig[item.status]?.color || "bg-secondary text-muted-foreground"}`}>
                          {statusConfig[item.status]?.label || item.status}
                        </span>
                        {item.deadline && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock size={9} /> {new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming */}
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
            <ArrowUpRight size={12} className="text-muted-foreground" />
            Upcoming ({upcoming.length})
          </p>
          <div className="border border-border divide-y divide-border">
            {upcoming.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-muted-foreground">No upcoming tasks scheduled.</p>
              </div>
            ) : (
              upcoming.slice(0, 5).map((item: any) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <Circle size={12} className="text-muted-foreground/40 mt-0.5 shrink-0" strokeWidth={2} />
                    <div>
                      <p className="text-sm text-foreground">{item.title}</p>
                      {item.deadline && (
                        <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Clock size={9} /> Due {new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.2 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Activity Timeline
        </p>

        {dateGroups.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <Inbox size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No updates yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Activity will appear here as work progresses.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {dateGroups.map(([date, items], gi) => (
                <motion.div
                  key={date}
                  {...fade}
                  transition={{ duration: 0.3, delay: 0.25 + gi * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-3 md:pl-6">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background hidden md:block absolute left-0" />
                    <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                      {date}
                    </span>
                  </div>
                  <div className="md:pl-6 space-y-2">
                    {(items as any[]).map((item: any) => {
                      const Icon = typeIcon[item.update_type] || MessageSquare;
                      return (
                        <div key={item.id} className="border border-border p-4 flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon size={12} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <div>
                            <span className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                              {typeLabel[item.update_type] || "Update"}
                            </span>
                            <p className="text-sm text-foreground mt-0.5">{item.content}</p>
                            {item.work_items?.title && (
                              <p className="text-xs text-muted-foreground mt-1">Re: {item.work_items.title}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Progress;
