import { motion } from "framer-motion";
import { BarChart3, FileText, Activity, Inbox, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const ClientReports = () => {
  const { data: workItems = [] } = useQuery({
    queryKey: ["portal-reports-work"],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("id, status, priority, created_at");
      return data || [];
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["portal-reports-requests"],
    queryFn: async () => {
      const { data } = await supabase.from("requests").select("id, status, created_at");
      return data || [];
    },
  });

  const { data: updates = [] } = useQuery({
    queryKey: ["portal-reports-updates"],
    queryFn: async () => {
      const { data } = await supabase.from("updates").select("id, created_at");
      return data || [];
    },
  });

  const totalWork = workItems.length;
  const completed = workItems.filter((w: any) => w.status === "done").length;
  const inProgress = workItems.filter((w: any) => w.status === "in_progress").length;
  const completionRate = totalWork > 0 ? Math.round((completed / totalWork) * 100) : 0;
  const resolvedRequests = requests.filter((r: any) => r.status === "resolved").length;
  const totalRequests = requests.length;
  const requestResolution = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;

  const metrics = [
    { label: "Total Work Items", value: totalWork, icon: FileText },
    { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp },
    { label: "Active Tasks", value: inProgress, icon: Activity },
    { label: "Updates Logged", value: updates.length, icon: BarChart3 },
  ];

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Reports
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Performance insights and operational metrics across your active studios.
        </p>
      </motion.div>

      {/* Metrics */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Overview
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
              className="border border-border p-5"
            >
              <m.icon size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Execution Summary */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Execution Summary
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Completion */}
          <div className="border border-border p-6">
            <p className="text-xs text-muted-foreground mb-3">Task Completion</p>
            <div className="flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{completionRate}%</span>
              <span className="text-xs text-muted-foreground mb-1">of tasks delivered</span>
            </div>
            <div className="mt-3 h-2 bg-border overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
              <span>{completed} completed</span>
              <span>{totalWork - completed} remaining</span>
            </div>
          </div>

          {/* Request Resolution */}
          <div className="border border-border p-6">
            <p className="text-xs text-muted-foreground mb-3">Request Resolution</p>
            <div className="flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{requestResolution}%</span>
              <span className="text-xs text-muted-foreground mb-1">of requests resolved</span>
            </div>
            <div className="mt-3 h-2 bg-border overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${requestResolution}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
              <span>{resolvedRequests} resolved</span>
              <span>{totalRequests - resolvedRequests} open</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Studio Insights Placeholder */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Studio Intelligence
        </p>
        <div className="border border-border p-8 text-center">
          <BarChart3 size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">Detailed studio reports will auto-generate as more data becomes available.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Monthly summaries will be available for download.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientReports;
