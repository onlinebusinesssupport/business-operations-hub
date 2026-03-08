import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, Brain, CheckCircle2, AlertTriangle, XCircle, Calendar, Plus, ArrowLeft, Sparkles } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

/* ────────────────────────── Types ────────────────────────── */

type AccountType = "income" | "expense" | "asset" | "liability" | "equity";

interface ChartAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  category: string;
  tax_treatment: string;
  is_active: boolean;
  created_at: string;
}

interface BankStatement {
  id: string;
  file_path: string | null;
  file_name: string;
  upload_date: string;
  period_start: string | null;
  period_end: string | null;
  bank_name: string | null;
  account_number: string | null;
  status: string;
  total_in: number;
  total_out: number;
  transaction_count: number;
  skipped_count: number;
  created_at: string;
}

interface Transaction {
  id: string;
  statement_id: string;
  date: string;
  description: string;
  amount: number;
  balance: number | null;
  account_id: string | null;
  ai_category: string | null;
  ai_confidence: number;
  confirmed: boolean;
  vat_amount: number;
  notes: string | null;
  created_at: string;
}

interface ComplianceItem {
  id: string;
  title: string;
  body: string;
  due_date: string;
  frequency: string;
  status: string;
  notes: string | null;
  created_at: string;
}

/* ────────────────────────── Component ────────────────────────── */

