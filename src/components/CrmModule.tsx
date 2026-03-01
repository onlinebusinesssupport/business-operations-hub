import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Star, TrendingUp, DollarSign, Activity, Clock, AlertTriangle, Send,
  Loader2, Heart, Mail, Phone, Globe, Linkedin, Building2, User
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const healthColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-destructive";
};

const healthBg = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-destructive";
};

const LIFECYCLE_STAGES = ["lead", "onboarding", "active", "at_risk", "churned"];
const LEAD_TAG_OPTIONS = ["High Potential", "Warm", "Low ROI", "High Maintenance", "Strategic", "Quick Win"];

interface CrmModuleProps {
  client: any;
  onUpdateField: (client: any, field: string, value: any) => Promise<void>;
}

const CrmModule = ({ client, onUpdateField }: CrmModuleProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reviews for this client
  const { data: reviews = [] } = useQuery({
    queryKey: ["crm-reviews", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("client_id", client.id).order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Invoices for LTV
  const { data: invoices = [] } = useQuery({
    queryKey: ["crm-invoices", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("*").eq("client_id", client.id).order("invoice_date", { ascending: false });
      return data || [];
    },
  });

  // Activity timeline
  const { data: activities = [] } = useQuery({
    queryKey: ["crm-activity", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("activity_log").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
  });

  // Work items for velocity
  const { data: workItems = [] } = useQuery({
    queryKey: ["crm-work", client.id],
    queryFn: async () => {
      const { data } = await supabase.from("work_items").select("*").eq("client_id", client.id);
      return data || [];
    },
  });

  // Request review
  const requestReviewMut = useMutation({
    mutationFn: async (engagementType: string) => {
      // Create review record with token
      const { data: review, error } = await supabase.from("reviews").insert({
        client_id: client.id,
        engagement_type: engagementType,
        status: "sent",
      }).select("id, token").single();
      if (error) throw error;

      // Create tracking record
      await supabase.from("review_requests").insert({
        review_id: review.id,
        client_id: client.id,
        sent_at: new Date().toISOString(),
        status: "sent",
      });

      await logActivity({
        client_id: client.id,
        action: "review_requested",
        entity_type: "review",
        entity_id: review.id,
        details: { summary: `Review request sent (${engagementType})` },
      });

      return review;
    },
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["crm-reviews", client.id] });
      const reviewUrl = `${window.location.origin}/review?token=${review.token}`;
      navigator.clipboard.writeText(reviewUrl);
      toast({ title: "Review link created & copied", description: "Share this link with the client." });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const toggleTag = async (tag: string) => {
    const current = client.lead_tags || [];
    const updated = current.includes(tag) ? current.filter((t: string) => t !== tag) : [...current, tag];
    await onUpdateField(client, "lead_tags", updated);
  };

  // Computed
  const completedReviews = reviews.filter((r: any) => r.status === "completed");
  const avgScore = completedReviews.length > 0
    ? (completedReviews.reduce((s: number, r: any) => s + (r.score_overall || 0), 0) / completedReviews.length).toFixed(1)
    : "—";
  const lastReview = completedReviews[0];

  const paidTotal = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const outstandingTotal = invoices.filter((i: any) => i.status !== "paid" && i.status !== "draft").reduce((s: number, i: any) => s + Number(i.amount || 0), 0);
  const mrr = Number(client.monthly_rate || 0);
  const fmt = (n: number) => `R${n.toLocaleString("en-ZA")}`;

  const doneWork = workItems.filter((w: any) => w.status === "done").length;
  const totalWork = workItems.length;

  const profile = client.profiles;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}hr ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Health + Score Row */}
      <motion.div {...fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Health Score</p>
          <div className="flex items-baseline gap-1">
            <span className={`font-display text-2xl font-bold ${healthColor(client.health_score || 100)}`}>
              {client.health_score ?? 100}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden mt-2">
            <motion.div className={`h-full rounded-full ${healthBg(client.health_score || 100)}`}
              initial={{ width: 0 }} animate={{ width: `${Math.min(client.health_score || 100, 100)}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Avg Review</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{avgScore}</span>
            {avgScore !== "—" && <span className="text-xs text-muted-foreground">/5</span>}
          </div>
          <p className="text-[10px] text-muted-foreground">{completedReviews.length} reviews</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Lifetime Revenue</p>
          <span className="font-display text-2xl font-bold text-foreground">{fmt(paidTotal)}</span>
          {outstandingTotal > 0 && <p className="text-[10px] text-muted-foreground">{fmt(outstandingTotal)} outstanding</p>}
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">MRR</p>
          <span className="font-display text-2xl font-bold text-foreground">{fmt(mrr)}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Intelligence */}
        <motion.div {...fade} transition={{ delay: 0.05 }} className="border border-border p-5 space-y-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Contact Record</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><User size={14} className="text-muted-foreground" /><span className="text-foreground">{profile?.full_name || "—"}</span></div>
            <div className="flex items-center gap-3"><Mail size={14} className="text-muted-foreground" /><span className="text-foreground">{profile?.email || "—"}</span></div>
            <div className="flex items-center gap-3"><Phone size={14} className="text-muted-foreground" /><span className="text-foreground">{profile?.phone || "—"}</span></div>
            <div className="flex items-center gap-3"><Building2 size={14} className="text-muted-foreground" /><span className="text-foreground">{profile?.company_name || "—"}</span></div>
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-muted-foreground" />
              <InlineEdit value={client.website || ""} onSave={(v) => onUpdateField(client, "website", v)} className="text-sm text-foreground" placeholder="Add website..." />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin size={14} className="text-muted-foreground" />
              <InlineEdit value={client.linkedin_url || ""} onSave={(v) => onUpdateField(client, "linkedin_url", v)} className="text-sm text-foreground" placeholder="Add LinkedIn..." />
            </div>
          </div>
        </motion.div>

        {/* Relationship Intelligence */}
        <motion.div {...fade} transition={{ delay: 0.1 }} className="border border-border p-5 space-y-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Relationship Intelligence</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lifecycle Stage</span>
              <select value={client.lifecycle_stage || "onboarding"} onChange={(e) => onUpdateField(client, "lifecycle_stage", e.target.value)}
                className="text-xs px-2 py-1 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring capitalize">
                {LIFECYCLE_STAGES.map((s) => <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lead Source</span>
              <InlineEdit value={client.lead_source || ""} onSave={(v) => onUpdateField(client, "lead_source", v)} className="text-sm text-foreground text-right" placeholder="—" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Account Owner</span>
              <InlineEdit value={client.account_owner || ""} onSave={(v) => onUpdateField(client, "account_owner", v)} className="text-sm text-foreground text-right" placeholder="—" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Renewal Date</span>
              <input type="date" value={client.contract_renewal_date || ""} onChange={(e) => onUpdateField(client, "contract_renewal_date", e.target.value || null)}
                className="text-xs px-2 py-1 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lead Score</span>
              <span className="font-medium text-foreground">{client.lead_score || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Work Velocity</span>
              <span className="text-foreground">{doneWork}/{totalWork} done</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tags */}
      <motion.div {...fade} transition={{ delay: 0.15 }} className="border border-border p-5 space-y-3">
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Lead Tags</p>
        <div className="flex flex-wrap gap-2">
          {LEAD_TAG_OPTIONS.map((tag) => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1.5 border transition-colors ${(client.lead_tags || []).includes(tag) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Request Review */}
      <motion.div {...fade} transition={{ delay: 0.2 }} className="border border-border p-5 space-y-3">
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Request Review</p>
        <div className="flex flex-wrap gap-2">
          {["retainer", "side_client", "one_off"].map((type) => (
            <Button key={type} variant="outline" size="sm" className="gap-2 text-xs capitalize"
              onClick={() => requestReviewMut.mutate(type)} disabled={requestReviewMut.isPending}>
              {requestReviewMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              {type.replace("_", " ")}
            </Button>
          ))}
        </div>
        {completedReviews.length > 0 && (
          <div className="pt-3 border-t border-divider">
            <p className="text-xs text-muted-foreground mb-2">Last review: {lastReview?.submitted_at ? timeAgo(lastReview.submitted_at) : "—"} · {lastReview?.score_overall || "—"}/5</p>
          </div>
        )}
      </motion.div>

      {/* Timeline */}
      <motion.div {...fade} transition={{ delay: 0.25 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3">Contact Timeline</p>
        <div className="border border-border divide-y divide-border">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No activity recorded.</div>
          ) : activities.map((a: any) => (
            <div key={a.id} className="p-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground">{(a.details as any)?.summary || a.action}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(a.created_at)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CrmModule;
