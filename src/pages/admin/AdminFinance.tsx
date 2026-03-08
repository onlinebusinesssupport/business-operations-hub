import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, differenceInDays, parseISO } from "date-fns";

/* ═══════════════════════════════════════════════
   KPMG-STYLE TOKENS
   ═══════════════════════════════════════════════ */
const NAVY = "#0C2340";
const SLATE = "#4A5568";
const GREEN_MUTED = "#276749";
const RED_MUTED = "#9B2C2C";
const BLUE_ACCENT = "#1A365D";
const CHART_COLORS = ["#0C2340", "#276749", "#2B6CB0", "#4A5568", "#718096"];

/* ═══════════════════════════════════════════════
   CSV EXPORT UTILITY
   ═══════════════════════════════════════════════ */
function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════
   PERIOD HELPERS
   ═══════════════════════════════════════════════ */
const periodOptions = [
  { label: "Last 3 months", value: "3" },
  { label: "Last 6 months", value: "6" },
  { label: "Year to date", value: "ytd" },
  { label: "Last 12 months", value: "12" },
];

function getPeriodRange(period: string) {
  const now = new Date();
  if (period === "ytd") {
    return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }
  const months = parseInt(period);
  return { from: subMonths(startOfMonth(now), months - 1), to: now };
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
const AdminFinance = () => {
  const [period, setPeriod] = useState("6");
  const range = useMemo(() => getPeriodRange(period), [period]);

  // ── DATA QUERIES ──
  const { data: invoices = [] } = useQuery({
    queryKey: ["finance-invoices"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*, clients(name)");
      return data || [];
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["finance-transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*, chart_of_accounts(name, type, category)").eq("confirmed", true);
      return data || [];
    },
  });

  const { data: compliance = [] } = useQuery({
    queryKey: ["finance-compliance"],
    queryFn: async () => {
      const { data } = await supabase.from("compliance_items").select("*").order("due_date");
      return data || [];
    },
  });

  const { data: bankStatements = [] } = useQuery({
    queryKey: ["finance-bank-statements"],
    queryFn: async () => {
      const { data } = await supabase.from("bank_statements").select("*").order("upload_date", { ascending: false });
      return data || [];
    },
  });

  // ── FILTERED INVOICES ──
  const filteredInvoices = useMemo(
    () => invoices.filter((i: any) => {
      const d = parseISO(i.invoice_date);
      return d >= range.from && d <= range.to;
    }),
    [invoices, range]
  );

  const filteredTransactions = useMemo(
    () => transactions.filter((t: any) => {
      const d = parseISO(t.date);
      return d >= range.from && d <= range.to;
    }),
    [transactions, range]
  );

  // ── KPIs ──
  const totalRevenue = filteredInvoices.reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const paidInvoices = filteredInvoices.filter((i: any) => i.status === "paid");
  const totalPaid = paidInvoices.reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  // ── MONTHLY REVENUE TREND ──
  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    filteredInvoices.forEach((i: any) => {
      const key = format(parseISO(i.invoice_date), "MMM yyyy");
      map[key] = (map[key] || 0) + Number(i.amount || 0);
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount }));
  }, [filteredInvoices]);

  // ── REVENUE BY CLIENT ──
  const revenueByClient = useMemo(() => {
    const map: Record<string, number> = {};
    filteredInvoices.forEach((i: any) => {
      const name = (i.clients as any)?.name || "Unknown";
      map[name] = (map[name] || 0) + Number(i.amount || 0);
    });
    return Object.entries(map)
      .map(([client, amount]) => ({ client, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [filteredInvoices]);

  // ── INVOICE AGING ──
  const invoiceAging = useMemo(() => {
    const buckets = { current: 0, "30 days": 0, "60 days": 0, "90+ days": 0 };
    const unpaid = invoices.filter((i: any) => i.status !== "paid" && i.due_date);
    const now = new Date();
    unpaid.forEach((i: any) => {
      const days = differenceInDays(now, parseISO(i.due_date));
      if (days <= 0) buckets.current += Number(i.amount);
      else if (days <= 30) buckets["30 days"] += Number(i.amount);
      else if (days <= 60) buckets["60 days"] += Number(i.amount);
      else buckets["90+ days"] += Number(i.amount);
    });
    return Object.entries(buckets).map(([bucket, amount]) => ({ bucket, amount }));
  }, [invoices]);

  // ── P&L ──
  const pnl = useMemo(() => {
    const income = filteredTransactions.filter((t: any) => t.chart_of_accounts?.type === "income");
    const expense = filteredTransactions.filter((t: any) => t.chart_of_accounts?.type === "expense");
    const totalIncome = income.reduce((s: number, t: any) => s + Math.abs(Number(t.amount)), 0);
    const totalExpenses = expense.reduce((s: number, t: any) => s + Math.abs(Number(t.amount)), 0);
    const totalVAT = filteredTransactions.reduce((s: number, t: any) => s + Number(t.vat_amount || 0), 0);

    // Group by category
    const incomeByCategory: Record<string, number> = {};
    income.forEach((t: any) => {
      const cat = t.chart_of_accounts?.category || "Other Income";
      incomeByCategory[cat] = (incomeByCategory[cat] || 0) + Math.abs(Number(t.amount));
    });
    const expenseByCategory: Record<string, number> = {};
    expense.forEach((t: any) => {
      const cat = t.chart_of_accounts?.category || "Other Expenses";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Math.abs(Number(t.amount));
    });

    return { totalIncome, totalExpenses, grossProfit: totalIncome - totalExpenses, totalVAT, incomeByCategory, expenseByCategory };
  }, [filteredTransactions]);

  // ── CASH FLOW ──
  const cashFlow = useMemo(() => {
    const inflows = filteredTransactions.filter((t: any) => Number(t.amount) > 0);
    const outflows = filteredTransactions.filter((t: any) => Number(t.amount) < 0);
    const totalIn = inflows.reduce((s: number, t: any) => s + Number(t.amount), 0);
    const totalOut = Math.abs(outflows.reduce((s: number, t: any) => s + Number(t.amount), 0));

    // Monthly trend
    const monthMap: Record<string, { inflow: number; outflow: number }> = {};
    filteredTransactions.forEach((t: any) => {
      const key = format(parseISO(t.date), "MMM yyyy");
      if (!monthMap[key]) monthMap[key] = { inflow: 0, outflow: 0 };
      const amt = Number(t.amount);
      if (amt > 0) monthMap[key].inflow += amt;
      else monthMap[key].outflow += Math.abs(amt);
    });
    const monthly = Object.entries(monthMap).map(([month, v]) => ({ month, ...v }));

    // Top expense categories
    const catMap: Record<string, number> = {};
    outflows.forEach((t: any) => {
      const cat = t.chart_of_accounts?.category || t.ai_category || "Uncategorised";
      catMap[cat] = (catMap[cat] || 0) + Math.abs(Number(t.amount));
    });
    const topExpenses = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { totalIn, totalOut, net: totalIn - totalOut, monthly, topExpenses };
  }, [filteredTransactions]);

  // ── VAT SUMMARY ──
  const vatSummary = useMemo(() => {
    const outputVAT = filteredTransactions
      .filter((t: any) => t.chart_of_accounts?.type === "income")
      .reduce((s: number, t: any) => s + Number(t.vat_amount || 0), 0);
    const inputVAT = filteredTransactions
      .filter((t: any) => t.chart_of_accounts?.type === "expense")
      .reduce((s: number, t: any) => s + Math.abs(Number(t.vat_amount || 0)), 0);
    return { outputVAT, inputVAT, payable: outputVAT - inputVAT };
  }, [filteredTransactions]);

  const fmtZAR = (n: number) => `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const reportDate = format(new Date(), "dd MMMM yyyy, HH:mm");

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Financial Reports</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Georgia', serif", color: NAVY }}>
            Finance Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] text-xs" style={{ borderColor: NAVY }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── TABS ── */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-0 h-auto p-0" style={{ borderColor: NAVY + "30" }}>
          {["revenue", "pnl", "cashflow", "compliance"].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none border-b-2 border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {{ revenue: "Revenue & Sales", pnl: "Profit & Loss", cashflow: "Cash Flow", compliance: "Compliance & Tax" }[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════ TAB A: REVENUE ═══════ */}
        <TabsContent value="revenue" className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Invoiced" value={fmtZAR(totalRevenue)} icon={<TrendingUp size={16} />} accent={NAVY} />
            <KpiCard label="Total Collected" value={fmtZAR(totalPaid)} icon={<CheckCircle2 size={16} />} accent={GREEN_MUTED} />
            <KpiCard label="Collection Rate" value={`${collectionRate}%`} icon={<TrendingUp size={16} />} accent={collectionRate >= 80 ? GREEN_MUTED : RED_MUTED} />
            <KpiCard label="Outstanding" value={fmtZAR(totalRevenue - totalPaid)} icon={<Clock size={16} />} accent={RED_MUTED} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Monthly Revenue Trend" onExport={() => exportCSV("revenue-monthly", ["Month", "Amount"], monthlyRevenue.map(r => [r.month, r.amount]))}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: SLATE }} />
                  <YAxis tick={{ fontSize: 11, fill: SLATE }} tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmtZAR(v)} />
                  <Bar dataKey="amount" fill={NAVY} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>

            <ReportCard title="Revenue by Client" onExport={() => exportCSV("revenue-client", ["Client", "Amount"], revenueByClient.map(r => [r.client, r.amount]))}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByClient} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: SLATE }} tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="client" type="category" tick={{ fontSize: 11, fill: SLATE }} width={120} />
                  <Tooltip formatter={(v: number) => fmtZAR(v)} />
                  <Bar dataKey="amount" fill={BLUE_ACCENT}>
                    {revenueByClient.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>

          {/* Aging */}
          <ReportCard title="Invoice Aging Analysis" onExport={() => exportCSV("invoice-aging", ["Bucket", "Amount"], invoiceAging.map(r => [r.bucket, r.amount]))}>
            <div className="overflow-auto">
              <table className="w-full text-sm" style={{ fontFamily: "'Courier New', monospace" }}>
                <thead>
                  <tr style={{ backgroundColor: NAVY + "10", borderBottom: `2px solid ${NAVY}` }}>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>Aging Bucket</th>
                    <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>Outstanding Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceAging.map((row, i) => (
                    <tr key={row.bucket} className={i % 2 === 0 ? "" : "bg-muted/30"} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td className="px-4 py-3">{row.bucket}</td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: row.amount > 0 ? RED_MUTED : GREEN_MUTED }}>{fmtZAR(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>
        </TabsContent>

        {/* ═══════ TAB B: P&L ═══════ */}
        <TabsContent value="pnl" className="space-y-6">
          <ReportCard
            title="Statement of Profit and Loss"
            subtitle={`For the period ${format(range.from, "dd MMM yyyy")} – ${format(range.to, "dd MMM yyyy")}`}
            onExport={() => {
              const rows: (string | number)[][] = [
                ["REVENUE", ""],
                ...Object.entries(pnl.incomeByCategory).map(([cat, amt]) => [cat, amt]),
                ["Total Revenue", pnl.totalIncome],
                ["", ""],
                ["OPERATING EXPENSES", ""],
                ...Object.entries(pnl.expenseByCategory).map(([cat, amt]) => [cat, amt]),
                ["Total Expenses", pnl.totalExpenses],
                ["", ""],
                ["GROSS PROFIT", pnl.grossProfit],
                ["VAT (Net)", pnl.totalVAT],
              ];
              exportCSV("profit-and-loss", ["Description", "Amount (ZAR)"], rows);
            }}
          >
            <div className="overflow-auto">
              <table className="w-full text-sm" style={{ fontFamily: "'Courier New', monospace" }}>
                <tbody>
                  <PnlSection heading="Revenue" items={pnl.incomeByCategory} total={pnl.totalIncome} fmtZAR={fmtZAR} color={GREEN_MUTED} />
                  <PnlSection heading="Operating Expenses" items={pnl.expenseByCategory} total={pnl.totalExpenses} fmtZAR={fmtZAR} color={RED_MUTED} />
                  <tr style={{ borderTop: `3px double ${NAVY}` }}>
                    <td className="px-4 py-3 font-bold text-sm" style={{ color: NAVY, fontFamily: "'Georgia', serif" }}>NET PROFIT / (LOSS)</td>
                    <td className="px-4 py-3 text-right font-bold text-base" style={{ color: pnl.grossProfit >= 0 ? GREEN_MUTED : RED_MUTED }}>
                      {fmtZAR(pnl.grossProfit)}
                    </td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="px-4 py-2 text-xs text-muted-foreground">VAT Summary (Net)</td>
                    <td className="px-4 py-2 text-right text-xs text-muted-foreground font-mono">{fmtZAR(pnl.totalVAT)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ReportCard>

          {filteredTransactions.length === 0 && (
            <div className="flex items-center gap-3 p-4 border rounded-none bg-muted/20" style={{ borderColor: NAVY + "20" }}>
              <AlertCircle size={16} style={{ color: NAVY }} />
              <p className="text-sm text-muted-foreground">
                No confirmed transactions found for this period. Import and confirm bank statement transactions in the Accountant module.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ═══════ TAB C: CASH FLOW ═══════ */}
        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Total Inflows" value={fmtZAR(cashFlow.totalIn)} icon={<TrendingUp size={16} />} accent={GREEN_MUTED} />
            <KpiCard label="Total Outflows" value={fmtZAR(cashFlow.totalOut)} icon={<TrendingDown size={16} />} accent={RED_MUTED} />
            <KpiCard label="Net Cash Flow" value={fmtZAR(cashFlow.net)} icon={<TrendingUp size={16} />} accent={cashFlow.net >= 0 ? GREEN_MUTED : RED_MUTED} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportCard title="Monthly Cash Movement" onExport={() => exportCSV("cashflow-monthly", ["Month", "Inflow", "Outflow"], cashFlow.monthly.map(m => [m.month, m.inflow, m.outflow]))}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlow.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: SLATE }} />
                    <YAxis tick={{ fontSize: 11, fill: SLATE }} tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => fmtZAR(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="inflow" stroke={GREEN_MUTED} strokeWidth={2} dot={{ r: 3 }} name="Inflows" />
                    <Line type="monotone" dataKey="outflow" stroke={RED_MUTED} strokeWidth={2} dot={{ r: 3 }} name="Outflows" />
                  </LineChart>
                </ResponsiveContainer>
              </ReportCard>
            </div>

            <ReportCard title="Top 5 Expense Categories">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cashFlow.topExpenses} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {cashFlow.topExpenses.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtZAR(v)} />
                </PieChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>

          {/* Bank statements summary */}
          {bankStatements.length > 0 && (
            <ReportCard title="Imported Bank Statements">
              <div className="overflow-auto">
                <table className="w-full text-sm" style={{ fontFamily: "'Courier New', monospace" }}>
                  <thead>
                    <tr style={{ backgroundColor: NAVY + "10", borderBottom: `2px solid ${NAVY}` }}>
                      {["Bank", "Account", "Period", "Transactions", "Total In", "Total Out"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bankStatements.map((bs: any, i: number) => (
                      <tr key={bs.id} className={i % 2 === 0 ? "" : "bg-muted/30"} style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td className="px-4 py-2">{bs.bank_name || "—"}</td>
                        <td className="px-4 py-2">{bs.account_number || "—"}</td>
                        <td className="px-4 py-2 text-xs">{bs.period_start && bs.period_end ? `${bs.period_start} – ${bs.period_end}` : "—"}</td>
                        <td className="px-4 py-2 text-center">{bs.transaction_count}</td>
                        <td className="px-4 py-2 text-right" style={{ color: GREEN_MUTED }}>{fmtZAR(Number(bs.total_in || 0))}</td>
                        <td className="px-4 py-2 text-right" style={{ color: RED_MUTED }}>{fmtZAR(Number(bs.total_out || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          )}
        </TabsContent>

        {/* ═══════ TAB D: COMPLIANCE & TAX ═══════ */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Output VAT" value={fmtZAR(vatSummary.outputVAT)} icon={<TrendingUp size={16} />} accent={NAVY} />
            <KpiCard label="Input VAT" value={fmtZAR(vatSummary.inputVAT)} icon={<TrendingDown size={16} />} accent={BLUE_ACCENT} />
            <KpiCard label="VAT Payable" value={fmtZAR(vatSummary.payable)} icon={<AlertCircle size={16} />} accent={vatSummary.payable > 0 ? RED_MUTED : GREEN_MUTED} />
          </div>

          <ReportCard title="Compliance Calendar & Filing Deadlines" onExport={() => exportCSV("compliance", ["Title", "Body", "Due Date", "Frequency", "Status"], compliance.map((c: any) => [c.title, c.body, c.due_date, c.frequency, c.status]))}>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: NAVY + "10", borderBottom: `2px solid ${NAVY}` }}>
                    {["Filing", "Authority", "Due Date", "Frequency", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: NAVY }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compliance.map((item: any, i: number) => {
                    const overdue = new Date(item.due_date) < new Date() && item.status !== "filed";
                    return (
                      <tr key={item.id} className={i % 2 === 0 ? "" : "bg-muted/30"} style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td className="px-4 py-3 font-medium">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider" style={{ backgroundColor: NAVY + "15", color: NAVY }}>
                            {item.body}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: overdue ? RED_MUTED : undefined }}>
                          {item.due_date}
                        </td>
                        <td className="px-4 py-3 capitalize text-xs">{item.frequency}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            item.status === "filed" ? "text-green-700" : overdue ? "text-red-700" : "text-amber-600"
                          }`}>
                            {item.status === "filed" ? <CheckCircle2 size={13} /> : overdue ? <AlertCircle size={13} /> : <Clock size={13} />}
                            {item.status === "filed" ? "Filed" : overdue ? "Overdue" : "Upcoming"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {compliance.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No compliance items found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </ReportCard>
        </TabsContent>
      </Tabs>

      {/* ── FOOTER ── */}
      <div className="border-t pt-4 mt-8 flex justify-between items-center" style={{ borderColor: NAVY + "20" }}>
        <p className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Georgia', serif" }}>
          Prepared by THE BUSINESS SUPPORT STUDIO™ — {reportDate}
        </p>
        <p className="text-[10px] text-muted-foreground italic">Confidential</p>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          aside, header, .no-print { display: none !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════ */

function KpiCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="rounded-none border-l-4" style={{ borderLeftColor: accent }}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold" style={{ fontFamily: "'Courier New', monospace", color: accent }}>{value}</p>
        </div>
        <div className="p-2 rounded-none" style={{ backgroundColor: accent + "15", color: accent }}>{icon}</div>
      </CardContent>
    </Card>
  );
}

function ReportCard({ title, subtitle, children, onExport }: { title: string; subtitle?: string; children: React.ReactNode; onExport?: () => void }) {
  return (
    <Card className="rounded-none overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: NAVY, color: "white" }}>
        <div>
          <h3 className="text-sm font-semibold tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>{title}</h3>
          {subtitle && <p className="text-[10px] text-white/60 mt-0.5">{subtitle}</p>}
        </div>
        {onExport && (
          <Button variant="ghost" size="sm" onClick={onExport} className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2">
            <Download size={14} className="mr-1" /> CSV
          </Button>
        )}
      </div>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}

function PnlSection({ heading, items, total, fmtZAR, color }: { heading: string; items: Record<string, number>; total: number; fmtZAR: (n: number) => string; color: string }) {
  return (
    <>
      <tr style={{ backgroundColor: NAVY + "08" }}>
        <td colSpan={2} className="px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: NAVY, fontFamily: "'Georgia', serif" }}>{heading}</td>
      </tr>
      {Object.entries(items).map(([cat, amt], i) => (
        <tr key={cat} className={i % 2 === 0 ? "" : "bg-muted/20"} style={{ borderBottom: "1px solid #E2E8F0" }}>
          <td className="px-4 py-2 pl-8 text-sm">{cat}</td>
          <td className="px-4 py-2 text-right font-mono text-sm">{fmtZAR(amt)}</td>
        </tr>
      ))}
      <tr style={{ borderTop: `1px solid ${NAVY}`, borderBottom: `2px solid ${NAVY}` }}>
        <td className="px-4 py-2 font-semibold text-sm" style={{ color: NAVY }}>Total {heading}</td>
        <td className="px-4 py-2 text-right font-bold font-mono" style={{ color }}>{fmtZAR(total)}</td>
      </tr>
    </>
  );
}

export default AdminFinance;
