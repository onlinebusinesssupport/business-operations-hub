import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, RefreshCw, AlertTriangle, TrendingUp, Zap, BarChart3, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLeko, LekoInsight } from "@/contexts/LekoContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import lekoAvatar from "@/assets/leko-avatar.png";

const PAGE_CONFIG: Record<string, { label: string; dataFetcher: string }> = {
  "/admin/accountant": { label: "Accountant", dataFetcher: "accountant" },
  "/admin/finance": { label: "Finance", dataFetcher: "finance" },
  "/admin/applications": { label: "Applications", dataFetcher: "applications" },
  "/admin/clients": { label: "Partner Workspaces", dataFetcher: "clients" },
  "/admin": { label: "Studio Overview", dataFetcher: "overview" },
  "/admin/revenue": { label: "Revenue", dataFetcher: "revenue" },
  "/admin/work": { label: "Work Manager", dataFetcher: "work" },
};

const severityStyles: Record<string, { bg: string; border: string; icon: typeof AlertTriangle }> = {
  critical: { bg: "bg-destructive/10", border: "border-destructive/30", icon: AlertTriangle },
  warning: { bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertTriangle },
  info: { bg: "bg-primary/5", border: "border-primary/20", icon: Brain },
  positive: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: TrendingUp },
};

const typeIcons: Record<string, typeof Zap> = {
  risk: AlertTriangle,
  opportunity: TrendingUp,
  action: Zap,
  forecast: BarChart3,
};

const LekoInsightPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { insights, isLoading, panelOpen, setPanelOpen, refreshInsights, lastPage } = useLeko();
  const { isAdmin } = useAuth();

  // Determine current page context
  const currentPage = Object.keys(PAGE_CONFIG).find((path) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path)
  );
  const pageConfig = currentPage ? PAGE_CONFIG[currentPage] : null;

  // ─── Data fetchers for each page ───
  const { data: accountantData } = useQuery({
    queryKey: ["leko-accountant"],
    queryFn: async () => {
      const [statements, transactions] = await Promise.all([
        supabase.from("bank_statements").select("id, file_name, status, transaction_count, total_in, total_out, period_start, period_end").order("created_at", { ascending: false }).limit(10),
        supabase.from("transactions").select("id, description, amount, confirmed, ai_category, ai_confidence, date").eq("confirmed", false).limit(20),
      ]);
      return {
        recentStatements: statements.data || [],
        unconfirmedTransactions: transactions.data || [],
        totalUnconfirmed: (transactions.data || []).length,
      };
    },
    enabled: pageConfig?.dataFetcher === "accountant" && panelOpen,
  });

  const { data: financeData } = useQuery({
    queryKey: ["leko-finance"],
    queryFn: async () => {
      const [transactions, invoices] = await Promise.all([
        supabase.from("transactions").select("id, amount, date, ai_category, confirmed").order("date", { ascending: false }).limit(50),
        supabase.from("invoices").select("id, amount, status, due_date, client_id, invoice_number").order("invoice_date", { ascending: false }).limit(20),
      ]);
      const txns = transactions.data || [];
      const invs = invoices.data || [];
      const unpaidInvoices = invs.filter((i) => i.status !== "paid" && i.status !== "draft");
      const totalIn = txns.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
      const totalOut = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
      return {
        totalIn, totalOut, netCashflow: totalIn - totalOut,
        unpaidInvoices: unpaidInvoices.map((i) => ({ id: i.id, amount: i.amount, due_date: i.due_date, invoice_number: i.invoice_number })),
        unpaidTotal: unpaidInvoices.reduce((s, i) => s + Number(i.amount), 0),
        transactionCount: txns.length,
      };
    },
    enabled: pageConfig?.dataFetcher === "finance" && panelOpen,
  });

  const { data: pipelineData } = useQuery({
    queryKey: ["leko-pipeline"],
    queryFn: async () => {
      const [contacts, applications] = await Promise.all([
        supabase.from("contact_submissions").select("id, name, email, service_interest, lifecycle_stage, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("applications").select("id, full_name, status, created_at").order("created_at", { ascending: false }).limit(10),
      ]);
      const leads = contacts.data || [];
      const apps = applications.data || [];
      return {
        totalLeads: leads.length,
        newInquiries: leads.filter((l) => l.lifecycle_stage === "new_inquiry").length,
        pendingApplications: apps.filter((a) => a.status === "pending").length,
        recentLeads: leads.slice(0, 5).map((l) => ({ name: l.name, interest: l.service_interest, stage: l.lifecycle_stage })),
      };
    },
    enabled: pageConfig?.dataFetcher === "pipeline" && panelOpen,
  });

  const { data: clientsData } = useQuery({
    queryKey: ["leko-clients"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name, health_score, retainer_used, retainer_limit, subscription_status, last_activity_at, compliance_status, tax_reference, physical_address, identity_doc_path").order("name");
      const clients = data || [];
      const atRisk = clients.filter((c) => c.subscription_status === "at_risk" || (c.health_score !== null && c.health_score < 50));
      const highRetainer = clients.filter((c) => c.retainer_limit > 0 && (c.retainer_used / c.retainer_limit) >= 0.85);
      const incompleteOnboarding = clients.filter((c: any) => {
        const missing: string[] = [];
        if (!c.identity_doc_path) missing.push("Identity document");
        if (!c.tax_reference) missing.push("Tax reference");
        if (!c.physical_address) missing.push("Physical address");
        return missing.length > 0 ? { name: c.name, missing } : null;
      }).filter(Boolean);
      return {
        totalClients: clients.length,
        activeClients: clients.filter((c) => c.subscription_status === "active").length,
        atRiskClients: atRisk.map((c) => ({ name: c.name, health: c.health_score })),
        highRetainerUsage: highRetainer.map((c) => ({ name: c.name, used: c.retainer_used, limit: c.retainer_limit })),
        incompleteOnboarding,
        complianceSummary: {
          verified: clients.filter((c: any) => c.compliance_status === "verified").length,
          pending: clients.filter((c: any) => c.compliance_status === "pending" || !c.compliance_status).length,
          missing: clients.filter((c: any) => c.compliance_status === "missing_documents").length,
        },
      };
    },
    enabled: (pageConfig?.dataFetcher === "clients" || pageConfig?.dataFetcher === "overview") && panelOpen,
  });

  const { data: workData } = useQuery({
    queryKey: ["leko-work"],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("id, title, status, priority, deadline, client_id").order("created_at", { ascending: false }).limit(30);
      const items = data || [];
      const overdue = items.filter((w) => w.deadline && new Date(w.deadline) < new Date() && w.status !== "complete");
      return {
        totalTasks: items.length,
        inProgress: items.filter((w) => w.status === "in_progress").length,
        overdueTasks: overdue.length,
        highPriority: items.filter((w) => w.priority === "high" && w.status !== "complete").length,
      };
    },
    enabled: (pageConfig?.dataFetcher === "work" || pageConfig?.dataFetcher === "overview") && panelOpen,
  });

  // Build data payload for current page
  const getDataForPage = useCallback(() => {
    if (!pageConfig) return null;
    switch (pageConfig.dataFetcher) {
      case "accountant": return accountantData;
      case "finance": return financeData;
      case "pipeline": return pipelineData;
      case "clients": return clientsData;
      case "overview": return { clients: clientsData, work: workData };
      case "revenue": return financeData;
      case "work": return workData;
      default: return null;
    }
  }, [pageConfig, accountantData, financeData, pipelineData, clientsData, workData]);

  // Auto-refresh when page changes and panel is open
  useEffect(() => {
    if (!panelOpen || !pageConfig || !isAdmin) return;
    const data = getDataForPage();
    if (data && currentPage !== lastPage) {
      refreshInsights(currentPage!, data);
    }
  }, [panelOpen, currentPage, pageConfig, isAdmin, getDataForPage, lastPage, refreshInsights]);

  const handleRefresh = () => {
    if (!pageConfig || !currentPage) return;
    const data = getDataForPage();
    if (data) refreshInsights(currentPage, data);
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Toggle button - always visible */}
      {!panelOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setPanelOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1.5 px-2 py-3 rounded-l-lg border border-r-0 border-border bg-card shadow-lg hover:bg-accent transition-colors"
          title="Open LEKO Insights"
        >
          <img src={lekoAvatar} alt="LEKO" className="w-5 h-5 rounded-full" />
          <ChevronRight size={12} className="rotate-180 text-muted-foreground" />
        </motion.button>
      )}

      {/* Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed right-0 top-14 bottom-0 z-40 bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden"
            style={{ width: 320 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
              <img src={lekoAvatar} alt="LEKO" className="w-7 h-7 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground tracking-wide">LEKO INTELLIGENCE</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                  {pageConfig?.label || "Global"} Analysis
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPanelOpen(false)}>
                <X size={13} />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {isLoading && insights.length === 0 ? (
                  <div className="py-12 text-center">
                    <Loader2 size={20} className="animate-spin text-primary mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground">LEKO is analysing this module…</p>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="py-12 text-center">
                    <Brain size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground">
                      {pageConfig
                        ? "Click refresh to generate insights for this page."
                        : "Navigate to a supported module for LEKO analysis."}
                    </p>
                    {pageConfig && (
                      <Button variant="outline" size="sm" className="mt-3 text-xs gap-1.5" onClick={handleRefresh}>
                        <Brain size={12} /> Analyse Now
                      </Button>
                    )}
                  </div>
                ) : (
                  insights.map((insight, i) => {
                    const style = severityStyles[insight.severity] || severityStyles.info;
                    const TypeIcon = typeIcons[insight.type] || Brain;
                    const SevIcon = style.icon;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`${style.bg} border ${style.border} p-3 space-y-2`}
                      >
                        <div className="flex items-start gap-2">
                          <SevIcon size={14} className="shrink-0 mt-0.5 text-foreground/70" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                {insight.type}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-foreground mt-0.5">{insight.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.body}</p>
                          </div>
                        </div>
                        {insight.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs h-7 gap-1.5 mt-1"
                            onClick={() => navigate(insight.action!.route)}
                          >
                            <Zap size={11} />
                            {insight.action.label}
                          </Button>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border shrink-0">
              <p className="text-[9px] text-muted-foreground/50 text-center uppercase tracking-[0.1em]">
                Powered by LEKO Intelligence Engine
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default LekoInsightPanel;
