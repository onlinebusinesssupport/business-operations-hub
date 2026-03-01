import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Download, X, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type InvStatus = "draft" | "sent" | "paid" | "overdue";
const invStatusConfig: Record<InvStatus, { label: string; dotColor: string }> = {
  draft: { label: "Draft", dotColor: "bg-muted-foreground/40" },
  sent: { label: "Sent", dotColor: "bg-amber-500" },
  paid: { label: "Paid", dotColor: "bg-emerald-500" },
  overdue: { label: "Overdue", dotColor: "bg-destructive" },
};
const invStatusOrder: InvStatus[] = ["draft", "sent", "paid", "overdue"];

const AdminRevenue = () => {
  const [view, setView] = useState<"board" | "table">("board");
  const [clientFilter, setClientFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    client_id: "", amount: "", description: "", invoice_date: new Date().toISOString().split("T")[0],
    due_date: "", status: "draft", services: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*, clients(name)").order("invoice_date", { ascending: false });
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

  const createInvoice = useMutation({
    mutationFn: async (f: typeof form) => {
      const { error } = await supabase.from("invoices").insert({
        client_id: f.client_id, amount: parseFloat(f.amount), description: f.description || null,
        invoice_date: f.invoice_date, due_date: f.due_date || null, status: f.status,
        services: f.services ? f.services.split(",").map((s) => s.trim()) : [],
      });
      if (error) throw error;
      await logActivity({
        client_id: f.client_id, action: "created", entity_type: "invoice",
        details: { summary: `Created invoice for R${f.amount}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
      toast({ title: "Invoice created" });
      setShowCreate(false);
      setForm({ client_id: "", amount: "", description: "", invoice_date: new Date().toISOString().split("T")[0], due_date: "", status: "draft", services: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateInvField = useCallback(async (inv: any, field: string, value: any) => {
    const updates: any = { [field]: value };
    if (field === "status" && value === "paid") updates.paid_date = new Date().toISOString().split("T")[0];
    await supabase.from("invoices").update(updates).eq("id", inv.id);
    queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    await logActivity({
      client_id: inv.client_id,
      action: field === "status" ? "payment_marked" : "field_edit",
      entity_type: "invoice",
      entity_id: inv.id,
      details: {
        summary: field === "status"
          ? `Invoice ${inv.invoice_number || ""} → ${(invStatusConfig as any)[value]?.label || value}`
          : `Updated ${field} on invoice ${inv.invoice_number || ""}`,
        field, new_value: String(value),
      },
    });
    if (field === "status" && value === "paid") {
      toast({ title: "Payment recorded", description: `Invoice marked as paid` });
    }
  }, [queryClient, toast]);

  const handleDragEnd = useCallback((itemId: string, _source: string, destColumn: string) => {
    const inv = invoices.find((i: any) => i.id === itemId);
    if (!inv) return;
    updateInvField(inv, "status", destColumn);
  }, [invoices, updateInvField]);

  let filtered = invoices as any[];
  if (clientFilter !== "all") filtered = filtered.filter((i) => i.client_id === clientFilter);

  const totalRevenue = filtered.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const paidRevenue = filtered.filter((i) => i.status === "paid").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const pendingRevenue = filtered.filter((i) => i.status !== "paid" && i.status !== "draft").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const overdueRevenue = filtered.filter((i) => i.status === "overdue").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const revenueByClient = clients.map((c: any) => {
    const clientInvoices = filtered.filter((i) => i.client_id === c.id);
    const total = clientInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    return { client: c.name, total };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);
  const maxRevenue = Math.max(...revenueByClient.map((c) => c.total), 1);

  const fmt = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

  const columns: KanbanColumn<any>[] = invStatusOrder.map((status) => ({
    id: status,
    title: invStatusConfig[status].label,
    color: invStatusConfig[status].dotColor,
    items: filtered.filter((i: any) => i.status === status),
  }));

  const exportCSV = () => {
    const rows = filtered.map((i) => ({
      Date: i.invoice_date, Client: i.clients?.name || "", Description: i.description || "",
      Amount: i.amount, Status: i.status, PaidDate: i.paid_date || "",
    }));
    const headers = ["Date", "Client", "Description", "Amount", "Status", "PaidDate"];
    const csv = [headers.join(","), ...rows.map((r: any) => headers.map((h) => `"${r[h] || ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "revenue-report.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported" });
  };

  return (
    <div className="space-y-8">
      <motion.div {...fade} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Revenue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Drag invoices between states. Inline edit amounts.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border">
            <button onClick={() => setView("board")} className={`text-xs px-3 py-1.5 transition-colors ${view === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Board</button>
            <button onClick={() => setView("table")} className={`text-xs px-3 py-1.5 transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Table</button>
          </div>
          <Button variant="outline" onClick={exportCSV} className="gap-2 text-xs"><Download size={14} /> CSV</Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2 text-xs"><Plus size={14} /> Invoice</Button>
        </div>
      </motion.div>

      {/* Create form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">New Invoice</p>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Client *</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Amount (ZAR) *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Invoice Date</label>
              <input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Services</label>
              <input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Operations, Automation" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <Button onClick={() => createInvoice.mutate(form)} disabled={createInvoice.isPending || !form.client_id || !form.amount} className="gap-2 text-xs">
            {createInvoice.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create
          </Button>
        </motion.div>
      )}

      {/* KPI cards */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: fmt(totalRevenue), icon: DollarSign },
            { label: "Collected", value: fmt(paidRevenue), icon: TrendingUp },
            { label: "Outstanding", value: fmt(pendingRevenue), icon: DollarSign },
            { label: "Overdue", value: fmt(overdueRevenue), icon: DollarSign },
          ].map((m) => (
            <div key={m.label} className="bg-card border border-divider p-5">
              <m.icon size={16} className="text-muted-foreground mb-2" strokeWidth={1.5} />
              <p className="font-display text-xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.08 }}>
        <div className="flex items-center gap-3">
          <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="px-3 py-2 text-sm bg-card border border-divider focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All Clients</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Revenue by client */}
      {revenueByClient.length > 0 && (
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3">Revenue by Client</p>
          <div className="bg-card border border-divider p-5 space-y-4">
            {revenueByClient.map((c) => (
              <div key={c.client} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-36 shrink-0 truncate">{c.client}</span>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${(c.total / maxRevenue) * 100}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-xs text-muted-foreground w-28 text-right shrink-0">{fmt(c.total)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Board or Table view */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : view === "board" ? (
          <KanbanBoard
            columns={columns}
            onDragEnd={handleDragEnd}
            getItemId={(item) => item.id}
            renderCard={(inv: any, isDragging) => (
              <div className={`bg-card border border-divider p-4 cursor-grab active:cursor-grabbing transition-all duration-150 ${isDragging ? "rotate-1 scale-[1.02] shadow-lg" : "hover:border-primary/30"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground">{inv.invoice_number || "—"}</span>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{inv.clients?.name || "—"}</p>
                <div className="mt-2">
                  <InlineEdit
                    value={String(inv.amount)}
                    onSave={(v) => updateInvField(inv, "amount", parseFloat(v) || 0)}
                    className="font-display text-lg font-bold text-foreground"
                  />
                </div>
                <InlineEdit
                  value={inv.description || ""}
                  onSave={(v) => updateInvField(inv, "description", v)}
                  className="text-[10px] text-muted-foreground/70 mt-1"
                  placeholder="Add description..."
                />
                {inv.due_date && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Due: {new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            )}
          />
        ) : (
          <div className="bg-card border border-divider overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Date</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Client</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Description</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Amount</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {filtered.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-foreground font-medium">{inv.clients?.name || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground truncate max-w-[200px]">
                      <InlineEdit value={inv.description || ""} onSave={(v) => updateInvField(inv, "description", v)} className="text-sm" placeholder="—" />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <InlineEdit value={String(inv.amount)} onSave={(v) => updateInvField(inv, "amount", parseFloat(v) || 0)} className="text-sm font-medium text-foreground" />
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvField(inv, "status", e.target.value)}
                        className="text-xs px-2 py-0.5 border-0 cursor-pointer bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {invStatusOrder.map(s => <option key={s} value={s}>{invStatusConfig[s].label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminRevenue;
