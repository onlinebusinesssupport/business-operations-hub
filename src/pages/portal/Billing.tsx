import { useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Clock, Inbox } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/activity";
import { useToast } from "@/hooks/use-toast";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusOptions = ["draft", "sent", "paid", "overdue"] as const;
const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-primary/10 text-primary" },
  sent: { label: "Sent", color: "bg-amber-500/10 text-amber-600" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
  draft: { label: "Draft", color: "bg-secondary text-muted-foreground" },
};

const Billing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["portal-billing"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .order("invoice_date", { ascending: false });
      return data || [];
    },
  });

  const handleStatusChange = useCallback(async (inv: any, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "paid") updates.paid_date = new Date().toISOString().split("T")[0];
    await supabase.from("invoices").update(updates).eq("id", inv.id);
    queryClient.invalidateQueries({ queryKey: ["portal-billing"] });
    await logActivity({
      client_id: inv.client_id,
      action: "payment_marked",
      entity_type: "invoice",
      entity_id: inv.id,
      details: { summary: `Invoice ${inv.invoice_number || ""} marked as ${newStatus}` },
    });
    toast({ title: `Invoice ${newStatus}` });
  }, [queryClient, toast]);

  const handlePaidDateEdit = useCallback(async (inv: any, date: string) => {
    await supabase.from("invoices").update({ paid_date: date || null }).eq("id", inv.id);
    queryClient.invalidateQueries({ queryKey: ["portal-billing"] });
    await logActivity({
      client_id: inv.client_id,
      action: "field_edit",
      entity_type: "invoice",
      entity_id: inv.id,
      details: { summary: `Updated paid date on invoice ${inv.invoice_number || ""}`, field: "paid_date", new_value: date },
    });
  }, [queryClient]);

  const totalPaid = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const totalOutstanding = invoices.filter((i: any) => i.status === "sent" || i.status === "overdue").reduce((sum: number, i: any) => sum + Number(i.amount), 0);

  const formatAmount = (amount: number, currency?: string) => {
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "R";
    return `${sym}${Number(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Billing
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Invoices, payment history, and billing overview.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-border p-5">
            <DollarSign size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-foreground">
              {invoices.length > 0 ? formatAmount(totalPaid, invoices[0]?.currency) : "—"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Total Paid</p>
          </div>
          <div className="border border-border p-5">
            <Clock size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-foreground">
              {invoices.length > 0 ? formatAmount(totalOutstanding, invoices[0]?.currency) : "—"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Outstanding</p>
          </div>
          <div className="border border-border p-5">
            <FileText size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-bold text-foreground">{invoices.length}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total Invoices</p>
          </div>
        </div>
      </motion.div>

      {/* Invoice List */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Invoice History
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <Inbox size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Billing information will appear here once services begin.</p>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            <div className="grid grid-cols-6 p-3 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
              <span>Invoice</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Paid Date</span>
              <span className="text-right">Due</span>
            </div>
            {invoices.map((inv: any) => {
              const config = statusConfig[inv.status] || statusConfig.draft;
              return (
                <div key={inv.id} className="grid grid-cols-6 p-4 items-center text-sm hover:bg-secondary/50 transition-colors">
                  <span className="text-foreground font-medium">{inv.invoice_number || "—"}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-foreground font-medium">{formatAmount(inv.amount, inv.currency)}</span>
                  <select
                    value={inv.status}
                    onChange={(e) => handleStatusChange(inv, e.target.value)}
                    className={`text-[10px] uppercase tracking-wider font-medium px-2 py-1 w-fit border-none bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring ${config.color}`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                  </select>
                  <span className="text-muted-foreground text-xs">
                    {inv.paid_date ? (
                      <input
                        type="date"
                        value={inv.paid_date}
                        onChange={(e) => handlePaidDateEdit(inv, e.target.value)}
                        className="bg-transparent border-none text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                      />
                    ) : inv.status === "paid" ? (
                      <input
                        type="date"
                        onChange={(e) => handlePaidDateEdit(inv, e.target.value)}
                        className="bg-transparent border-none text-xs text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                        placeholder="Set date"
                      />
                    ) : "—"}
                  </span>
                  <span className="text-muted-foreground text-xs text-right">
                    {inv.due_date
                      ? new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Billing;
