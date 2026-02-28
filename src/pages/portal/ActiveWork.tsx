import { motion } from "framer-motion";
import { Clock, CheckCircle2, ArrowRight, Inbox } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusLabel: Record<string, string> = {
  to_do: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Completed",
};

const progressValue = (s: string) =>
  ({ to_do: 10, in_progress: 50, in_review: 80, done: 100 }[s] || 0);

const ActiveWork = () => {
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

  const active = workItems.filter((w: any) => w.status !== "done");
  const completed = workItems.filter((w: any) => w.status === "done");

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Projects</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Current projects and their progress. Each item is tracked to ensure nothing is missed.
        </p>
      </motion.div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading projects...</p>
      ) : workItems.length === 0 ? (
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.06 }} className="border border-border p-12 text-center">
          <Inbox size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No projects yet. When your team starts work, it will appear here.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {[...active, ...completed].map((item: any, i: number) => (
            <motion.div
              key={item.id}
              {...stagger}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="bg-card border border-divider rounded-xl p-6 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status !== "done" ? "bg-foreground" : "bg-muted-foreground/50"}`} />
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Progress value={progressValue(item.status)} className="w-24 h-1.5" />
                  <span className="text-xs text-muted-foreground">{progressValue(item.status)}%</span>
                  {item.deadline && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} strokeWidth={1.5} />
                      {new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-divider flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {item.priority || "medium"} priority
                </span>
                {item.status === "done" ? (
                  <CheckCircle2 size={12} strokeWidth={1.5} className="text-muted-foreground" />
                ) : (
                  <ArrowRight size={12} strokeWidth={1.5} className="text-muted-foreground" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveWork;
