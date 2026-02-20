import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ListChecks, Inbox, ArrowRight, Clock, DollarSign, Activity, AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const AdminOverview = () => {
  const { data: clients = [] } = useQuery({
    queryKey: ["overview-clients"],
    queryFn: async () => { const { data } = await supabase.from("clients").select("id, name, status"); return data || []; },
  });
  const { data: workItems = [] } = useQuery({
    queryKey: ["overview-work"],
    queryFn: async () => { const { data } = await supabase.from("work_items").select("id, title, client_id, status, deadline, clients(name)").order("created_at", { ascending: false }); return data || []; },
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["overview-requests"],
    queryFn: async () => { const { data } = await supabase.from("requests").select("id, title, client_id, priority, status, created_at, clients(name)").order("created_at", { ascending: false }).limit(5); return data || []; },
  });
  const { data: invoices = [] } = useQuery({
    queryKey: ["overview-invoices"],
    queryFn: async () => { const { data } = await supabase.from("invoices").select("id, client_id, amount, status, clients(name)"); return data || []; },
  });
  const { data: updates = [] } = useQuery({
    queryKey: ["overview-updates"],
    queryFn: async () => { const { data } = await supabase.from("updates").select("id, content, created_at, clients(name)").order("created_at", { ascending: false }).limit(5); return data || []; },
  });

  const activeClients = clients.filter((c: any) => c.status === "active").length;
  const openRequests = requests.filter((r: any) => r.status === "new").length;
  const highPriority = requests.filter((r: any) => r.priority === "high" && r.status !== "resolved").length;
  const totalWorkItems = workItems.length;
  const overdueItems = workItems.filter((w: any) => w.deadline && new Date(w.deadline) < new Date() && w.status !== "done").length;
  const monthlyRevenue = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const inProgressWork = workItems.filter((w: any) => w.status === "in_progress").length;
  const capacity = totalWorkItems > 0 ? Math.round(((totalWorkItems - inProgressWork) / totalWorkItems) * 100) : 100;

  const kpiTiles = [
    { label: "Active Clients", value: String(activeClients), icon: Users, href: "/admin/clients", delta: `${clients.length} total` },
    { label: "Revenue (Paid)", value: `R ${monthlyRevenue.toLocaleString()}`, icon: DollarSign, href: "/admin/revenue", delta: `${invoices.length} invoices` },
    { label: "Task Pipeline", value: String(totalWorkItems), icon: ListChecks, href: "/admin/work", delta: `${inProgressWork} in progress` },
    { label: "Open Requests", value: String(openRequests), icon: Inbox, href: "/admin/requests", delta: highPriority > 0 ? `${highPriority} high priority` : "All clear" },
    { label: "Team Capacity", value: `${capacity}%`, icon: Activity, href: "/admin/reports", delta: capacity > 60 ? "Healthy" : "Under load" },
    { label: "Overdue Items", value: String(overdueItems), icon: AlertTriangle, href: "/admin/work", delta: overdueItems > 0 ? "Resolve today" : "All on track" },
  ];

  const workInProgress = workItems.filter((w: any) => w.status !== "done").slice(0, 4);
  const progressValue = (s: string) => ({ to_do: 10, in_progress: 50, in_review: 80, done: 100 }[s] || 0);

  const clientRevenue = clients.map((c: any) => {
    const total = invoices.filter((i: any) => i.client_id === c.id && i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
    return { client: c.name, amount: `R ${total.toLocaleString()}`, share: total };
  }).filter((c) => c.share > 0).sort((a, b) => b.share - a.share);
  const maxShare = Math.max(...clientRevenue.map((c) => c.share), 1);

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl text-foreground">Studio Control</h2>
        <p className="mt-1 text-sm text-muted-foreground">Oversee operations across every partner workspace.</p>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiTiles.map((tile, i) => (
            <motion.div key={tile.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.08 + i * 0.04 }}>
              <Link to={tile.href} className="block bg-card border border-divider rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <tile.icon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-serif text-3xl text-foreground">{tile.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{tile.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1"><TrendingUp size={10} strokeWidth={1.5} />{tile.delta}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Work Pipeline</p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {workInProgress.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No active work items</div>
            ) : workInProgress.map((w: any) => (
              <div key={w.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{w.title}</p>
                  <p className="text-xs text-muted-foreground">{(w as any).clients?.name || "—"}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Progress value={progressValue(w.status)} className="w-20 h-1.5" />
                  {w.deadline && <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1"><Clock size={12} strokeWidth={1.5} />{new Date(w.deadline).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Recent Requests</p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {requests.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No requests yet</div>
            ) : requests.slice(0, 4).map((r: any) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{(r as any).clients?.name || "—"} · {r.priority}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clientRevenue.length > 0 && (
          <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.25 }}>
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Revenue by Client</p>
            <div className="bg-card border border-divider rounded-xl p-5 space-y-4">
              {clientRevenue.map((c) => (
                <div key={c.client} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-32 shrink-0 truncate">{c.client}</span>
                  <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                    <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${(c.share / maxShare) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right shrink-0">{c.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.3 }}>
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Activity Feed</p>
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {updates.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No recent activity</div>
            ) : updates.map((a: any) => (
              <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Zap size={14} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <p className="text-sm text-foreground truncate">{a.content}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{(a as any).clients?.name || ""}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
