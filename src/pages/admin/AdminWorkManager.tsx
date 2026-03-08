import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";
import WorkflowEngine from "@/components/WorkflowEngine";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type Status = "queued" | "in_progress" | "awaiting_client" | "in_review" | "complete";
const statusConfig: Record<Status, { label: string; dotColor: string }> = {
  queued: { label: "Queued", dotColor: "bg-muted-foreground/40" },
  in_progress: { label: "In Progress", dotColor: "bg-primary" },
  awaiting_client: { label: "Awaiting Client", dotColor: "bg-amber-500" },
  in_review: { label: "Review", dotColor: "bg-purple-500" },
  complete: { label: "Complete", dotColor: "bg-emerald-500" },
};
const statusOrder: Status[] = ["queued", "in_progress", "awaiting_client", "in_review", "complete"];

const normalizeStatus = (s: string): Status => {
  if (s === "to_do") return "queued";
  if (s === "done") return "complete";
  if (statusOrder.includes(s as Status)) return s as Status;
  return "queued";
};

const AdminWorkManager = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", client_id: "", priority: "medium", deadline: "" });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workItems = [], isLoading } = useQuery({
    queryKey: ["admin-work-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_items")
        .select("*, clients(name)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Realtime for work items + workflow stages
  useEffect(() => {
    const ch = supabase
      .channel("admin-work-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "work_items" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "workflow_stages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [queryClient]);

  const createWork = useMutation({
    mutationFn: async (f: typeof form) => {
      const { error } = await supabase.from("work_items").insert({
        title: f.title,
        description: f.description || null,
        client_id: f.client_id,
        priority: f.priority,
        deadline: f.deadline || null,
        status: "queued",
      });
      if (error) throw error;
      await logActivity({
        client_id: f.client_id,
        action: "created",
        entity_type: "work_item",
        details: { summary: `Created task "${f.title}"` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
      toast({ title: "Work item created" });
      setShowCreate(false);
      setForm({ title: "", description: "", client_id: "", priority: "medium", deadline: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, item }: { id: string; status: Status; item: any }) => {
      const { error } = await supabase.from("work_items").update({ status }).eq("id", id);
      if (error) throw error;
      await logActivity({
        client_id: item.client_id,
        action: "drag",
        entity_type: "work_item",
        entity_id: id,
        details: { summary: `Moved "${item.title}" → ${statusConfig[status].label}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
    },
  });

  const updateField = useCallback(async (item: any, field: string, value: string) => {
    await supabase.from("work_items").update({ [field]: value }).eq("id", item.id);
    queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
    await logActivity({
      client_id: item.client_id,
      action: "field_edit",
      entity_type: "work_item",
      entity_id: item.id,
      details: { summary: `Updated ${field} on "${item.title}"`, field, new_value: value },
    });
  }, [queryClient]);

  const handleDragEnd = useCallback((itemId: string, _source: string, destColumn: string) => {
    const item = workItems.find((w: any) => w.id === itemId);
    if (!item) return;
    updateStatus.mutate({ id: itemId, status: destColumn as Status, item });
    toast({ title: "Status updated" });
  }, [updateStatus, toast, workItems]);

  const columns: KanbanColumn<any>[] = statusOrder.map((status) => ({
    id: status,
    title: statusConfig[status].label,
    color: statusConfig[status].dotColor,
    items: workItems.filter((w: any) => normalizeStatus(w.status) === status),
  }));

  const priorityColor = (p: string) => {
    if (p === "high") return "text-destructive";
    if (p === "low") return "text-muted-foreground/50";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Work Manager</h2>
          <p className="mt-1 text-sm text-muted-foreground">Drag tasks across columns. Click cards to view production pipeline stages.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 text-xs">
          <Plus size={14} /> Add Work Item
        </Button>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">New Work Item</p>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Client *</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            </div>
          </div>
          <Button onClick={() => createWork.mutate(form)} disabled={createWork.isPending || !form.title || !form.client_id} className="gap-2 text-xs">
            {createWork.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create
          </Button>
        </motion.div>
      )}

      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : (
          <KanbanBoard
            columns={columns}
            onDragEnd={handleDragEnd}
            getItemId={(item) => item.id}
            renderCard={(item: any, isDragging) => (
              <div
                className={`bg-card border border-divider transition-all duration-150 ${
                  isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"
                }`}
              >
                <div className="p-3 cursor-grab active:cursor-grabbing">
                  <InlineEdit
                    value={item.title}
                    onSave={(v) => updateField(item, "title", v)}
                    className="text-sm font-medium text-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {item.clients?.name || "—"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <InlineEdit
                      value={item.priority || "medium"}
                      onSave={(v) => updateField(item, "priority", v)}
                      className={`text-[10px] uppercase tracking-wider font-medium ${priorityColor(item.priority)}`}
                    />
                    {item.deadline ? (
                      <InlineEdit
                        value={item.deadline}
                        onSave={(v) => updateField(item, "deadline", v)}
                        className="text-[10px] text-muted-foreground"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40 italic">+ deadline</span>
                    )}
                  </div>

                  {/* Toggle workflow stages */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCard(expandedCard === item.id ? null : item.id);
                    }}
                    className="mt-2 text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {expandedCard === item.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    Production Pipeline
                  </button>
                </div>

                {/* Expanded workflow engine */}
                <AnimatePresence>
                  {expandedCard === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-divider overflow-hidden"
                    >
                      <div className="p-3">
                        <WorkflowEngine
                          workItemId={item.id}
                          workItemTitle={item.title}
                          clientId={item.client_id}
                          isAdmin={true}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdminWorkManager;
