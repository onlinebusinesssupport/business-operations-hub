import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Download, X, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const statusStyles: Record<string, string> = {
  draft: "bg-accent text-muted-foreground",
  sent: "bg-accent text-foreground",
  paid: "bg-foreground text-background",
  overdue: "bg-destructive/10 text-destructive",
};

const AdminRevenue = () => {
  const [clientFilter, setClientFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      const { data, error } = await supabase
        .from("invoices")
        .select("*, clients(name)")
        .order("invoice_date", { ascending: false });
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
        client_id: f.client_id,
        amount: parseFloat(f.amount),
        description: f.description || null,
        invoice_date: f.invoice_date,
        due_date: f.due_date || null,
        status: f.status,
        services: f.services ? f.services.split(",").map((s) => s.trim()) : [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
      toast({ title: "Invoice created" });
      setShowCreate(false);
      setForm({ client_id: "", amount: "", description: "", invoice_date: new Date().toISOString().split("T")[0], due_date: "", status: "draft", services: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === "paid") updates.paid_date = new Date().toISOString().split("T")[0];
      const { error } = await supabase.from("invoices").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-invoices"] }),
  });

  // Filtering
  let filtered = invoices as any[];
  if (clientFilter !== "all") filtered = filtered.filter((i) => i.client_id === clientFilter);
  if (statusFilter !== "all") filtered = filtered.filter((i) => i.status === statusFilter);
  if (dateFrom) filtered = filtered.filter((i) => i.invoice_date >= dateFrom);
  if (dateTo) filtered = filtered.filter((i) => i.invoice_date <= dateTo);

  // Totals
  const totalRevenue = filtered.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const paidRevenue = filtered.filter((i) => i.status === "paid").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const pendingRevenue = filtered.filter((i) => i.status !== "paid" && i.status !== "draft").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const overdueRevenue = filtered.filter((i) => i.status === "overdue").reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  // Revenue by client
  const revenueByClient = clients.map((c: any) => {
    const clientInvoices = filtered.filter((i) => i.client_id === c.id);
    const total = clientInvoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    return { client: c.name, total };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const maxRevenue = Math.max(...revenueByClient.map((c) => c.total), 1);

  const formatCurrency = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

  const exportCSV = () => {
    const rows = filtered.map((i) => ({
      Date: i.invoice_date,
      Client: i.clients?.name || "",
      Description: i.description || "",
      Amount: i.amount,
      Status: i.status,
      PaidDate: i.paid_date || "",
    }));
    const headers = ["Date", "Client", "Description", "Amount", "Status", "PaidDate"];
    const csv = [headers.join(","), ...rows.map((r: any) => headers.map((h) => `"${r[h] || ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "revenue-report.csv downloaded" });
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Revenue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track invoices, payments, and revenue by client.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2 text-xs">
            <Download size={14} /> Export CSV
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2 text-xs">
            <Plus size={14} /> New Invoice
          </Button>
        </div>
      </motion.div>

      {/* Create invoice */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">New Invoice</p>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Client *</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Amount (ZAR) *</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Invoice Date</label>
              <input type="date" value={form.invoice_date} onChange={(e) => setForm({ ...form, invoice_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Services (comma-separated)</label>
              <input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Operations, Automation" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <Button onClick={() => createInvoice.mutate(form)} disabled={createInvoice.isPending || !form.client_id || !form.amount} className="gap-2 text-xs">
            {createInvoice.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Invoice
          </Button>
        </motion.div>
      )}

      {/* Summary cards */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
            { label: "Collected", value: formatCurrency(paidRevenue), icon: TrendingUp },
            { label: "Outstanding", value: formatCurrency(pendingRevenue), icon: DollarSign },
            { label: "Overdue", value: formatCurrency(overdueRevenue), icon: DollarSign },
          ].map((m) => (
            <div key={m.label} className="bg-card border border-divider rounded-xl p-5">
              <m.icon size={16} className="text-muted-foreground mb-2" strokeWidth={1.5} />
              <p className="font-serif text-xl text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Filters</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Client</label>
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="px-3 py-2 text-sm bg-card border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All Clients</option>
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm bg-card border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 text-sm bg-card border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 text-sm bg-card border border-divider rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          {(clientFilter !== "all" || statusFilter !== "all" || dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setClientFilter("all"); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}>
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Revenue by client */}
      {revenueByClient.length > 0 && (
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Revenue by Client</p>
          <div className="bg-card border border-divider rounded-xl p-5 space-y-4">
            {revenueByClient.map((c) => (
              <div key={c.client} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-36 shrink-0 truncate">{c.client}</span>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${(c.total / maxRevenue) * 100}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-xs text-muted-foreground w-28 text-right shrink-0">{formatCurrency(c.total)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Invoices table */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Invoices</p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No invoices found. Create your first invoice above.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Date</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Client</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Description</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Amount</th>
                  <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Status</th>
                  <th className="text-right text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {filtered.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-foreground font-medium">{inv.clients?.name || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground truncate max-w-[200px]">{inv.description || "—"}</td>
                    <td className="px-5 py-3 text-foreground text-right font-medium whitespace-nowrap">{formatCurrency(Number(inv.amount))}</td>
                    <td className="px-5 py-3">
                      <select
                        value={inv.status}
                        onChange={(e) => updateStatus.mutate({ id: inv.id, status: e.target.value })}
                        className={`text-xs px-2 py-0.5 rounded-lg border-0 cursor-pointer capitalize ${statusStyles[inv.status] || ""}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {inv.status !== "paid" && (
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => updateStatus.mutate({ id: inv.id, status: "paid" })}>
                          Mark Paid
                        </Button>
                      )}
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
