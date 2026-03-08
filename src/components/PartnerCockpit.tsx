import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Gauge, ListChecks, FolderOpen, MessageSquare, DollarSign,
  BarChart3, Settings, AlertTriangle, CheckCircle2, Clock, Plus, X,
  Loader2, Upload, Send, Eye, EyeOff, Star, Users, Download, FileCheck
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";
import { ActivityFeed } from "@/components/ActivityFeed";
import CrmModule from "@/components/CrmModule";
import ReputationDashboard from "@/components/ReputationDashboard";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type WorkStatus = "queued" | "in_progress" | "awaiting_client" | "in_review" | "complete";
const workStatusConfig: Record<WorkStatus, { label: string; dotColor: string }> = {
  queued: { label: "Queued", dotColor: "bg-muted-foreground/40" },
  in_progress: { label: "In Progress", dotColor: "bg-primary" },
  awaiting_client: { label: "Awaiting Client", dotColor: "bg-amber-500" },
  in_review: { label: "Review", dotColor: "bg-purple-500" },
  complete: { label: "Complete", dotColor: "bg-emerald-500" },
};
const workStatusOrder: WorkStatus[] = ["queued", "in_progress", "awaiting_client", "in_review", "complete"];

const tierLabels: Record<string, string> = {
  starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise",
};

const subStatusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600" },
  at_risk: { label: "At Risk", color: "bg-amber-500/10 text-amber-600" },
  paused: { label: "Paused", color: "bg-secondary text-muted-foreground" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
};

const retainerColor = (used: number, limit: number) => {
  if (limit === 0) return "bg-muted-foreground/30";
  const pct = used / limit;
  if (pct >= 1) return "bg-destructive";
  if (pct >= 0.75) return "bg-amber-500";
  return "bg-emerald-500";
};

const tabs = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "crm", label: "CRM", icon: Users },
  { id: "reputation", label: "Reviews", icon: Star },
  { id: "work", label: "Work Manager", icon: ListChecks },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "comms", label: "Updates", icon: MessageSquare },
  { id: "billing", label: "Billing", icon: DollarSign },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

interface PartnerCockpitProps {
  client: any;
  onBack: () => void;
  onUpdateField: (client: any, field: string, value: any) => Promise<void>;
}

