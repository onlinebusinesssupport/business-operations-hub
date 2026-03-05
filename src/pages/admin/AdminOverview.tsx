import { motion } from "framer-motion";
import { Users, DollarSign, Inbox, ArrowRight, Clock, TrendingUp, BarChart3, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityFeed } from "@/components/ActivityFeed";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const AdminOverview = () => {
  const { user } = useAuth();

  const { data: clients = [] } = useQuery({
    queryKey: ["overview-clients"],
    queryFn: async () => { const { data } = await supabase.from("clients").select("id, name, status, services"); return data || []; },
  });
  const { data: workItems = [] } = useQuery({
    queryKey: ["overview-work"],
    queryFn: async () => { const { data } = await supabase.from("work_items").select("id, title, client_id, status, priority, deadline, description, clients(name)").order("created_at", { ascending: false }); return data || []; },
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["overview-requests"],
    queryFn: async () => { const { data } = await supabase.from("requests").select("id, title, client_id, priority, status, created_at, clients(name)").order("created_at", { ascending: false }); return data || []; },
  });
  const { data: invoices = [] } = useQuery({
    queryKey: ["overview-invoices"],
    queryFn: async () => { const { data } = await supabase.from("invoices").select("id, client_id, amount, status, clients(name)"); return data || []; },
  });
  const { data: updates = [] } = useQuery({
    queryKey: ["overview-updates"],
    queryFn: async () => { const { data } = await supabase.from("updates").select("id, content, created_at, update_type, clients(name)").order("created_at", { ascending: false }).limit(5); return data || []; },
  });
  const { data: applications = [] } = useQuery({
    queryKey: ["overview-applications"],
    queryFn: async () => { const { data } = await supabase.from("applications").select("id, status, full_name, business_name, updated_at").order("created_at", { ascending: false }); return data || []; },
  });
  const { data: contacts = [] } = useQuery({
    queryKey: ["overview-contacts"],
    queryFn: async () => { const { data } = await supabase.from("contact_submissions").select("id").order("created_at", { ascending: false }); return data || []; },
  });

  // Computed metrics
  const activeClients = clients.filter((c: any) => c.status === "active").length;
  const totalRevenue = invoices.reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const paidRevenue = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const pendingRevenue = totalRevenue - paidRevenue;
  const openRequests = requests.filter((r: any) => r.status === "new").length;
  const inProgressRequests = requests.filter((r: any) => r.status === "in_progress").length;
  const resolvedRequests = requests.filter((r: any) => r.status === "resolved").length;

  // Work status counts
  const todoCount = workItems.filter((w: any) => w.status === "to_do" || w.status === "queued").length;
  const inProgressCount = workItems.filter((w: any) => w.status === "in_progress").length;
  const awaitingClientCount = workItems.filter((w: any) => w.status === "awaiting_client").length;
  const inReviewCount = workItems.filter((w: any) => w.status === "in_review").length;
  const doneCount = workItems.filter((w: any) => w.status === "done").length;
  const totalWork = workItems.length;
  const taskCompletion = totalWork > 0 ? Math.round((doneCount / totalWork) * 100) : 0;

  // Lead pipeline
  const totalLeads = applications.length + contacts.length;
  const pendingApps = applications.filter((a: any) => a.status === "pending").length;
  const approvedApps = applications.filter((a: any) => a.status === "approved").length;
  const leadConversion = totalLeads > 0 ? Math.round((approvedApps / totalLeads) * 100) : 0;

  // Billing
  const paidInvoices = invoices.filter((i: any) => i.status === "paid").length;
  const pendingInvoices = invoices.filter((i: any) => i.status !== "paid" && i.status !== "draft").length;

  // Today's priorities: overdue + high priority work items
  const priorities = workItems
    .filter((w: any) => w.status !== "done")
    .sort((a: any, b: any) => {
      const aOverdue = a.deadline && new Date(a.deadline) < new Date();
      const bOverdue = b.deadline && new Date(b.deadline) < new Date();
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      const pOrder: any = { high: 0, medium: 1, low: 2 };
      return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1);
    })
    .slice(0, 5);

  const progressValue = (s: string) => ({ to_do: 10, queued: 10, in_progress: 35, awaiting_client: 55, in_review: 80, done: 100 }[s] || 0);

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Admin";

  const formatCurrency = (n: number) => `R${n.toLocaleString("en-ZA")}`;

  // Time ago helper
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div {...fade} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {greeting}, {firstName}.
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your command deck for THE BUSINESS SUPPORT STUDIO™.
        </p>
      </motion.div>

      {/* Top KPI Row */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/clients" className="bg-card border border-divider p-5 hover:shadow-md transition-all group">
            <p className="text-xs text-muted-foreground tracking-wide">Active Studios</p>
            <p className="font-display text-4xl font-bold text-foreground mt-2">{activeClients}</p>
            <p className="text-xs text-muted-foreground mt-1">{clients.length} total partners</p>
          </Link>

          <Link to="/admin/revenue" className="bg-card border border-divider p-5 hover:shadow-md transition-all group">
            <p className="text-xs text-muted-foreground tracking-wide">Pipeline Deal Value</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{formatCurrency(paidRevenue)}</span>
              {pendingRevenue > 0 && <span className="text-sm text-muted-foreground">+ {formatCurrency(pendingRevenue)}</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(paidRevenue)} · Collected</p>
          </Link>

          <Link to="/admin/requests" className="bg-card border border-divider p-5 hover:shadow-md transition-all group">
            <p className="text-xs text-muted-foreground tracking-wide">Requests Overview</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="text-center">
                <span className="font-display text-3xl font-bold text-foreground">{openRequests}</span>
                <p className="text-[10px] text-muted-foreground">Open</p>
              </div>
              <div className="w-px h-8 bg-divider" />
              <div className="text-center">
                <span className="font-display text-3xl font-bold text-foreground">{inProgressRequests}</span>
                <p className="text-[10px] text-muted-foreground">In Progress</p>
              </div>
              <div className="w-px h-8 bg-divider" />
              <div className="text-center">
                <span className="font-display text-3xl font-bold text-foreground">{resolvedRequests}</span>
                <p className="text-[10px] text-muted-foreground">Resolved</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Middle row: Priorities + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Priorities */}
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }} className="lg:col-span-2">
          <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Today's Priorities</p>
          <div className="bg-card border border-divider divide-y divide-divider">
            {priorities.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">All clear — no urgent items.</div>
            ) : priorities.map((w: any) => {
              const isOverdue = w.deadline && new Date(w.deadline) < new Date();
              const clientName = (w as any).clients?.name || "—";
              // Determine service tag from client services
              const client = clients.find((c: any) => c.id === w.client_id);
              const serviceTag = client?.services?.[0] || null;

              return (
                <div key={w.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isOverdue ? (
                      <AlertCircle size={16} className="text-destructive shrink-0" />
                    ) : (
                      <CheckCircle2 size={16} className="text-muted-foreground/40 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{w.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {clientName} · {isOverdue ? "Overdue" : w.deadline ? new Date(w.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "No deadline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {serviceTag && (
                      <span className="text-[10px] px-2 py-0.5 bg-accent text-foreground whitespace-nowrap">{serviceTag}</span>
                    )}
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Status breakdown */}
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Status</p>
          <div className="bg-card border border-divider p-5 space-y-5">
            {/* Visual status bars */}
            <div className="space-y-3">
              {[
                { label: "Queued", count: todoCount, color: "bg-muted-foreground/30" },
                { label: "In Progress", count: inProgressCount, color: "bg-primary" },
                { label: "Awaiting Client", count: awaitingClientCount, color: "bg-amber-500" },
                { label: "Review", count: inReviewCount, color: "bg-purple-500" },
                { label: "Complete", count: doneCount, color: "bg-foreground" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.color} shrink-0`} />
                  <span className="text-xs text-muted-foreground w-20">{s.label}</span>
                  <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${s.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: totalWork > 0 ? `${(s.count / totalWork) * 100}%` : "0%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-foreground w-6 text-right font-medium">{s.count}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-divider flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{totalWork} total items</span>
              <span className="text-foreground font-medium">{taskCompletion}% complete</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activations */}
      {applications.filter((a: any) => a.status === "approved").length > 0 && (
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.2 }}>
          <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Recent Activations</p>
          <div className="bg-card border border-divider divide-y divide-divider">
            {applications.filter((a: any) => a.status === "approved").slice(0, 3).map((a: any) => (
              <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">{a.business_name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.full_name}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{timeAgo(a.updated_at)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Activity Feed */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.25 }}>
        <ActivityFeed title="Global Activity" limit={10} />
      </motion.div>

      {/* Engagement feed */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.25 }}>
        <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Engagement</p>
        <div className="bg-card border border-divider divide-y divide-divider">
          {updates.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No recent activity</div>
          ) : updates.map((u: any) => (
            <div key={u.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-primary">
                    {((u as any).clients?.name || "?")[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{(u as any).clients?.name || "System"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{u.content}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{timeAgo(u.created_at)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom metrics row */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.25 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-divider p-5">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Lead Conversion</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{leadConversion}%</span>
              {totalLeads > 0 && (
                <span className="text-xs text-primary flex items-center gap-0.5"><TrendingUp size={10} />{approvedApps}/{totalLeads}</span>
              )}
            </div>
          </div>

          <div className="bg-card border border-divider p-5">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Task Completion</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{taskCompletion}%</span>
              <span className="text-xs text-primary flex items-center gap-0.5"><TrendingUp size={10} />{doneCount}/{totalWork}</span>
            </div>
          </div>

          <div className="bg-card border border-divider p-5">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Monthly Billing</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-foreground">{paidInvoices}</span>
              <span className="text-xs text-muted-foreground">Paid</span>
              <span className="font-display text-xl font-bold text-foreground">{pendingInvoices}</span>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
          </div>

          <div className="bg-card border border-divider p-5">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Growth Infrastructure Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-foreground">
                {Math.min(100, Math.round(
                  (activeClients > 0 ? 25 : 0) +
                  (taskCompletion > 50 ? 25 : taskCompletion > 0 ? 12 : 0) +
                  (paidRevenue > 0 ? 25 : 0) +
                  (leadConversion > 20 ? 25 : leadConversion > 0 ? 12 : 0)
                ))}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Powered by THE BUSINESS SUPPORT STUDIO™</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
