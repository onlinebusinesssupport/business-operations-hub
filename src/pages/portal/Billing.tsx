import { useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Clock, Inbox } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-primary/10 text-primary" },
  sent: { label: "Sent", color: "bg-amber-500/10 text-amber-600" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
  draft: { label: "Draft", color: "bg-secondary text-muted-foreground" },
};

const Billing = () => {
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

  const { data: clientData } = useQuery({
    queryKey: ["portal-billing-sub"],
    queryFn: async () => {
      const { data: clientId } = await supabase.rpc("get_my_client_id");
      if (!clientId) return null;
      const { data: client } = await supabase.from("clients")
        .select("subscription_status, tier, monthly_rate, retainer_limit, retainer_used")
        .eq("id", clientId).maybeSingle();
      return client;
    },
  });

  const totalPaid = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const totalOutstanding = invoices.filter((i: any) => i.status === "sent" || i.status === "overdue").reduce((sum: number, i: any) => sum + Number(i.amount), 0);

  const formatAmount = (amount: number, currency?: string) => {
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "R";
    return `${sym}${Number(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const subStatus = (clientData as any)?.subscription_status || "active";
  const tier = (clientData as any)?.tier || "standard";
  const monthlyRate = Number((clientData as any)?.monthly_rate || 0);
  const retainerUsed = (clientData as any)?.retainer_used || 0;
  const retainerLimit = (clientData as any)?.retainer_limit || 40;
  const retainerPct = retainerLimit > 0 ? Math.round((retainerUsed / retainerLimit) * 100) : 0;

  const tierLabels: Record<string, string> = {
    starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise",
  };
  const subLabels: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600" },
    at_risk: { label: "At Risk", color: "bg-amber-500/10 text-amber-600" },
    paused: { label: "Paused", color: "bg-secondary text-muted-foreground" },
    cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
  };

  const retainerBarColor = retainerPct >= 100 ? "bg-destructive" : retainerPct >= 75 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">Billing</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">Subscription, retainer usage, and invoice history.</p>
      </motion.div>

      {/* Subscription overview */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.03 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Subscription</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-2">Plan</p>
            <p className="font-display text-lg font-bold text-foreground">{tierLabels[tier] || "Standard"}</p>
            <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 mt-2 inline-block ${subLabels[subStatus]?.color}`}>
              {subLabels[subStatus]?.label || "Active"}
            </span>
          </div>
          <div className="border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-2">Monthly Rate</p>
            <p className="font-display text-lg font-bold text-foreground">
              {monthlyRate > 0 ? formatAmount(monthlyRate) : "—"}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-2">Retainer</p>
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-lg font-bold text-foreground">{retainerUsed}h</span>
              <span className="text-xs text-muted-foreground">/ {retainerLimit}h</span>
            </div>
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${retainerBarColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(retainerPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {retainerPct >= 100 ? "Exceeded — contact your team" : retainerPct >= 75 ? "Approaching limit" : "Healthy"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Financial summary */}
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

      {/* Invoice List (read-only for clients) */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Invoice History</p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <Inbox size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            <div className="grid grid-cols-5 p-3 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
              <span>Invoice</span><span>Date</span><span>Amount</span><span>Status</span><span className="text-right">Due</span>
            </div>
            {invoices.map((inv: any) => {
              const config = statusConfig[inv.status] || statusConfig.draft;
              return (
                <div key={inv.id} className="grid grid-cols-5 p-4 items-center text-sm hover:bg-secondary/50 transition-colors">
                  <span className="text-foreground font-medium">{inv.invoice_number || "—"}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-foreground font-medium">{formatAmount(inv.amount, inv.currency)}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 w-fit ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-muted-foreground text-xs text-right">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}
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
