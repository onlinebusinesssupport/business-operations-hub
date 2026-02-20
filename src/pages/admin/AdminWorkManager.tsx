import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, CheckCircle2, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type Status = "to_do" | "in_progress" | "in_review" | "done";
const statusLabels: Record<Status, string> = { to_do: "To Do", in_progress: "In Progress", in_review: "In Review", done: "Done" };
const statusBadge: Record<Status, string> = {
  to_do: "bg-accent text-foreground",
  in_progress: "bg-foreground text-background",
  in_review: "bg-accent text-foreground",
  done: "bg-accent text-muted-foreground",
};

const AdminWorkManager = () => {
  const [filter, setFilter] = useState<Status | "all">("all");
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
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("work_items").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-work-items"] }),
  });

  const filtered = filter === "all" ? workItems : workItems.filter((w: any) => w.status === filter);
  const statusOrder: Status[] = ["in_progress", "to_do", "in_review", "done"];
  const sorted = [...filtered].sort((a: any, b: any) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  const progressValue = (s: Status) => {
    const map: Record<Status, number> = { to_do: 0, in_progress: 50, in_review: 80, done: 100 };
    return map[s] || 0;
  };

  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Work Manager</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage all delivery work.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 text-xs">
          <Plus size={14} /> Add Work Item
        </Button>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">New Work Item</p>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Client *</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            </div>
          </div>
          <Button onClick={() => createWork.mutate(form)} disabled={createWork.isPending || !form.title || !form.client_id} className="gap-2 text-xs">
            {createWork.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create
          </Button>
        </motion.div>
      )}

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...statusOrder] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s as any)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider hover:border-foreground/30"}`}>
              {s === "all" ? "All" : statusLabels[s as Status]}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : sorted.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No work items found.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {sorted.map((item: any) => (
              <div key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {item.status === "done" ? <CheckCircle2 size={14} strokeWidth={1.5} className="mt-0.5 text-muted-foreground" /> : <Clock size={14} strokeWidth={1.5} className="mt-0.5 text-muted-foreground" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.clients?.name || "Unknown"} · {item.priority} priority</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Progress value={progressValue(item.status)} className="w-20 h-1.5" />
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus.mutate({ id: item.id, status: e.target.value as Status })}
                      className={`text-xs px-2 py-0.5 rounded-lg border-0 cursor-pointer ${statusBadge[item.status as Status] || ""}`}
                    >
                      {statusOrder.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                    {item.deadline && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
                {item.description && <p className="text-xs text-muted-foreground mt-2 ml-7">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminWorkManager;
