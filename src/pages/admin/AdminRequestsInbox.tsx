import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type ReqStatus = "new" | "in_progress" | "resolved";
const statusConfig: Record<ReqStatus, { label: string; dotColor: string }> = {
  new: { label: "Open", dotColor: "bg-blue-500" },
  in_progress: { label: "In Progress", dotColor: "bg-amber-500" },
  resolved: { label: "Resolved", dotColor: "bg-emerald-500" },
};
const statusOrder: ReqStatus[] = ["new", "in_progress", "resolved"];

const AdminRequestsInbox = () => {
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
      const { error: workError } = await supabase.from("work_items").insert({
        title: req.title,
        description: req.description || null,
        client_id: req.client_id,
        priority: req.priority || "medium",
        status: "to_do",
      });
      if (workError) throw workError;
      const { error: reqError } = await supabase.from("requests").update({ status: "resolved" }).eq("id", req.id);
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
    },
  });

  const handleDragEnd = useCallback((itemId: string, _source: string, destColumn: string) => {
    updateStatus.mutate({ id: itemId, status: destColumn });
    toast({ title: "Request status updated" });
  }, [updateStatus, toast]);

  const columns: KanbanColumn<any>[] = statusOrder.map((status) => ({
    id: status,
    title: statusConfig[status].label,
    color: statusConfig[status].dotColor,
    items: requests.filter((r: any) => r.status === status),
  }));

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Requests Inbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">Drag requests across columns to update their lifecycle.</p>
      </motion.div>

      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : (
          <KanbanBoard
            columns={columns}
            onDragEnd={handleDragEnd}
            getItemId={(item) => item.id}
            renderCard={(req: any, isDragging) => (
              <div
                className={`bg-card border border-divider p-3 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                  isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"
                }`}
              >
                <p className="text-sm font-medium text-foreground">{req.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {req.clients?.name || "—"} · {req.priority || "medium"}
                </p>
                {req.description && (
                  <p className="text-[10px] text-muted-foreground/70 mt-2 line-clamp-2">{req.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(req.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </span>
                  {req.status !== "resolved" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[10px] h-6 px-2 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        convertToWork.mutate(req);
                      }}
                      disabled={convertToWork.isPending}
                    >
                      {convertToWork.isPending ? <Loader2 size={10} className="animate-spin" /> : <ArrowRight size={10} />}
                      → Work
                    </Button>
                  )}
                </div>
              </div>
            )}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdminRequestsInbox;
