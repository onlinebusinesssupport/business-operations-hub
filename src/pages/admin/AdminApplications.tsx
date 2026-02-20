import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Eye, ArrowLeft, Mail } from "lucide-react";

type AppStatus = "pending" | "approved" | "declined";

const statusColors: Record<AppStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  approved: "bg-primary/10 text-primary",
  declined: "bg-destructive/10 text-destructive",
};

const AdminApplications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppStatus | "all">("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: `Application ${vars.status}` });
      setSelectedId(null);
    },
  });

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);
  const selected = applications.find((a) => a.id === selectedId);

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back to Applications
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              {selected.full_name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{selected.business_name} · {selected.country}</p>
          </div>
          <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 ${statusColors[selected.status as AppStatus] || statusColors.pending}`}>
            {selected.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Identity</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{selected.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="text-foreground">{selected.country}</span></div>
              {selected.website && <div className="flex justify-between"><span className="text-muted-foreground">Website</span><a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selected.website}</a></div>}
            </div>
          </div>

          <div className="border border-border p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Business Snapshot</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span className="text-foreground">{selected.industry || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Team Size</span><span className="text-foreground">{selected.team_size || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-foreground">{selected.revenue_range || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Growth Channel</span><span className="text-foreground">{selected.primary_channel || "—"}</span></div>
            </div>
          </div>
        </div>

        <div className="border border-border p-5 space-y-3">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Infrastructure Readiness</p>
          <p className="text-sm text-foreground leading-relaxed">{selected.pain_points || "No response"}</p>
          {selected.areas_of_support && selected.areas_of_support.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selected.areas_of_support.map((area: string) => (
                <span key={area} className="px-2 py-1 text-[11px] bg-primary/10 text-primary">{area}</span>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border p-5 space-y-3">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Intent Signal</p>
          <p className="text-sm text-foreground leading-relaxed">{selected.intent || "No response"}</p>
        </div>

        {selected.status === "pending" && (
          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={() => updateStatus.mutate({ id: selected.id, status: "approved" })}
              className="text-sm tracking-wide gap-2"
              disabled={updateStatus.isPending}
            >
              <CheckCircle2 size={14} /> Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => updateStatus.mutate({ id: selected.id, status: "declined" })}
              className="text-sm tracking-wide gap-2"
              disabled={updateStatus.isPending}
            >
              <XCircle size={14} /> Decline
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Applications</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review and manage access requests.</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-accent/50 p-0.5 w-fit">
        {(["all", "pending", "approved", "declined"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[11px] px-3 py-1.5 transition-all duration-150 capitalize ${
              filter === f ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f} {f !== "all" && `(${applications.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading applications...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No applications found.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedId(app.id)}
              className="w-full p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{app.full_name}</p>
                <p className="text-xs text-muted-foreground">{app.business_name} · {app.country || "—"}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {app.areas_of_support && app.areas_of_support.length > 0 && (
                  <span className="text-[10px] text-muted-foreground hidden md:block">
                    {app.areas_of_support.length} studio{app.areas_of_support.length > 1 ? "s" : ""}
                  </span>
                )}
                <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${statusColors[app.status as AppStatus] || statusColors.pending}`}>
                  {app.status}
                </span>
                <Eye size={14} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
