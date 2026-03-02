import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, TrendingUp, Eye, EyeOff, AlertTriangle, Send,
  MessageSquare, Share2, Twitter, Linkedin, Link2, Check,
  Loader2, ChevronDown, ChevronUp, X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

interface Props {
  clientId?: string; // optional: scope to one client
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

  // Send review request (for global dashboard, pick a client)
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestClientId, setRequestClientId] = useState("");
  const [requestType, setRequestType] = useState("retainer");

  const sendRequestMut = useMutation({
    mutationFn: async () => {
      const cid = clientId || requestClientId;
      if (!cid) throw new Error("Select a client");
      const { data: review, error } = await supabase.from("reviews").insert({
        client_id: cid,
        engagement_type: requestType,
        status: "sent",
      }).select("id, token").single();
      if (error) throw error;
      await supabase.from("review_requests").insert({
        review_id: review.id, client_id: cid,
        sent_at: new Date().toISOString(), status: "sent",
      });
      await logActivity({
        client_id: cid, action: "review_requested", entity_type: "review",
        entity_id: review.id, details: { summary: `Review request sent (${requestType})` },
      });
      return review;
    },
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      const url = `${window.location.origin}/review?token=${review.token}`;
      navigator.clipboard.writeText(url);
      toast({ title: "Review link created & copied to clipboard" });
      setShowRequestForm(false);
      setRequestClientId("");
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
      toast({ title: "Reply saved" });
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
    setShareMenuId(null);
  };

  const shareToLinkedIn = (r: any) => {
    const url = encodeURIComponent(getShareUrl(r));
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    setShareMenuId(null);
  };

  const copyShareLink = (r: any) => {
    const text = getShareText(r);
    navigator.clipboard.writeText(`${text}\n${getShareUrl(r)}`);
    toast({ title: "Review copied to clipboard" });
    setShareMenuId(null);
  };

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

      {/* Send Review Request Form */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="border border-border bg-card p-5 space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">New Review Request</p>
              <button onClick={() => setShowRequestForm(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
            </div>
            {!clientId && (
              <select value={requestClientId} onChange={(e) => setRequestClientId(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select client...</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <select value={requestType} onChange={(e) => setRequestType(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="retainer">Full Partner (Retainer)</option>
              <option value="side_client">Side Client</option>
              <option value="one_off">One-off Engagement</option>
            </select>
            <Button onClick={() => sendRequestMut.mutate()} disabled={sendRequestMut.isPending || (!clientId && !requestClientId)} size="sm" className="gap-2 text-xs">
              {sendRequestMut.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Generate & Copy Link
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Row */}
      <motion.div {...fade} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
            return (
              <div key={r.id} className="transition-colors hover:bg-secondary/30">
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
                      {r.admin_reply && <MessageSquare size={10} className="text-emerald-500" />}
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
                          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Admin Reply (Close the Loop)</p>
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
