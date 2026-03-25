import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Clock, Inbox, Download, Upload, Loader2, X, FileCheck, CreditCard } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-primary/10 text-primary" },
  sent: { label: "Sent", color: "bg-amber-500/10 text-amber-600" },
  awaiting_confirmation: { label: "Awaiting Confirmation", color: "bg-purple-500/10 text-purple-600" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
  draft: { label: "Draft", color: "bg-secondary text-muted-foreground" },
};

const Billing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [popDialog, setPopDialog] = useState<any>(null);
  const [popFile, setPopFile] = useState<File | null>(null);
  const [popDetails, setPopDetails] = useState({ reference: "", bank: "", amount_paid: "", date_paid: "" });
  const popFileRef = useRef<HTMLInputElement>(null);

  const { data: clientId } = useQuery({
    queryKey: ["portal-client-id"],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_my_client_id");
      return data as string | null;
    },
  });

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["portal-billing"],
    queryFn: async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .order("invoice_date", { ascending: false });
      // Client RLS only shows their invoices; filter out drafts on the app side
      return (data || []).filter((i: any) => i.status !== "draft");
    },
  });

  const { data: clientData } = useQuery({
    queryKey: ["portal-billing-sub"],
    queryFn: async () => {
      if (!clientId) return null;
      const { data: client } = await supabase.from("clients")
        .select("subscription_status, tier, monthly_rate, retainer_limit, retainer_used")
        .eq("id", clientId).maybeSingle();
      return client;
    },
    enabled: !!clientId,
  });

  const totalPaid = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + Number(i.amount), 0);
  const totalOutstanding = invoices.filter((i: any) => i.status === "sent" || i.status === "overdue").reduce((sum: number, i: any) => sum + Number(i.amount), 0);

  const formatAmount = (amount: number, currency?: string) => {
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "R";
    return `${sym}${Number(amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const downloadFile = async (path: string) => {
    const { data } = await supabase.storage.from("invoice-files").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  const uploadPopMut = useMutation({
    mutationFn: async () => {
      if (!popDialog || !clientId) throw new Error("Missing context");
      let pop_file_path: string | null = null;
      if (popFile) {
        const ext = popFile.name.split(".").pop();
        const path = `${clientId}/pop/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("invoice-files").upload(path, popFile);
        if (uploadErr) throw uploadErr;
        pop_file_path = path;
      }
      const { error } = await supabase.from("invoices").update({
        pop_file_path,
        pop_details: {
          reference: popDetails.reference,
          bank: popDetails.bank,
          amount_paid: popDetails.amount_paid ? parseFloat(popDetails.amount_paid) : null,
          date_paid: popDetails.date_paid || null,
        },
        status: "awaiting_confirmation",
      }).eq("id", popDialog.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-billing"] });
      setPopDialog(null);
      setPopFile(null);
      setPopDetails({ reference: "", bank: "", amount_paid: "", date_paid: "" });
      toast({ title: "Proof of payment uploaded", description: "Your payment is being reviewed." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const subStatus = (clientData as any)?.subscription_status || "active";
  const tier = (clientData as any)?.tier || "standard";
  const monthlyRate = Number((clientData as any)?.monthly_rate || 0);
  const retainerUsed = (clientData as any)?.retainer_used || 0;
  const retainerLimit = (clientData as any)?.retainer_limit || 40;
  const retainerPct = retainerLimit > 0 ? Math.round((retainerUsed / retainerLimit) * 100) : 0;

  const tierLabels: Record<string, string> = { starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise" };
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
            <p className="font-display text-lg font-bold text-foreground">{monthlyRate > 0 ? formatAmount(monthlyRate) : "—"}</p>
          </div>
          <div className="border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-2">Retainer</p>
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-lg font-bold text-foreground">{retainerUsed}h</span>
              <span className="text-xs text-muted-foreground">/ {retainerLimit}h</span>
            </div>
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${retainerBarColor}`}
                initial={{ width: 0 }} animate={{ width: `${Math.min(retainerPct, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} />
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

      {/* Invoice List */}
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
            <div className="grid grid-cols-6 p-3 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
              <span>Invoice</span><span>Date</span><span>Amount</span><span>Status</span><span>Due</span><span className="text-right">Actions</span>
            </div>
            {invoices.map((inv: any) => {
              const config = statusConfig[inv.status] || statusConfig.draft;
              const canUploadPop = inv.status === "sent" || inv.status === "overdue";
              return (
                <div key={inv.id} className="grid grid-cols-6 p-4 items-center text-sm gap-2">
                  <span className="text-foreground font-medium">{inv.invoice_number || "—"}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-foreground font-medium">{formatAmount(inv.amount, inv.currency)}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 w-fit ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}
                  </span>
                  <div className="flex gap-2 justify-end">
                    {inv.file_path && (
                      <button onClick={() => downloadFile(inv.file_path)} className="text-primary hover:text-primary/80" title="Download Invoice">
                        <Download size={15} />
                      </button>
                    )}
                    {canUploadPop && (
                      <Button size="sm" variant="outline" onClick={() => setPopDialog(inv)} className="text-[10px] h-7 px-2 gap-1">
                        <Upload size={11} /> Upload POP
                      </Button>
                    )}
                    {inv.status === "awaiting_confirmation" && (
                      <span className="flex items-center gap-1 text-[10px] text-purple-600"><FileCheck size={12} /> Submitted</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Upload POP Dialog */}
      {popDialog && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setPopDialog(null)}>
          <div className="bg-card border border-border p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Upload Proof of Payment</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Invoice {popDialog.invoice_number} — {formatAmount(popDialog.amount, popDialog.currency)}</p>
              </div>
              <button onClick={() => setPopDialog(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input value={popDetails.reference} onChange={(e) => setPopDetails({ ...popDetails, reference: e.target.value })} placeholder="Reference / Transaction number *" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
              <input value={popDetails.bank} onChange={(e) => setPopDetails({ ...popDetails, bank: e.target.value })} placeholder="Bank name" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={popDetails.amount_paid} onChange={(e) => setPopDetails({ ...popDetails, amount_paid: e.target.value })} placeholder="Amount paid" className="px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                <input type="date" value={popDetails.date_paid} onChange={(e) => setPopDetails({ ...popDetails, date_paid: e.target.value })} className="px-3 py-2 text-sm bg-background border border-border" />
              </div>
              <div>
                <input ref={popFileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setPopFile(e.target.files?.[0] || null)} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => popFileRef.current?.click()} className="gap-2 text-xs w-full">
                  <Upload size={12} /> {popFile ? popFile.name : "Attach POP file (PDF/image)"}
                </Button>
              </div>
            </div>
            <Button onClick={() => uploadPopMut.mutate()} disabled={uploadPopMut.isPending || !popDetails.reference} className="w-full gap-2 text-xs">
              {uploadPopMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />} Submit Proof of Payment
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Billing;
