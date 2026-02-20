import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type ReqStatus = "new" | "in_progress" | "resolved";
const statusLabels: Record<ReqStatus, string> = { new: "Open", in_progress: "In Progress", resolved: "Resolved" };
const statusStyles: Record<ReqStatus, string> = {
  new: "bg-foreground text-background",
  in_progress: "bg-accent text-foreground",
  resolved: "bg-accent text-muted-foreground",
};

const AdminRequestsInbox = () => {
  const [filter, setFilter] = useState<ReqStatus | "all">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const convertToWork = useMutation({
    mutationFn: async (req: any) => {
      // Create work item from request
      const { error: workError } = await supabase.from("work_items").insert({
        title: req.title,
        description: req.description || null,
        client_id: req.client_id,
        priority: req.priority || "medium",
        status: "to_do",
      });
      if (workError) throw workError;

      // Update request status to resolved
      const { error: reqError } = await supabase
        .from("requests")
        .update({ status: "resolved" })
        .eq("id", req.id);
      if (reqError) throw reqError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
      toast({ title: "Request converted to work item" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      toast({ title: "Status updated" });
    },
  });

  const filtered = filter === "all" ? requests : requests.filter((r: any) => r.status === filter);

  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl text-foreground">Requests Inbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">All client requests in one place.</p>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="flex gap-2 flex-wrap">
          {(["all", "new", "in_progress", "resolved"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s as any)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider hover:border-foreground/30"}`}>
              {s === "all" ? "All" : statusLabels[s as ReqStatus]}
              {s !== "all" && ` (${requests.filter((r: any) => r.status === s).length})`}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No requests found.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {filtered.map((req: any) => (
              <div key={req.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{req.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${statusStyles[req.status as ReqStatus] || ""}`}>
                        {statusLabels[req.status as ReqStatus] || req.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {req.clients?.name || "Unknown"} · {req.priority || "medium"} priority · {new Date(req.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </p>
                    {req.description && <p className="text-xs text-muted-foreground mt-2">{req.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {req.status !== "resolved" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => convertToWork.mutate(req)}
                          disabled={convertToWork.isPending}
                        >
                          {convertToWork.isPending ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                          Convert to Work
                        </Button>
                        {req.status === "new" && (
                          <Button size="sm" variant="ghost" className="text-xs" onClick={() => updateStatus.mutate({ id: req.id, status: "in_progress" })}>
                            Mark In Progress
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminRequestsInbox;
