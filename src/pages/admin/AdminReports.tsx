import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const AdminReports = () => {
  const { toast } = useToast();

  const { data: clients = [] } = useQuery({
    queryKey: ["report-clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name, status").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: workItems = [] } = useQuery({
    queryKey: ["report-work-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("work_items").select("id, client_id, status, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["report-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("requests").select("id, client_id, status, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["report-documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("id, client_id, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Summary metrics
  const completedWork = workItems.filter((w: any) => w.status === "complete").length;
  const resolvedRequests = requests.filter((r: any) => r.status === "resolved").length;
  const totalDocs = documents.length;
  const onTimeRate = workItems.length > 0 ? Math.round((completedWork / Math.max(workItems.length, 1)) * 100) : 0;

  // Client activity
  const clientActivity = clients.map((c: any) => ({
    client: c.name,
    workItems: workItems.filter((w: any) => w.client_id === c.id).length,
    requests: requests.filter((r: any) => r.client_id === c.id).length,
    documents: documents.filter((d: any) => d.client_id === c.id).length,
  }));

  const maxWork = Math.max(...clientActivity.map((c) => c.workItems), 1);

  // Export CSV
  const exportCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h.toLowerCase().replace(/ /g, "")] || row[h] || ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filename}.csv downloaded` });
  };

  const exportActivityReport = () => {
    exportCSV(
      clientActivity.map((c) => ({ Client: c.client, WorkItems: c.workItems, Requests: c.requests, Documents: c.documents })),
      "client-activity-report",
      ["Client", "WorkItems", "Requests", "Documents"]
    );
  };

  const exportWorkloadReport = () => {
    exportCSV(
      clientActivity.filter((c) => c.workItems > 0).map((c) => ({ Client: c.client, WorkItems: c.workItems })),
      "workload-report",
      ["Client", "WorkItems"]
    );
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review activity, workload, and delivery consistency.</p>
        </div>
        <Button variant="outline" onClick={exportActivityReport} className="gap-2 text-xs">
          <Download size={14} /> Export Activity Report
        </Button>
      </motion.div>

      {/* Summary metrics */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Work Items Completed", value: String(completedWork) },
            { label: "Requests Resolved", value: String(resolvedRequests) },
            { label: "Documents Shared", value: String(totalDocs) },
            { label: "Completion Rate", value: `${onTimeRate}%` },
          ].map((m) => (
            <div key={m.label} className="bg-card border border-divider rounded-xl p-5">
              <p className="font-serif text-2xl text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Client activity table */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase flex items-center gap-2">
            <BarChart3 size={14} strokeWidth={1.5} /> Client Activity
          </p>
          <Button variant="ghost" size="sm" onClick={exportActivityReport} className="text-xs gap-1">
            <Download size={12} /> CSV
          </Button>
        </div>
        <div className="bg-card border border-divider rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Client</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Work Items</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Requests</th>
                <th className="text-left text-[10px] text-muted-foreground font-medium px-5 py-3 uppercase tracking-[0.1em]">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {clientActivity.map((row) => (
                <tr key={row.client} className="hover:bg-accent/40 transition-colors">
                  <td className="px-5 py-3 text-foreground font-medium">{row.client}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.workItems}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.requests}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.documents}</td>
                </tr>
              ))}
              {clientActivity.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Workload */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Workload Distribution</p>
          <Button variant="ghost" size="sm" onClick={exportWorkloadReport} className="text-xs gap-1">
            <Download size={12} /> CSV
          </Button>
        </div>
        <div className="bg-card border border-divider rounded-xl p-5 space-y-4">
          {clientActivity.filter((c) => c.workItems > 0).map((c) => (
            <div key={c.client} className="flex items-center gap-4">
              <span className="text-sm text-foreground w-36 shrink-0">{c.client}</span>
              <Progress value={(c.workItems / maxWork) * 100} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground w-6 text-right">{c.workItems}</span>
            </div>
          ))}
          {clientActivity.filter((c) => c.workItems > 0).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No work items yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;
