import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, TrendingUp, Eye, EyeOff, AlertTriangle, Send,
  MessageSquare, Share2, Twitter, Linkedin, Link2, Check,
  Loader2, ChevronDown, ChevronUp, X, Clock, Bell, AlertCircle,
  UserPlus, Calendar, Mail
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const SERVICE_OPTIONS = [
  "Social Media Management", "Lead Generation", "Business Automation",
  "Executive Virtual Support", "Travel & Experiences", "Grants & Awards",
];

interface Props {
  clientId?: string;
}

const ReputationDashboard = ({ clientId }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [shareMenuId, setShareMenuId] = useState<string | null>(null);

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews", clientId],
    queryFn: async () => {
      let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (clientId) q = q.eq("client_id", clientId);
      const { data } = await q;
      return data || [];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients-rep"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name, avg_review_score, review_count, nps_score, health_score");
      return data || [];
    },
  });

  // Send review request form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    clientId: "",
    engagementType: "retainer",
    services: [] as string[],
    serviceDate: "",
  });

  const toggleService = (svc: string) => {
    setRequestForm((f) => ({
      ...f,
      services: f.services.includes(svc) ? f.services.filter((s) => s !== svc) : [...f.services, svc],
    }));
  };

  const sendRequestMut = useMutation({
    mutationFn: async () => {
      const cid = clientId || requestForm.clientId;
      if (!cid) throw new Error("Select a client");
      if (!requestForm.firstName || !requestForm.email) throw new Error("Name and email are required");
      const { data: review, error } = await supabase.from("reviews").insert({
        client_id: cid,
        engagement_type: requestForm.engagementType,
        services_reviewed: requestForm.services,
        reviewer_name: `${requestForm.firstName} ${requestForm.lastName}`.trim(),
        status: "sent",
      }).select("id, token").single();
      if (error) throw error;
      await supabase.from("review_requests").insert({
        review_id: review.id, client_id: cid,
        sent_at: new Date().toISOString(), status: "sent",
      });
      await logActivity({
        client_id: cid, action: "review_requested", entity_type: "review",
        entity_id: review.id, details: {
          summary: `Review request sent to ${requestForm.firstName} ${requestForm.lastName} (${requestForm.email})`,
          services: requestForm.services,
        },
      });
      return review;
    },
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      const url = `${window.location.origin}/review?token=${review.token}`;
      navigator.clipboard.writeText(url);
      toast({ title: "Review link created & copied to clipboard", description: `Send this link to ${requestForm.firstName}` });
      setShowRequestForm(false);
      setRequestForm({ firstName: "", lastName: "", email: "", clientId: "", engagementType: "retainer", services: [], serviceDate: "" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Reply to review
  const replyMut = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: string; reply: string }) => {
      const { error } = await supabase.from("reviews").update({
        admin_reply: reply,
        admin_reply_at: new Date().toISOString(),
      }).eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setReplyText("");
      toast({ title: "Reply saved — loop closed ✓" });
    },
  });

  // Share helpers
  const getShareUrl = (r: any) => `${window.location.origin}/reviews`;
  const getShareText = (r: any) => {
    const quote = r.one_sentence || r.biggest_transformation || "";
    const name = r.reviewer_name || "A verified client";
    return `"${quote}" — ${name} | SUPPORT STUDIO™`;
  };

  const shareToTwitter = (r: any) => {
    const text = encodeURIComponent(getShareText(r));
    const url = encodeURIComponent(getShareUrl(r));
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToLinkedIn = (r: any) => {
    const url = encodeURIComponent(getShareUrl(r));
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const copyShareLink = (r: any) => {
    const text = getShareText(r);
    navigator.clipboard.writeText(`${text}\n${getShareUrl(r)}`);
    toast({ title: "Review copied to clipboard" });
  };

  // Computed KPIs
  const completed = reviews.filter((r: any) => r.status === "completed");
  const pending = reviews.filter((r: any) => r.status !== "completed");
  const avgScore = completed.length > 0
    ? (completed.reduce((s: number, r: any) => s + (r.score_overall || 0), 0) / completed.length).toFixed(1)
    : "—";
  const npsScores = completed.filter((r: any) => r.nps_score != null);
  const promoters = npsScores.filter((r: any) => r.nps_score >= 9).length;
  const detractors = npsScores.filter((r: any) => r.nps_score <= 6).length;
  const nps = npsScores.length > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;
  const publicCount = completed.filter((r: any) => r.visibility !== "private").length;
  const privateCount = completed.filter((r: any) => r.visibility === "private").length;
  const completionRate = reviews.length > 0 ? Math.round((completed.length / reviews.length) * 100) : 0;

  // 3-day reply SLA tracking
  const now = Date.now();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const unreplied = completed.filter((r: any) => !r.admin_reply);
  const overdue = unreplied.filter((r: any) => {
    const submitted = r.submitted_at ? new Date(r.submitted_at).getTime() : 0;
    return (now - submitted) > THREE_DAYS_MS;
  });
  const dueSoon = unreplied.filter((r: any) => {
    const submitted = r.submitted_at ? new Date(r.submitted_at).getTime() : 0;
    const elapsed = now - submitted;
    return elapsed > (2 * 24 * 60 * 60 * 1000) && elapsed <= THREE_DAYS_MS;
  });
  const repliedCount = completed.filter((r: any) => r.admin_reply).length;
  const replySlaScore = completed.length > 0 ? Math.round((repliedCount / completed.length) * 100) : 100;

  // Average reply time in hours
  const avgReplyTime = useMemo(() => {
    const replied = completed.filter((r: any) => r.admin_reply && r.admin_reply_at && r.submitted_at);
    if (replied.length === 0) return null;
    const total = replied.reduce((sum: number, r: any) => {
      return sum + (new Date(r.admin_reply_at).getTime() - new Date(r.submitted_at).getTime());
    }, 0);
    return Math.round(total / replied.length / (1000 * 60 * 60));
  }, [completed]);

  const studioScores: Record<string, { total: number; count: number }> = {};
  completed.forEach((r: any) => {
    (r.services_reviewed || []).forEach((svc: string) => {
      if (!studioScores[svc]) studioScores[svc] = { total: 0, count: 0 };
      studioScores[svc].total += r.score_overall || 0;
      studioScores[svc].count++;
    });
  });

  const atRisk = clients.filter((c: any) => c.review_count > 0 && c.avg_review_score < 3);

  const valueDist = { exceptional: 0, good: 0, fair: 0, not_worth: 0 };
  completed.forEach((r: any) => { if (r.value_rating && valueDist.hasOwnProperty(r.value_rating)) (valueDist as any)[r.value_rating]++; });

  const clientName = (cid: string) => clients.find((c: any) => c.id === cid)?.name || "Unknown";

  const getReplyUrgency = (r: any) => {
    if (r.admin_reply) return null;
    const submitted = r.submitted_at ? new Date(r.submitted_at).getTime() : 0;
    const elapsed = now - submitted;
    if (elapsed > THREE_DAYS_MS) return "overdue";
    if (elapsed > 2 * 24 * 60 * 60 * 1000) return "due-soon";
    return "on-track";
  };

  return (
    <div className="space-y-6">
      <motion.div {...fade} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Reputation Engine</h2>
          <p className="mt-1 text-sm text-muted-foreground">Performance intelligence from verified client feedback.</p>
        </div>
        <Button onClick={() => setShowRequestForm(!showRequestForm)} size="sm" className="gap-2 text-xs">
          <Send size={13} /> Send Review Request
        </Button>
      </motion.div>

      {/* SLA Alerts */}
      {(overdue.length > 0 || dueSoon.length > 0) && (
        <motion.div {...fade} className="space-y-2">
          {overdue.length > 0 && (
            <div className="border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {overdue.length} review{overdue.length > 1 ? "s" : ""} overdue — reply within 3 days is mandatory
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {overdue.map((r: any) => r.reviewer_name || "Anonymous").join(", ")}
                </p>
              </div>
            </div>
          )}
          {dueSoon.length > 0 && (
            <div className="border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
              <Bell size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-600">
                  {dueSoon.length} review{dueSoon.length > 1 ? "s" : ""} due for reply soon — deadline approaching
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dueSoon.map((r: any) => r.reviewer_name || "Anonymous").join(", ")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Send Review Request Form */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="border border-border bg-card p-5 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={14} className="text-primary" />
                <p className="text-xs font-medium text-foreground">New Review Request</p>
              </div>
              <button onClick={() => setShowRequestForm(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={requestForm.firstName} onChange={(e) => setRequestForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="First name *" className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
              <input value={requestForm.lastName} onChange={(e) => setRequestForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Last name" className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-muted-foreground shrink-0" />
                <input value={requestForm.email} onChange={(e) => setRequestForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Email address *" type="email" className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-muted-foreground shrink-0" />
                <input value={requestForm.serviceDate} onChange={(e) => setRequestForm((f) => ({ ...f, serviceDate: e.target.value }))}
                  type="date" className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            {!clientId && (
              <select value={requestForm.clientId} onChange={(e) => setRequestForm((f) => ({ ...f, clientId: e.target.value }))}
                className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client *</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Services to review</p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((svc) => (
                  <button key={svc} type="button" onClick={() => toggleService(svc)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${requestForm.services.includes(svc) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {svc}
                  </button>
                ))}
              </div>
            </div>
            <select value={requestForm.engagementType} onChange={(e) => setRequestForm((f) => ({ ...f, engagementType: e.target.value }))}
              className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="retainer">Full Partner (Retainer)</option>
              <option value="side_client">Side Client</option>
              <option value="one_off">One-off Engagement</option>
            </select>
            <Button onClick={() => sendRequestMut.mutate()} disabled={sendRequestMut.isPending || (!clientId && !requestForm.clientId) || !requestForm.firstName || !requestForm.email} size="sm" className="gap-2 text-xs">
              {sendRequestMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Generate & Copy Review Link
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Row */}
      <motion.div {...fade} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Avg Rating</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{avgScore}</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">NPS Score</p>
          <span className={`font-display text-2xl font-bold ${nps >= 50 ? "text-emerald-600" : nps >= 0 ? "text-foreground" : "text-destructive"}`}>{nps}</span>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reviews</p>
          <span className="font-display text-2xl font-bold text-foreground">{completed.length}</span>
          <p className="text-[10px] text-muted-foreground">{pending.length} pending</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Completion</p>
          <span className="font-display text-2xl font-bold text-foreground">{completionRate}%</span>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Reply SLA</p>
          <span className={`font-display text-2xl font-bold ${replySlaScore >= 90 ? "text-emerald-600" : replySlaScore >= 70 ? "text-amber-500" : "text-destructive"}`}>
            {replySlaScore}%
          </span>
          <p className="text-[10px] text-muted-foreground">{overdue.length} overdue</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Avg Reply Time</p>
          <span className="font-display text-2xl font-bold text-foreground">{avgReplyTime !== null ? `${avgReplyTime}h` : "—"}</span>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Public / Private</p>
          <div className="flex items-center gap-2">
            <Eye size={12} className="text-primary" /><span className="text-sm font-medium">{publicCount}</span>
            <EyeOff size={12} className="text-muted-foreground" /><span className="text-sm font-medium">{privateCount}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Studio Breakdown */}
        <motion.div {...fade} transition={{ delay: 0.1 }} className="border border-border p-5 space-y-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Studio Scores</p>
          {Object.keys(studioScores).length === 0 ? (
            <p className="text-sm text-muted-foreground">No studio data yet.</p>
          ) : Object.entries(studioScores).sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count)).map(([svc, d]) => {
            const avg = (d.total / d.count).toFixed(1);
            return (
              <div key={svc} className="flex items-center gap-3">
                <span className="text-xs text-foreground flex-1">{svc}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} className={s <= Math.round(d.total / d.count) ? "text-primary fill-primary" : "text-border"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground w-8 text-right">{avg}</span>
                <span className="text-[10px] text-muted-foreground">({d.count})</span>
              </div>
            );
          })}
        </motion.div>

        {/* Value Perception */}
        <motion.div {...fade} transition={{ delay: 0.15 }} className="border border-border p-5 space-y-4">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Value Perception</p>
          {[
            { key: "exceptional", label: "Exceptional", color: "bg-emerald-500" },
            { key: "good", label: "Good", color: "bg-primary" },
            { key: "fair", label: "Fair", color: "bg-amber-500" },
            { key: "not_worth", label: "Not worth it", color: "bg-destructive" },
          ].map((v) => {
            const count = (valueDist as any)[v.key] || 0;
            const pct = completed.length > 0 ? Math.round((count / completed.length) * 100) : 0;
            return (
              <div key={v.key} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${v.color}`} />
                <span className="text-xs text-muted-foreground w-24">{v.label}</span>
                <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${v.color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-xs font-medium text-foreground w-8 text-right">{count}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* At Risk */}
      {atRisk.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.2 }} className="border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <p className="text-xs font-medium text-foreground">Low-Scoring Accounts</p>
          </div>
          {atRisk.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between text-sm pl-6">
              <span className="text-foreground">{c.name}</span>
              <span className="text-destructive font-medium">{Number(c.avg_review_score).toFixed(1)}/5</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Reviews List with Expand/Reply/Share */}
      <motion.div {...fade} transition={{ delay: 0.25 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3">All Reviews</p>
        <div className="border border-border divide-y divide-border">
          {reviews.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No reviews yet.</div>
          ) : reviews.map((r: any) => {
            const isExpanded = expandedReview === r.id;
            const isCompleted = r.status === "completed";
            const urgency = getReplyUrgency(r);
            return (
              <div key={r.id} className={`transition-colors hover:bg-secondary/30 ${urgency === "overdue" ? "border-l-2 border-l-destructive" : urgency === "due-soon" ? "border-l-2 border-l-amber-500" : ""}`}>
                {/* Summary row */}
                <button onClick={() => setExpandedReview(isExpanded ? null : r.id)}
                  className="w-full p-4 flex items-center gap-4 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className={s <= (r.score_overall || 0) ? "text-primary fill-primary" : "text-border"} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-medium text-amber-500">{r.status}</span>
                      )}
                      {r.visibility !== "private" ? <Eye size={10} className="text-primary" /> : <EyeOff size={10} className="text-muted-foreground" />}
                      {r.admin_reply ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600"><Check size={10} /> Replied</span>
                      ) : isCompleted && urgency === "overdue" ? (
                        <span className="flex items-center gap-1 text-[10px] text-destructive font-medium"><AlertCircle size={10} /> OVERDUE</span>
                      ) : isCompleted && urgency === "due-soon" ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500"><Clock size={10} /> Due soon</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-foreground truncate">{r.one_sentence || r.biggest_transformation || "No narrative"}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {r.reviewer_name || "Anonymous"} · {clientName(r.client_id)} · {(r.services_reviewed || []).join(", ") || "—"}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : r.status}
                  </span>
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border">
                      <div className="p-5 space-y-4 bg-secondary/20">
                        {/* Score breakdown */}
                        {isCompleted && (
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { label: "Strategy", val: r.score_strategic_clarity },
                              { label: "Comms", val: r.score_communication },
                              { label: "Speed", val: r.score_speed },
                              { label: "Value", val: r.score_commercial_value },
                              { label: "Impact", val: r.score_overall_impact },
                            ].map((s) => (
                              <div key={s.label} className="text-center border border-border p-2 bg-card">
                                <span className="text-sm font-bold text-foreground">{s.val || "—"}</span>
                                <p className="text-[8px] text-muted-foreground">{s.label}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Narrative fields */}
                        {r.biggest_transformation && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Biggest Transformation</p>
                            <p className="text-sm text-foreground">{r.biggest_transformation}</p>
                          </div>
                        )}
                        {r.almost_stopped && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">What Almost Stopped Them</p>
                            <p className="text-sm text-foreground">{r.almost_stopped}</p>
                          </div>
                        )}
                        {r.improvement_suggestion && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Improvement Suggestion</p>
                            <p className="text-sm text-foreground">{r.improvement_suggestion}</p>
                          </div>
                        )}
                        {r.nps_score != null && (
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">NPS</p>
                            <span className="text-sm font-bold text-foreground">{r.nps_score}/10</span>
                            {r.nps_recommendation && <p className="text-xs text-muted-foreground italic">"{r.nps_recommendation}"</p>}
                          </div>
                        )}
                        {r.value_rating && (
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Value</p>
                            <span className="text-xs font-medium text-foreground capitalize">{r.value_rating.replace("_", " ")}</span>
                            {r.value_reason && <p className="text-xs text-muted-foreground">— {r.value_reason}</p>}
                          </div>
                        )}

                        {/* Admin Reply */}
                        <div className="border-t border-border pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Close the Loop — Reply</p>
                            {isCompleted && !r.admin_reply && (
                              <span className={`text-[10px] font-medium ${urgency === "overdue" ? "text-destructive" : urgency === "due-soon" ? "text-amber-500" : "text-muted-foreground"}`}>
                                {urgency === "overdue" ? "⚠ Past 3-day deadline" : urgency === "due-soon" ? "⏰ Reply deadline approaching" : "Reply within 3 days"}
                              </span>
                            )}
                          </div>
                          {r.admin_reply ? (
                            <div className="bg-card border border-border p-3 space-y-1">
                              <p className="text-sm text-foreground">{r.admin_reply}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Replied {r.admin_reply_at ? new Date(r.admin_reply_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : ""}
                              </p>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Thank the client, address concerns, or follow up..."
                                rows={2} className="flex-1 px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                              <Button size="sm" className="gap-2 text-xs self-end"
                                onClick={() => { replyMut.mutate({ reviewId: r.id, reply: replyText }); }}
                                disabled={replyMut.isPending || !replyText.trim()}>
                                {replyMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Reply
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Share to Socials */}
                        {isCompleted && r.visibility !== "private" && (
                          <div className="border-t border-border pt-4">
                            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-2">Share on Socials</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => shareToTwitter(r)}>
                                <Twitter size={13} /> X / Twitter
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => shareToLinkedIn(r)}>
                                <Linkedin size={13} /> LinkedIn
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => copyShareLink(r)}>
                                <Link2 size={13} /> Copy
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ReputationDashboard;
