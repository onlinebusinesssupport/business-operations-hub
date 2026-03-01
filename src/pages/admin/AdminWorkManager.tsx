import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type Status = "to_do" | "in_progress" | "in_review" | "done";
const statusConfig: Record<Status, { label: string; dotColor: string }> = {
  to_do: { label: "To Do", dotColor: "bg-muted-foreground/40" },
  in_progress: { label: "In Progress", dotColor: "bg-primary" },
  in_review: { label: "In Review", dotColor: "bg-purple-500" },
  done: { label: "Done", dotColor: "bg-emerald-500" },
};
const statusOrder: Status[] = ["to_do", "in_progress", "in_review", "done"];

const AdminWorkManager = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", client_id: "", priority: "medium", deadline: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workItems = [], isLoading } = useQuery({
    queryKey: ["admin-work-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_items")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
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

  const createWork = useMutation({
    mutationFn: async (f: typeof form) => {
      const { error } = await supabase.from("work_items").insert({
        title: f.title,
        description: f.description || null,
        client_id: f.client_id,
        priority: f.priority,
        deadline: f.deadline || null,
        status: "to_do",
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
    items: workItems.filter((w: any) => w.status === status),
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
          <p className="mt-1 text-sm text-muted-foreground">Drag tasks across columns to update status.</p>
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
                className={`bg-card border border-divider p-3 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                  isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"
                }`}
              >
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
                    <span
                      className="text-[10px] text-muted-foreground/40 italic cursor-pointer hover:text-muted-foreground"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      + deadline
                    </span>
                  )}
                </div>
                <InlineEdit
                  value={item.description || ""}
                  onSave={(v) => updateField(item, "description", v)}
                  className="text-[10px] text-muted-foreground/70 mt-2"
                  placeholder="Add notes..."
                  multiline
                />
              </div>
            )}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AdminWorkManager;