const AdminAccountant = () => {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("statements");
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
  const [txnFilter, setTxnFilter] = useState<"all" | "uncategorised" | "confirmed">("all");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddCompliance, setShowAddCompliance] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categorising, setCategorising] = useState(false);

  // ─── New account form ───
  const [newAccount, setNewAccount] = useState({ code: "", name: "", type: "expense" as AccountType, category: "", tax_treatment: "vat_inclusive" });
  // ─── New compliance form ───
  const [newCompliance, setNewCompliance] = useState({ title: "", body: "SARS", due_date: "", frequency: "annual", notes: "" });

  /* ─── Queries ─── */

  const { data: accounts = [] } = useQuery<ChartAccount[]>({
    queryKey: ["chart_of_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("chart_of_accounts").select("*").order("code");
      if (error) throw error;
      return (data || []) as unknown as ChartAccount[];
    },
  });

  const { data: statements = [] } = useQuery<BankStatement[]>({
    queryKey: ["bank_statements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bank_statements").select("*").order("upload_date", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as BankStatement[];
    },
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["transactions", selectedStatement],
    enabled: !!selectedStatement,
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").eq("statement_id", selectedStatement!).order("date");
      if (error) throw error;
      return (data || []) as unknown as Transaction[];
    },
  });

  const { data: complianceItems = [] } = useQuery<ComplianceItem[]>({
    queryKey: ["compliance_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("compliance_items").select("*").order("due_date");
      if (error) throw error;
      return (data || []) as unknown as ComplianceItem[];
    },
  });

  /* ─── File Upload ─── */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "pdf", "xlsx"].includes(ext || "")) {
      toast({ title: "Unsupported file", description: "Please upload CSV, PDF, or XLSX", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const filePath = `statements/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage.from("bank-statements").upload(filePath, file);
      if (uploadErr) throw uploadErr;

      // Create statement record
      const { data: stmt, error: stmtErr } = await supabase.from("bank_statements").insert({
        file_path: filePath,
        file_name: file.name,
        status: "processing",
      }).select().single();
      if (stmtErr) throw stmtErr;

      // Read file content for parsing
      let fileContent = "";
      if (ext === "csv") {
        fileContent = await file.text();
      } else if (ext === "pdf") {
        // Convert PDF to base64 text for AI parsing
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        fileContent = `[PDF file content - base64 encoded]\n${btoa(binary)}`;
      }

      // Call parse edge function
      const { error: fnErr } = await supabase.functions.invoke("parse-bank-statement", {
        body: {
          statement_id: (stmt as any).id,
          file_content: fileContent,
          file_type: ext,
        },
      });
      if (fnErr) throw fnErr;

      toast({ title: "Statement uploaded", description: "Transactions are being parsed..." });
      qc.invalidateQueries({ queryKey: ["bank_statements"] });

      // Auto-trigger categorisation
      setTimeout(() => handleCategorise((stmt as any).id), 2000);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  /* ─── AI Categorisation ─── */

  const handleCategorise = async (statementId: string) => {
    setCategorising(true);
    try {
      const { data, error } = await supabase.functions.invoke("categorise-transactions", {
        body: { statement_id: statementId },
      });
      if (error) throw error;
      toast({ title: "Categorisation complete", description: `${(data as any)?.categorised || 0} transactions categorised` });
      qc.invalidateQueries({ queryKey: ["transactions", statementId] });
      qc.invalidateQueries({ queryKey: ["bank_statements"] });
    } catch (err: any) {
      toast({ title: "Categorisation failed", description: err.message, variant: "destructive" });
    } finally {
      setCategorising(false);
    }
  };

  /* ─── Transaction Actions ─── */

  const confirmTransaction = useMutation({
    mutationFn: async ({ id, account_id }: { id: string; account_id: string }) => {
      const { error } = await supabase.from("transactions").update({ confirmed: true, account_id }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions", selectedStatement] });
    },
  });

  const bulkConfirmHighConfidence = async () => {
    const highConf = filteredTransactions.filter(t => !t.confirmed && t.ai_confidence >= 0.8 && t.account_id);
    for (const t of highConf) {
      await supabase.from("transactions").update({ confirmed: true }).eq("id", t.id);
    }
    toast({ title: "Bulk confirmed", description: `${highConf.length} transactions confirmed` });
    qc.invalidateQueries({ queryKey: ["transactions", selectedStatement] });
  };

  const updateTransactionAccount = async (txnId: string, accountId: string) => {
    await supabase.from("transactions").update({ account_id: accountId }).eq("id", txnId);
    qc.invalidateQueries({ queryKey: ["transactions", selectedStatement] });
  };

  /* ─── Chart of Accounts CRUD ─── */

  const addAccount = async () => {
    const { error } = await supabase.from("chart_of_accounts").insert(newAccount as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Account added" });
    setShowAddAccount(false);
    setNewAccount({ code: "", name: "", type: "expense", category: "", tax_treatment: "vat_inclusive" });
    qc.invalidateQueries({ queryKey: ["chart_of_accounts"] });
  };

  const toggleAccountActive = async (id: string, current: boolean) => {
    await supabase.from("chart_of_accounts").update({ is_active: !current }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["chart_of_accounts"] });
  };

  /* ─── Compliance CRUD ─── */

  const addCompliance = async () => {
    const { error } = await supabase.from("compliance_items").insert(newCompliance as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Compliance item added" });
    setShowAddCompliance(false);
    setNewCompliance({ title: "", body: "SARS", due_date: "", frequency: "annual", notes: "" });
    qc.invalidateQueries({ queryKey: ["compliance_items"] });
  };

  const updateComplianceStatus = async (id: string, status: string) => {
    await supabase.from("compliance_items").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["compliance_items"] });
  };

  /* ─── Derived ─── */

  const filteredTransactions = transactions.filter(t => {
    if (txnFilter === "uncategorised") return !t.confirmed && !t.account_id;
    if (txnFilter === "confirmed") return t.confirmed;
    return true;
  });

  const getAccountName = (accountId: string | null) => {
    if (!accountId) return "—";
    const a = accounts.find(acc => acc.id === accountId);
    return a ? `${a.code} ${a.name}` : "—";
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      processing: "bg-yellow-500/10 text-yellow-600",
      categorised: "bg-blue-500/10 text-blue-600",
      reviewed: "bg-green-500/10 text-green-600",
      upcoming: "bg-muted text-muted-foreground",
      due: "bg-yellow-500/10 text-yellow-600",
      submitted: "bg-green-500/10 text-green-600",
      overdue: "bg-destructive/10 text-destructive",
    };
    return <Badge className={`${map[status] || ""} text-xs`}>{status}</Badge>;
  };

  /* ─── Transaction Review Subview ─── */

  if (selectedStatement) {
    const stmt = statements.find(s => s.id === selectedStatement);
    const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const uncategorisedCount = transactions.filter(t => !t.confirmed && !t.account_id).length;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedStatement(null)}>
            <ArrowLeft size={16} className="mr-1" /> Back to Statements
          </Button>
          <h2 className="text-lg font-semibold">{stmt?.file_name}</h2>
          {stmt && statusBadge(stmt.status)}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Income</p><p className="text-lg font-bold text-green-600">R {totalIncome.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Expenses</p><p className="text-lg font-bold text-destructive">R {totalExpense.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Transactions</p><p className="text-lg font-bold">{transactions.length}</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Uncategorised</p><p className="text-lg font-bold">{uncategorisedCount}</p></CardContent></Card>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={txnFilter} onValueChange={(v) => setTxnFilter(v as any)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="uncategorised">Uncategorised</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => handleCategorise(selectedStatement)} disabled={categorising}>
            <Brain size={14} className="mr-1" /> {categorising ? "Categorising..." : "Re-categorise with AI"}
          </Button>
          <Button size="sm" onClick={bulkConfirmHighConfidence}>
            <CheckCircle2 size={14} className="mr-1" /> Bulk Confirm (&gt;80%)
          </Button>
        </div>

        {/* Transaction Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-[120px]">Amount</TableHead>
                  <TableHead className="w-[220px]">Category</TableHead>
                  <TableHead className="w-[80px]">Conf.</TableHead>
                  <TableHead className="w-[60px]">VAT</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(t => (
                  <TableRow key={t.id} className={t.confirmed ? "opacity-60" : ""}>
                    <TableCell className="text-xs">{t.date}</TableCell>
                    <TableCell className="text-xs max-w-[250px] truncate" title={t.description}>{t.description}</TableCell>
                    <TableCell className={`text-right text-xs font-mono ${t.amount > 0 ? "text-green-600" : "text-destructive"}`}>
                      R {Math.abs(t.amount).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {t.confirmed ? (
                        <span className="text-xs">{getAccountName(t.account_id)}</span>
                      ) : (
                        <Select value={t.account_id || ""} onValueChange={(v) => updateTransactionAccount(t.id, v)}>
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder={t.ai_category?.split(" - ")[0] || "Select..."} />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.filter(a => a.is_active).map(a => (
                              <SelectItem key={a.id} value={a.id} className="text-xs">{a.code} {a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {t.ai_confidence > 0 && (
                        <Badge className={`text-[10px] ${t.ai_confidence >= 0.8 ? "bg-green-500/10 text-green-600" : t.ai_confidence >= 0.5 ? "bg-yellow-500/10 text-yellow-600" : "bg-destructive/10 text-destructive"}`}>
                          {Math.round(t.ai_confidence * 100)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono">R {t.vat_amount?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      {!t.confirmed && t.account_id && (
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => confirmTransaction.mutate({ id: t.id, account_id: t.account_id! })}>
                          <CheckCircle2 size={12} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ─── Main Tabbed View ─── */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accountant</h1>
        <p className="text-sm text-muted-foreground mt-1">Bank statements, transaction categorisation, chart of accounts & SA compliance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="statements"><FileText size={14} className="mr-1" /> Statements</TabsTrigger>
          <TabsTrigger value="accounts"><span className="mr-1">📊</span> Chart of Accounts</TabsTrigger>
          <TabsTrigger value="compliance"><Calendar size={14} className="mr-1" /> Compliance</TabsTrigger>
        </TabsList>

        {/* ─── STATEMENTS TAB ─── */}
        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upload Bank Statement</CardTitle>
                <Badge variant="outline" className="text-xs">CSV · PDF supported</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 cursor-pointer hover:border-primary/40 transition-colors">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{uploading ? "Uploading & parsing..." : "Click to upload or drag & drop"}</span>
                <span className="text-xs text-muted-foreground/60 mt-1">FNB, Nedbank, Standard Bank, Absa, Capitec formats supported</span>
                <input type="file" accept=".csv,.pdf,.xlsx" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </CardContent>
          </Card>

          {statements.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">In</TableHead>
                      <TableHead className="text-right">Out</TableHead>
                      <TableHead>Txns</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statements.map(s => (
                      <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelectedStatement(s.id)}>
                        <TableCell className="text-xs font-medium">{s.file_name}</TableCell>
                        <TableCell className="text-xs">{s.bank_name || "—"}</TableCell>
                        <TableCell className="text-xs">
                          {s.period_start && s.period_end ? `${s.period_start} → ${s.period_end}` : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-green-600">R {(s.total_in || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right text-xs text-destructive">R {(s.total_out || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-xs">{s.transaction_count}</TableCell>
                        <TableCell>{statusBadge(s.status)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleCategorise(s.id); }} disabled={categorising}>
                            <Brain size={12} className="mr-1" /> Categorise
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── CHART OF ACCOUNTS TAB ─── */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus size={14} className="mr-1" /> Add Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add GL Account</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Code</Label><Input value={newAccount.code} onChange={e => setNewAccount(p => ({ ...p, code: e.target.value }))} placeholder="e.g. 6250" /></div>
                    <div><Label className="text-xs">Name</Label><Input value={newAccount.name} onChange={e => setNewAccount(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cleaning" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select value={newAccount.type} onValueChange={v => setNewAccount(p => ({ ...p, type: v as AccountType }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["income", "expense", "asset", "liability", "equity"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tax Treatment</Label>
                      <Select value={newAccount.tax_treatment} onValueChange={v => setNewAccount(p => ({ ...p, tax_treatment: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["vat_inclusive", "vat_exclusive", "exempt", "zero_rated"].map(t => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label className="text-xs">Category</Label><Input value={newAccount.category} onChange={e => setNewAccount(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Operating Expenses" /></div>
                  <Button onClick={addAccount} className="w-full">Add Account</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead className="w-[80px]">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map(a => (
                    <TableRow key={a.id} className={!a.is_active ? "opacity-40" : ""}>
                      <TableCell className="text-xs font-mono font-bold">{a.code}</TableCell>
                      <TableCell className="text-xs">{a.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{a.type}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.category}</TableCell>
                      <TableCell className="text-xs">{a.tax_treatment.replace("_", " ")}</TableCell>
                      <TableCell>
                        <Switch checked={a.is_active} onCheckedChange={() => toggleAccountActive(a.id, a.is_active)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── COMPLIANCE TRACKER TAB ─── */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddCompliance} onOpenChange={setShowAddCompliance}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus size={14} className="mr-1" /> Add Obligation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Compliance Item</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label className="text-xs">Title</Label><Input value={newCompliance.title} onChange={e => setNewCompliance(p => ({ ...p, title: e.target.value }))} placeholder="e.g. SDL Return" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Regulatory Body</Label>
                      <Select value={newCompliance.body} onValueChange={v => setNewCompliance(p => ({ ...p, body: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["SARS", "CIPC", "UIF", "COIDA", "Other"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Select value={newCompliance.frequency} onValueChange={v => setNewCompliance(p => ({ ...p, frequency: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["monthly", "bi-monthly", "quarterly", "annual", "once"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label className="text-xs">Due Date</Label><Input type="date" value={newCompliance.due_date} onChange={e => setNewCompliance(p => ({ ...p, due_date: e.target.value }))} /></div>
                  <div><Label className="text-xs">Notes</Label><Textarea value={newCompliance.notes} onChange={e => setNewCompliance(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
                  <Button onClick={addCompliance} className="w-full">Add Obligation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {complianceItems.map(item => {
              const overdue = isPast(new Date(item.due_date)) && item.status !== "submitted";
              const dueToday = isToday(new Date(item.due_date));
              return (
                <Card key={item.id} className={`${overdue ? "border-destructive/40" : dueToday ? "border-yellow-500/40" : ""}`}>
                  <CardContent className="py-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {overdue && <AlertTriangle size={14} className="text-destructive" />}
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge variant="outline" className="text-[10px]">{item.body}</Badge>
                        <Badge variant="outline" className="text-[10px]">{item.frequency}</Badge>
                        {statusBadge(overdue && item.status !== "submitted" ? "overdue" : item.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Due: {format(new Date(item.due_date), "dd MMM yyyy")}</p>
                      {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                    <Select value={item.status} onValueChange={(v) => updateComplianceStatus(item.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["upcoming", "due", "submitted", "overdue"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAccountant;
