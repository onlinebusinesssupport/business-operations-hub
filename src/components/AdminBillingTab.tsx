import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, X, Loader2, Upload, Download, FileCheck, Eye } from "lucide-react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const invoiceStatusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-secondary text-muted-foreground" },
  sent: { label: "Sent", color: "bg-amber-500/10 text-amber-600" },
  awaiting_confirmation: { label: "Awaiting Confirmation", color: "bg-purple-500/10 text-purple-600" },
  paid: { label: "Paid", color: "bg-primary/10 text-primary" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
};

interface AdminBillingTabProps {
  client: any;
  invoices: any[];
  paidTotal: number;
  outstandingTotal: number;
  fmt: (n: number) => string;
  onUpdateField: (client: any, field: string, value: any) => Promise<void>;
  updateInvField: (inv: any, field: string, value: any) => Promise<void>;
  queryClient: QueryClient;
}

export default function AdminBillingTab({
  client, invoices, paidTotal, outstandingTotal, fmt, onUpdateField, updateInvField, queryClient,
}: AdminBillingTabProps) {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [popPreview, setPopPreview] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newInv, setNewInv] = useState({
    invoice_number: "", amount: "", due_date: "", description: "", currency: "ZAR",
  });
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const createInvoiceMut = useMutation({
    mutationFn: async () => {
      let file_path: string | null = null;
      if (invoiceFile) {
        const ext = invoiceFile.name.split(".").pop();
        const path = `${client.id}/invoices/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("invoice-files").upload(path, invoiceFile);
        if (uploadErr) throw uploadErr;
        file_path = path;
      }
      const { error } = await supabase.from("invoices").insert({
        client_id: client.id,
        invoice_number: newInv.invoice_number || null,
        amount: parseFloat(newInv.amount) || 0,
        due_date: newInv.due_date || null,
        description: newInv.description || null,
        currency: newInv.currency,
        status: "draft",
        file_path,
      });
      if (error) throw error;
      await logActivity({
        client_id: client.id, action: "created", entity_type: "invoice",
        details: { summary: `Invoice ${newInv.invoice_number} created — ${newInv.currency} ${newInv.amount}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cockpit-invoices", client.id] });
      setShowCreate(false);
      setNewInv({ invoice_number: "", amount: "", due_date: "", description: "", currency: "ZAR" });
      setInvoiceFile(null);
      toast({ title: "Invoice created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const confirmPaymentMut = useMutation({
    mutationFn: async (inv: any) => {
      await supabase.from("invoices").update({ status: "paid", paid_date: new Date().toISOString().split("T")[0] }).eq("id", inv.id);
      await logActivity({
        client_id: client.id, action: "payment_confirmed", entity_type: "invoice", entity_id: inv.id,
        details: { summary: `Payment confirmed for ${inv.invoice_number || "invoice"}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cockpit-invoices", client.id] });
      toast({ title: "Payment confirmed" });
    },
  });

  const downloadFile = async (path: string) => {
    const { data } = await supabase.storage.from("invoice-files").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <motion.div key="billing" {...fade} transition={{ duration: 0.25 }} className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Collected</p>
          <span className="font-display text-xl font-bold text-foreground">{fmt(paidTotal)}</span>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Outstanding</p>
          <span className="font-display text-xl font-bold text-foreground">{fmt(outstandingTotal)}</span>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Monthly Rate</p>
          <InlineEdit value={String(client.monthly_rate || 0)} onSave={(v) => onUpdateField(client, "monthly_rate", parseFloat(v) || 0)} className="font-display text-xl font-bold text-foreground" />
        </div>
      </div>

      {/* Create invoice */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreate(true)} size="sm" className="gap-2 text-xs"><Plus size={14} /> Create Invoice</Button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">New Invoice</p>
            <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={newInv.invoice_number} onChange={(e) => setNewInv({ ...newInv, invoice_number: e.target.value })} placeholder="Invoice # *" className="px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            <input type="number" value={newInv.amount} onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })} placeholder="Amount *" className="px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            <input type="date" value={newInv.due_date} onChange={(e) => setNewInv({ ...newInv, due_date: e.target.value })} className="px-3 py-2 text-sm bg-background border border-border" />
            <select value={newInv.currency} onChange={(e) => setNewInv({ ...newInv, currency: e.target.value })} className="px-3 py-2 text-sm bg-background border border-border">
              <option value="ZAR">ZAR</option><option value="USD">USD</option><option value="EUR">EUR</option>
            </select>
            <input value={newInv.description} onChange={(e) => setNewInv({ ...newInv, description: e.target.value })} placeholder="Description" className="px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring md:col-span-2" />
          </div>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2 text-xs">
              <Upload size={12} /> {invoiceFile ? invoiceFile.name : "Attach file"}
            </Button>
            <Button onClick={() => createInvoiceMut.mutate()} disabled={createInvoiceMut.isPending || !newInv.invoice_number || !newInv.amount} size="sm" className="gap-2 text-xs">
              {createInvoiceMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Create
            </Button>
          </div>
        </motion.div>
      )}

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="border border-border p-8 text-center">
          <DollarSign size={22} className="mx-auto text-muted-foreground/40 mb-2" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">No invoices for this partner.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          <div className="grid grid-cols-7 p-3 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
            <span>Invoice #</span><span>Date</span><span>Amount</span><span>Status</span><span>Due</span><span>File</span><span className="text-right">Actions</span>
          </div>
          {invoices.map((inv: any) => {
            const config = invoiceStatusConfig[inv.status] || invoiceStatusConfig.draft;
            const popDetails = inv.pop_details && typeof inv.pop_details === "object" && Object.keys(inv.pop_details).length > 0 ? inv.pop_details : null;
            return (
              <div key={inv.id} className="grid grid-cols-7 p-4 items-center text-sm gap-2">
                <InlineEdit value={inv.invoice_number || ""} onSave={(v) => updateInvField(inv, "invoice_number", v)} className="text-sm font-medium text-foreground" placeholder="—" />
                <span className="text-muted-foreground text-xs">{new Date(inv.invoice_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>
                <InlineEdit value={String(inv.amount)} onSave={(v) => updateInvField(inv, "amount", parseFloat(v) || 0)} className="text-sm font-medium text-foreground" />
                <select value={inv.status} onChange={(e) => updateInvField(inv, "status", e.target.value)}
                  className="text-xs px-2 py-0.5 border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
                  <option value="draft">Draft</option><option value="sent">Sent</option><option value="awaiting_confirmation">Awaiting</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
                </select>
                <span className="text-muted-foreground text-xs">{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}</span>
                <div className="flex gap-1">
                  {inv.file_path && (
                    <button onClick={() => downloadFile(inv.file_path)} className="text-primary hover:text-primary/80" title="Download invoice">
                      <Download size={14} />
                    </button>
                  )}
                  {inv.pop_file_path && (
                    <button onClick={() => downloadFile(inv.pop_file_path)} className="text-emerald-600 hover:text-emerald-500" title="Download POP">
                      <FileCheck size={14} />
                    </button>
                  )}
                </div>
                <div className="flex gap-1 justify-end">
                  {inv.status === "awaiting_confirmation" && (
                    <>
                      {popDetails && (
                        <button onClick={() => setPopPreview(inv)} className="text-muted-foreground hover:text-foreground" title="View POP details">
                          <Eye size={14} />
                        </button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => confirmPaymentMut.mutate(inv)} disabled={confirmPaymentMut.isPending} className="text-[10px] h-7 px-2 gap-1">
                        <FileCheck size={11} /> Confirm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POP details preview */}
      {popPreview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setPopPreview(null)}>
          <div className="bg-card border border-border p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Proof of Payment Details</p>
              <button onClick={() => setPopPreview(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
            </div>
            <div className="space-y-2 text-sm">
              {popPreview.pop_details?.reference && <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="text-foreground">{popPreview.pop_details.reference}</span></div>}
              {popPreview.pop_details?.bank && <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="text-foreground">{popPreview.pop_details.bank}</span></div>}
              {popPreview.pop_details?.amount_paid && <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="text-foreground">R{Number(popPreview.pop_details.amount_paid).toLocaleString("en-ZA")}</span></div>}
              {popPreview.pop_details?.date_paid && <div className="flex justify-between"><span className="text-muted-foreground">Date Paid</span><span className="text-foreground">{new Date(popPreview.pop_details.date_paid).toLocaleDateString("en-ZA")}</span></div>}
            </div>
            {popPreview.pop_file_path && (
              <Button size="sm" variant="outline" onClick={() => downloadFile(popPreview.pop_file_path)} className="gap-2 text-xs w-full">
                <Download size={12} /> Download POP File
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