const PartnerCockpit = ({ client, onBack, onUpdateField }: PartnerCockpitProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profile = client.profiles;
  const usedPct = client.retainer_limit > 0
    ? Math.round((client.retainer_used / client.retainer_limit) * 100)
    : 0;

  // ─── Data queries ───
  const { data: workItems = [] } = useQuery({
    queryKey: ["cockpit-work", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["cockpit-docs", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("documents").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: updates = [] } = useQuery({
    queryKey: ["cockpit-updates", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("updates").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["cockpit-invoices", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*").eq("client_id", client.id).order("invoice_date", { ascending: false });
      return data || [];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["cockpit-requests", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("requests").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  // ─── Mutations ───
  const updateWorkStatus = useCallback(async (itemId: string, status: WorkStatus, item: any) => {
    await supabase.from("work_items").update({ status }).eq("id", itemId);
    queryClient.invalidateQueries({ queryKey: ["cockpit-work", client.id] });
    await logActivity({
      client_id: client.id, action: "drag", entity_type: "work_item", entity_id: itemId,
      details: { summary: `Moved "${item.title}" → ${workStatusConfig[status].label}` },
    });
  }, [client.id, queryClient]);

  const updateWorkField = useCallback(async (item: any, field: string, value: string) => {
    await supabase.from("work_items").update({ [field]: value }).eq("id", item.id);
    queryClient.invalidateQueries({ queryKey: ["cockpit-work", client.id] });
  }, [client.id, queryClient]);

  const [showAddWork, setShowAddWork] = useState(false);
  const [newWork, setNewWork] = useState({ title: "", description: "", priority: "medium", deadline: "" });

  const createWorkMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("work_items").insert({
        client_id: client.id, title: newWork.title, description: newWork.description || null,
        priority: newWork.priority, deadline: newWork.deadline || null, status: "queued",
      });
      if (error) throw error;
      await logActivity({ client_id: client.id, action: "created", entity_type: "work_item", details: { summary: `Created "${newWork.title}"` } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cockpit-work", client.id] });
      setShowAddWork(false);
      setNewWork({ title: "", description: "", priority: "medium", deadline: "" });
      toast({ title: "Task created" });
    },
  });

  const [newUpdate, setNewUpdate] = useState("");
  const postUpdateMut = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("updates").insert({
        client_id: client.id, content: newUpdate, update_type: "progress", posted_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cockpit-updates", client.id] });
      setNewUpdate("");
      toast({ title: "Update posted" });
    },
  });

  const updateInvField = useCallback(async (inv: any, field: string, value: any) => {
    const updates: any = { [field]: value };
    if (field === "status" && value === "paid") updates.paid_date = new Date().toISOString().split("T")[0];
    await supabase.from("invoices").update(updates).eq("id", inv.id);
    queryClient.invalidateQueries({ queryKey: ["cockpit-invoices", client.id] });
    await logActivity({
      client_id: client.id, action: field === "status" ? "payment_marked" : "field_edit",
      entity_type: "invoice", entity_id: inv.id,
      details: { summary: `Invoice ${inv.invoice_number || ""} → ${value}` },
    });
  }, [client.id, queryClient]);

  // ─── Computed ───
  const workDone = workItems.filter((w: any) => w.status === "complete").length;
  const workTotal = workItems.length;
  const completionRate = workTotal > 0 ? Math.round((workDone / workTotal) * 100) : 0;
  const openRequests = requests.filter((r: any) => r.status === "new").length;
  const paidTotal = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const outstandingTotal = invoices.filter((i: any) => i.status !== "paid" && i.status !== "draft").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const fmt = (n: number) => `R${n.toLocaleString("en-ZA")}`;

  const riskFlags: string[] = [];
  if (usedPct >= 90) riskFlags.push("Retainer near/exceeded limit");
  if (openRequests > 5) riskFlags.push(`${openRequests} open requests pending`);
  if (workItems.some((w: any) => w.deadline && new Date(w.deadline) < new Date() && w.status !== "complete"))
    riskFlags.push("Overdue tasks detected");

  const workColumns: KanbanColumn<any>[] = workStatusOrder.map((s) => ({
    id: s, title: workStatusConfig[s].label, color: workStatusConfig[s].dotColor,
    items: workItems.filter((w: any) => w.status === s),
  }));

  const priorityColor = (p: string) => p === "high" ? "text-destructive" : p === "low" ? "text-muted-foreground/50" : "text-muted-foreground";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fade} transition={{ duration: 0.3 }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Partner Workspaces
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{client.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 ${subStatusConfig[client.subscription_status]?.color || ""}`}>
                {subStatusConfig[client.subscription_status]?.label || "Active"}
              </span>
              <span className="text-xs text-muted-foreground">{tierLabels[client.tier] || "Standard"} Plan</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{profile?.email || "—"}</span>
            </div>
          </div>
          <select
            value={client.subscription_status}
            onChange={(e) => onUpdateField(client, "subscription_status", e.target.value)}
            className="text-xs px-3 py-1.5 bg-card border border-border focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {Object.entries(subStatusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 text-[11px] px-3 py-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <tab.icon size={13} strokeWidth={1.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" {...fade} transition={{ duration: 0.25 }} className="space-y-6">
            {/* Risk flags */}
            {riskFlags.length > 0 && (
              <div className="border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-xs font-medium text-foreground">Risk Flags</span>
                </div>
                {riskFlags.map((f) => (
                  <p key={f} className="text-xs text-muted-foreground pl-6">• {f}</p>
                ))}
              </div>
            )}

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Retainer</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-foreground">{client.retainer_used}</span>
                  <span className="text-xs text-muted-foreground">/ {client.retainer_limit}h</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden mt-2">
                  <motion.div className={`h-full rounded-full ${retainerColor(client.retainer_used, client.retainer_limit)}`}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(usedPct, 100)}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
              <div className="border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Task Completion</p>
                <span className="font-display text-2xl font-bold text-foreground">{completionRate}%</span>
                <p className="text-[10px] text-muted-foreground mt-1">{workDone}/{workTotal} done</p>
              </div>
              <div className="border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
                <span className="font-display text-2xl font-bold text-foreground">{fmt(paidTotal)}</span>
                {outstandingTotal > 0 && <p className="text-[10px] text-muted-foreground mt-1">{fmt(outstandingTotal)} outstanding</p>}
              </div>
              <div className="border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Open Requests</p>
                <span className="font-display text-2xl font-bold text-foreground">{openRequests}</span>
              </div>
            </div>

            {/* Contact + Studios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border p-5 space-y-3">
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Contact</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{profile?.full_name || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{profile?.email || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{profile?.phone || "—"}</span></div>
                </div>
              </div>
              <div className="border border-border p-5 space-y-3">
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Active Studios</p>
                <div className="flex flex-wrap gap-2">
                  {(client.services || []).map((s: string) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1.5">{s}</span>
                  ))}
                  {(!client.services || client.services.length === 0) && (
                    <span className="text-xs text-muted-foreground">No studios assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Activity timeline */}
            <ActivityFeed clientId={client.id} title="Partner Activity" limit={10} />
          </motion.div>
        )}

        {activeTab === "crm" && (
          <motion.div key="crm" {...fade} transition={{ duration: 0.25 }}>
            <CrmModule client={client} onUpdateField={onUpdateField} />
          </motion.div>
        )}

        {activeTab === "reputation" && (
          <motion.div key="reputation" {...fade} transition={{ duration: 0.25 }}>
            <ReputationDashboard clientId={client.id} />
          </motion.div>
        )}

        {activeTab === "work" && (
          <motion.div key="work" {...fade} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{workTotal} tasks · {completionRate}% complete</p>
              <Button onClick={() => setShowAddWork(true)} size="sm" className="gap-2 text-xs"><Plus size={14} /> Add Task</Button>
            </div>

            {showAddWork && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">New Task</p>
                  <button onClick={() => setShowAddWork(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={newWork.title} onChange={(e) => setNewWork({ ...newWork, title: e.target.value })} placeholder="Task title *" className="px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                  <select value={newWork.priority} onChange={(e) => setNewWork({ ...newWork, priority: e.target.value })} className="px-3 py-2 text-sm bg-background border border-border">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                  <input type="date" value={newWork.deadline} onChange={(e) => setNewWork({ ...newWork, deadline: e.target.value })} className="px-3 py-2 text-sm bg-background border border-border" />
                  <textarea value={newWork.description} onChange={(e) => setNewWork({ ...newWork, description: e.target.value })} placeholder="Description" rows={2} className="px-3 py-2 text-sm bg-background border border-border resize-none" />
                </div>
                <Button onClick={() => createWorkMut.mutate()} disabled={createWorkMut.isPending || !newWork.title} size="sm" className="gap-2 text-xs">
                  {createWorkMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Create
                </Button>
              </motion.div>
            )}

            <KanbanBoard
              columns={workColumns}
              onDragEnd={(itemId, _src, dest) => {
                const item = workItems.find((w: any) => w.id === itemId);
                if (item) updateWorkStatus(itemId, dest as WorkStatus, item);
              }}
              getItemId={(item) => item.id}
              renderCard={(item: any, isDragging) => (
                <div className={`bg-card border border-divider p-3 cursor-grab active:cursor-grabbing transition-all ${isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"}`}>
                  <InlineEdit value={item.title} onSave={(v) => updateWorkField(item, "title", v)} className="text-sm font-medium text-foreground" />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${priorityColor(item.priority)}`}>{item.priority}</span>
                    {item.deadline && <span className="text-[10px] text-muted-foreground">{new Date(item.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>}
                  </div>
                  <InlineEdit value={item.description || ""} onSave={(v) => updateWorkField(item, "description", v)} className="text-[10px] text-muted-foreground/70 mt-2" placeholder="Add notes..." multiline />
                </div>
              )}
            />
          </motion.div>
        )}

        {activeTab === "files" && (
          <motion.div key="files" {...fade} transition={{ duration: 0.25 }} className="space-y-4">
            {documents.length === 0 ? (
              <div className="border border-border p-12 text-center">
                <FolderOpen size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">No documents yet.</p>
              </div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderOpen size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.category} · {new Date(doc.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "comms" && (
          <motion.div key="comms" {...fade} transition={{ duration: 0.25 }} className="space-y-4">
            {/* Post update */}
            <div className="border border-border p-4 flex gap-3">
              <textarea
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                placeholder="Post an update to the client..."
                rows={2}
                className="flex-1 px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
              <Button onClick={() => postUpdateMut.mutate()} disabled={postUpdateMut.isPending || !newUpdate.trim()} size="sm" className="gap-2 text-xs self-end">
                <Send size={12} /> Post
              </Button>
            </div>

            {/* Thread */}
            {updates.length === 0 ? (
              <div className="border border-border p-8 text-center">
                <MessageSquare size={22} className="mx-auto text-muted-foreground/40 mb-2" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              </div>
            ) : (
              <div className="border border-border divide-y divide-border">
                {updates.map((u: any) => (
                  <div key={u.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-primary">{u.update_type || "update"}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>
                    </div>
                    <p className="text-sm text-foreground">{u.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "billing" && (
          <BillingTab
            client={client}
            invoices={invoices}
            paidTotal={paidTotal}
            outstandingTotal={outstandingTotal}
            fmt={fmt}
            onUpdateField={onUpdateField}
            updateInvField={updateInvField}
            queryClient={queryClient}
          />
        )}

        {activeTab === "insights" && (
          <motion.div key="insights" {...fade} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border p-5">
                <p className="text-xs text-muted-foreground mb-2">Work Velocity</p>
                <div className="space-y-2">
                  {workStatusOrder.map((s) => {
                    const count = workItems.filter((w: any) => w.status === s).length;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${workStatusConfig[s].dotColor}`} />
                        <span className="text-xs text-muted-foreground flex-1">{workStatusConfig[s].label}</span>
                        <span className="text-xs font-medium text-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border border-border p-5">
                <p className="text-xs text-muted-foreground mb-2">Retainer Utilisation</p>
                <div className="flex items-end gap-1 mt-3">
                  <span className="font-display text-3xl font-bold text-foreground">{usedPct}%</span>
                  <span className="text-xs text-muted-foreground mb-1">used</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden mt-3">
                  <motion.div className={`h-full rounded-full ${retainerColor(client.retainer_used, client.retainer_limit)}`}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(usedPct, 100)}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
              <div className="border border-border p-5">
                <p className="text-xs text-muted-foreground mb-2">Revenue Summary</p>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Collected</span><span className="text-foreground font-medium">{fmt(paidTotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Outstanding</span><span className="text-foreground font-medium">{fmt(outstandingTotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Invoices</span><span className="text-foreground font-medium">{invoices.length}</span></div>
                </div>
              </div>
            </div>

            <div className="border border-border p-8 text-center">
              <BarChart3 size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">Detailed studio analytics will auto-generate as more data flows in.</p>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div key="settings" {...fade} transition={{ duration: 0.25 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border p-5 space-y-3">
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Subscription</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tier</span>
                    <select value={client.tier || "standard"} onChange={(e) => onUpdateField(client, "tier", e.target.value)}
                      className="text-xs px-2 py-1 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="starter">Starter</option><option value="standard">Standard</option>
                      <option value="growth">Growth</option><option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly Rate</span>
                    <InlineEdit value={String(client.monthly_rate || 0)} onSave={(v) => onUpdateField(client, "monthly_rate", parseFloat(v) || 0)} className="text-sm text-foreground font-medium" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Retainer Limit</span>
                    <InlineEdit value={String(client.retainer_limit)} onSave={(v) => onUpdateField(client, "retainer_limit", parseInt(v) || 0)} className="text-sm text-foreground font-medium" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Retainer Used</span>
                    <InlineEdit value={String(client.retainer_used)} onSave={(v) => onUpdateField(client, "retainer_used", parseInt(v) || 0)} className="text-sm text-foreground font-medium" />
                  </div>
                </div>
              </div>
              <div className="border border-border p-5 space-y-3">
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Studios</p>
                <div className="flex flex-wrap gap-2">
                  {(client.services || []).map((s: string) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1.5">{s}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">To change studios, update the services field directly.</p>
              </div>
            </div>
            <div className="border border-border p-5 space-y-3">
              <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Notes</p>
              <InlineEdit value={client.notes || ""} onSave={(v) => onUpdateField(client, "notes", v)} className="text-sm text-foreground" placeholder="Add internal notes..." multiline />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PartnerCockpit;
