import { motion } from "framer-motion";
import { Star, TrendingUp, TrendingDown, Users, Eye, EyeOff, BarChart3, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const ReputationDashboard = () => {
  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
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

  // Studio breakdown
  const studioScores: Record<string, { total: number; count: number }> = {};
  completed.forEach((r: any) => {
    (r.services_reviewed || []).forEach((svc: string) => {
      if (!studioScores[svc]) studioScores[svc] = { total: 0, count: 0 };
      studioScores[svc].total += r.score_overall || 0;
      studioScores[svc].count++;
    });
  });

  // At-risk accounts (low scores)
  const atRisk = clients.filter((c: any) => c.review_count > 0 && c.avg_review_score < 3);

  // Value perception
  const valueDist = { exceptional: 0, good: 0, fair: 0, not_worth: 0 };
  completed.forEach((r: any) => { if (r.value_rating && valueDist.hasOwnProperty(r.value_rating)) (valueDist as any)[r.value_rating]++; });

  return (
    <div className="space-y-6">
      <motion.div {...fade}>
        <h2 className="font-display text-2xl font-bold text-foreground">Reputation Engine</h2>
        <p className="mt-1 text-sm text-muted-foreground">Performance intelligence from verified client feedback.</p>
      </motion.div>

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

      {/* Recent reviews list */}
      <motion.div {...fade} transition={{ delay: 0.25 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3">Recent Reviews</p>
        <div className="border border-border divide-y divide-border">
          {completed.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No reviews submitted yet.</div>
          ) : completed.slice(0, 10).map((r: any) => (
            <div key={r.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} className={s <= (r.score_overall || 0) ? "text-primary fill-primary" : "text-border"} />
                    ))}
                  </div>
                  {r.visibility !== "private" ? <Eye size={10} className="text-primary" /> : <EyeOff size={10} className="text-muted-foreground" />}
                </div>
                <p className="text-sm text-foreground mt-1 truncate">{r.one_sentence || r.biggest_transformation || "No narrative"}</p>
                <p className="text-[10px] text-muted-foreground">{r.reviewer_name || "Anonymous"} · {(r.services_reviewed || []).join(", ") || "—"}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReputationDashboard;
