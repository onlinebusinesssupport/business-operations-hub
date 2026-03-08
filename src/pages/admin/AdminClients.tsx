import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Plus, Loader2, X, Gauge, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";
import { formatCurrency } from "@/lib/currency";
import { getComplianceDisplay } from "@/lib/mask";
import PartnerCockpit from "@/components/PartnerCockpit";
import LekoRiskGuard from "@/components/LekoRiskGuard";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type SubStatus = "active" | "at_risk" | "paused" | "cancelled";
const subStatusConfig: Record<SubStatus, { label: string; dotColor: string }> = {
  active: { label: "Active", dotColor: "bg-emerald-500" },
  at_risk: { label: "At Risk", dotColor: "bg-amber-500" },
  paused: { label: "Paused", dotColor: "bg-muted-foreground/50" },
  cancelled: { label: "Cancelled", dotColor: "bg-destructive" },
};
const subStatusOrder: SubStatus[] = ["active", "at_risk", "paused", "cancelled"];

const tierLabels: Record<string, string> = {
  starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise",
};

const retainerColor = (used: number, limit: number) => {
  if (limit === 0) return "bg-muted-foreground/30";
  const pct = used / limit;
  if (pct >= 1) return "bg-destructive";
  if (pct >= 0.75) return "bg-amber-500";
  return "bg-emerald-500";
};

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "board">("board");
  const [showInvite, setShowInvite] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", full_name: "", company_name: "", services: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, profiles:contact_profile_id(full_name, email, phone, company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (form: typeof inviteForm) => {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: {
          email: form.email, full_name: form.full_name, company_name: form.company_name,
          role: "client", services: form.services ? form.services.split(",").map((s) => s.trim()) : [],
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast({ title: "Client invited", description: data?.message });
      setShowInvite(false);
      setInviteForm({ email: "", full_name: "", company_name: "", services: "" });
    },
    onError: (err: Error) => toast({ title: "Invite failed", description: err.message, variant: "destructive" }),
  });

  const updateField = useCallback(async (client: any, field: string, value: any) => {
    await supabase.from("clients").update({ [field]: value }).eq("id", client.id);
    queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    await logActivity({
      client_id: client.id,
      action: field === "subscription_status" ? "drag" : "field_edit",
      entity_type: "client",
      entity_id: client.id,
      details: {
        summary: field === "subscription_status"
          ? `Moved "${client.name}" → ${(subStatusConfig as any)[value]?.label || value}`
          : `Updated ${field} on "${client.name}"`,
        field, new_value: String(value),
      },
    });
  }, [queryClient]);

  const handleDeleteClient = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      // Delete linked records first
      await supabase.from("work_items").delete().eq("client_id", deleteTarget.id);
      await supabase.from("invoices").delete().eq("client_id", deleteTarget.id);
      await supabase.from("updates").delete().eq("client_id", deleteTarget.id);
      await supabase.from("documents").delete().eq("client_id", deleteTarget.id);
      await supabase.from("requests").delete().eq("client_id", deleteTarget.id);
      await supabase.from("pods").delete().eq("client_id", deleteTarget.id);
      await supabase.from("activity_log").delete().eq("client_id", deleteTarget.id);
      const { error } = await supabase.from("clients").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast({ title: "Client deleted", description: `${deleteTarget.name} has been removed.` });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const getClientRisks = (client: any) => {
    const risks: string[] = [];
    if (client.retainer_used > 0) risks.push(`This client has ${client.retainer_used} retainer hours logged. Deleting will remove all time tracking records.`);
    if ((client.services || []).length > 0) risks.push(`Active services (${client.services.join(", ")}) will be orphaned.`);
    if (Number(client.lifetime_revenue) > 0) risks.push(`Lifetime revenue of ${formatCurrency(Number(client.lifetime_revenue))} will be lost from reports.`);
    if (client.subscription_status === "active") risks.push("This is an ACTIVE subscription. Consider pausing instead of deleting.");
    return risks;
  };

  const handleDragEnd = useCallback((itemId: string, _source: string, destColumn: string) => {
    const client = clients.find((c: any) => c.id === itemId);
    if (!client) return;
    updateField(client, "subscription_status", destColumn);
    toast({ title: "Subscription updated", description: `${client.name} → ${(subStatusConfig as any)[destColumn]?.label}` });
  }, [clients, updateField, toast]);

  const columns: KanbanColumn<any>[] = subStatusOrder.map((status) => ({
    id: status,
    title: subStatusConfig[status].label,
    color: subStatusConfig[status].dotColor,
    items: clients.filter((c: any) => (c as any).subscription_status === status),
  }));

  const filtered = clients.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.profiles?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const selected = clients.find((c: any) => c.id === selectedId);

  // ─── Partner Cockpit Detail View ───
  if (selected) {
    return (
      <PartnerCockpit
        client={selected}
        onBack={() => setSelectedId(null)}
        onUpdateField={updateField}
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Partner Workspaces</h2>
          <p className="mt-1 text-sm text-muted-foreground">Drag clients between subscription states. Click to open cockpit.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border">
            <button
              onClick={() => setView("board")}
              className={`text-xs px-3 py-1.5 transition-colors ${view === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >Board</button>
            <button
              onClick={() => setView("list")}
              className={`text-xs px-3 py-1.5 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >List</button>
          </div>
          <Button onClick={() => setShowInvite(true)} className="gap-2 text-xs">
            <Plus size={14} /> Invite Client
          </Button>
        </div>
      </motion.div>

      {/* Invite form */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Invite New Client</p>
            <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Full Name *</label>
              <input value={inviteForm.full_name} onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Email *</label>
              <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Company Name</label>
              <input value={inviteForm.company_name} onChange={(e) => setInviteForm({ ...inviteForm, company_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Services (comma-separated)</label>
              <input value={inviteForm.services} onChange={(e) => setInviteForm({ ...inviteForm, services: e.target.value })} placeholder="Operations, Automation" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <Button onClick={() => inviteMutation.mutate(inviteForm)} disabled={inviteMutation.isPending || !inviteForm.email || !inviteForm.full_name} className="gap-2 text-xs">
            {inviteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {inviteMutation.isPending ? "Sending..." : "Send Invite"}
          </Button>
        </motion.div>
      )}

      {/* Search */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="w-full bg-card border border-divider pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </motion.div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading clients...</p>
      ) : view === "board" ? (
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
          <KanbanBoard
            columns={columns}
            onDragEnd={handleDragEnd}
            getItemId={(item) => item.id}
            renderCard={(client: any, isDragging) => {
              const usedPct = client.retainer_limit > 0
                ? Math.round((client.retainer_used / client.retainer_limit) * 100) : 0;
              return (
                <div
                  className={`bg-card border border-divider p-4 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                    isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"
                  }`}
                  onClick={() => !isDragging && setSelectedId(client.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-primary">{client.name[0]}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      {tierLabels[client.tier] || "Standard"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{client.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {client.profiles?.email || "—"}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Retainer</span>
                      <span className="text-[10px] text-muted-foreground">{client.retainer_used}/{client.retainer_limit}h</span>
                    </div>
                    <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${retainerColor(client.retainer_used, client.retainer_limit)}`}
                        style={{ width: `${Math.min(usedPct, 100)}%` }}
                      />
                    </div>
                  </div>
                  {client.monthly_rate > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {formatCurrency(Number(client.monthly_rate))}/mo
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground/60">
                        {(client.services || []).slice(0, 2).join(" · ") || "No services"}
                      </p>
                      {(() => {
                        const c = getComplianceDisplay(client.compliance_status);
                        return <span className="text-[9px]" title={c.label}>{c.emoji}</span>;
                      })()}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(client); }}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            }}
          />
        </motion.div>
      ) : (
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
          {filtered.length === 0 ? (
            <div className="border border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No clients found.</p>
            </div>
          ) : (
            <div className="bg-card border border-divider divide-y divide-divider">
              {filtered.map((client: any) => {
                const usedPct = client.retainer_limit > 0
                  ? Math.round((client.retainer_used / client.retainer_limit) * 100) : 0;
                return (
                  <button key={client.id} onClick={() => setSelectedId(client.id)} className="w-full p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors text-left">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{client.name[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{client.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium ${
                            (subStatusConfig as any)[client.subscription_status]?.dotColor === "bg-emerald-500" ? "bg-emerald-500/10 text-emerald-600" :
                            (subStatusConfig as any)[client.subscription_status]?.dotColor === "bg-amber-500" ? "bg-amber-500/10 text-amber-600" :
                            (subStatusConfig as any)[client.subscription_status]?.dotColor === "bg-destructive" ? "bg-destructive/10 text-destructive" :
                            "bg-secondary text-muted-foreground"
                          }`}>
                            {(subStatusConfig as any)[client.subscription_status]?.label || "Active"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {client.profiles?.email || "No contact"} · {(client.services || []).join(" · ") || "No services"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-20">
                        <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${retainerColor(client.retainer_used, client.retainer_limit)}`}
                            style={{ width: `${Math.min(usedPct, 100)}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5 text-center">{client.retainer_used}/{client.retainer_limit}h</p>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      <LekoRiskGuard
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteClient}
        loading={deleteLoading}
        entityType="Client"
        entityName={deleteTarget?.name || ""}
        risks={deleteTarget ? getClientRisks(deleteTarget) : []}
      />
    </div>
  );
};

export default AdminClients;
