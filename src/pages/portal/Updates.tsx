import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, MessageSquare, Wrench, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stagger = {
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

const Updates = () => {
  const { data: updates = [], isLoading } = useQuery({
    queryKey: ["portal-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("updates")
        .select("*, work_items(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Updates</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          A timeline of progress, decisions, and improvements. Full transparency on project activity.
        </p>
      </motion.div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading updates...</p>
      ) : dateGroups.length === 0 ? (
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.06 }} className="border border-border p-12 text-center">
          <Inbox size={32} className="mx-auto text-muted-foreground mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No updates yet. Activity will appear here as work progresses.</p>
        </motion.div>
      ) : (
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-divider hidden md:block" />

          <div className="space-y-8">
            {dateGroups.map(([date, items], gi) => (
              <motion.div
                key={date}
                {...stagger}
                transition={{ duration: 0.3, delay: gi * 0.06 }}
              >
                <div className="flex items-center gap-3 mb-4 md:pl-6">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background hidden md:block absolute left-0" />
                  <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {date}
                  </span>
                </div>
                <div className="md:pl-6 space-y-2">
                  {(items as any[]).map((item: any) => {
                    const Icon = typeIcon[item.update_type] || MessageSquare;
                    return (
                      <div
                        key={item.id}
                        className="bg-card border border-divider rounded-xl p-4 flex items-start gap-3"
                      >
                        <Icon size={16} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                        <div>
                          <span className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                            {typeLabel[item.update_type] || item.update_type || "Update"}
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
    </div>
  );
};

export default Updates;
