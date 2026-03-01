import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Filter, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const STUDIO_FILTERS = [
  "All", "Social Media Management", "Lead Generation", "Business Automation",
  "Executive Virtual Support", "Travel & Experiences", "Grants & Awards",
];

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"highest" | "latest">("latest");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "completed")
        .neq("visibility", "private")
        .order("submitted_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = reviews
    .filter((r: any) => activeFilter === "All" || (r.services_reviewed || []).includes(activeFilter))
    .sort((a: any, b: any) => {
      if (sortBy === "highest") return (b.score_overall || 0) - (a.score_overall || 0);
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

  const avgScore = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + (r.score_overall || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  const npsAvg = reviews.filter((r: any) => r.nps_score != null).length > 0
    ? Math.round(reviews.filter((r: any) => r.nps_score != null).reduce((s: number, r: any) => s + r.nps_score, 0) / reviews.filter((r: any) => r.nps_score != null).length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Hero */}
          <motion.div {...fade} transition={{ duration: 0.5 }} className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">CLIENT REVIEWS</span>
            <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-foreground">
              What our partners say
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Real feedback from real businesses. Every review is verified and tied to completed work.
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="mt-10 flex flex-wrap items-center gap-6 pb-8 border-b border-divider">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-bold text-foreground">{avgScore}</span>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className={s <= Math.round(Number(avgScore)) ? "text-primary fill-primary" : "text-border"} />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">{reviews.length} reviews</p>
              </div>
            </div>
            <div className="h-8 w-px bg-divider" />
            <div>
              <span className="font-display text-xl font-bold text-foreground">{npsAvg}</span>
              <p className="text-[10px] text-muted-foreground">NPS Average</p>
            </div>
            <div className="h-8 w-px bg-divider" />
            <div className="flex items-center gap-1.5 text-primary">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">
                {reviews.filter((r: any) => r.value_rating === "exceptional" || r.value_rating === "good").length}/{reviews.length} rate strong value
              </span>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6 flex flex-wrap items-center gap-3">
            <Filter size={14} className="text-muted-foreground" />
            {STUDIO_FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`text-[11px] px-3 py-1.5 border transition-colors ${activeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
            <div className="ml-auto">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-3 py-1.5 bg-card border border-border focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="latest">Most recent</option>
                <option value="highest">Highest rated</option>
              </select>
            </div>
          </motion.div>

          {/* Reviews grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground col-span-2 py-12 text-center">Loading reviews...</p>
            ) : filtered.length === 0 ? (
              <div className="col-span-2 py-16 text-center">
                <p className="text-sm text-muted-foreground">No public reviews yet. Be the first.</p>
              </div>
            ) : filtered.map((r: any, i: number) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="bg-card border border-divider p-6 space-y-4">
                {/* Score badge */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= (r.score_overall || 0) ? "text-primary fill-primary" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("en-ZA", { month: "short", year: "numeric" }) : ""}
                  </span>
                </div>

                {/* One-sentence quote */}
                {r.one_sentence && (
                  <p className="text-sm font-medium text-foreground leading-relaxed">"{r.one_sentence}"</p>
                )}

                {/* Transformation */}
                {r.biggest_transformation && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.biggest_transformation}</p>
                )}

                {/* Impact tags */}
                {(r.impact_areas || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.impact_areas.map((area: string) => (
                      <span key={area} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary">{area}</span>
                    ))}
                  </div>
                )}

                {/* Service tags */}
                {(r.services_reviewed || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.services_reviewed.map((svc: string) => (
                      <span key={svc} className="text-[10px] px-2 py-0.5 bg-accent text-foreground">{svc}</span>
                    ))}
                  </div>
                )}

                {/* Attribution */}
                <div className="pt-3 border-t border-divider">
                  {r.visibility === "public_named" ? (
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.reviewer_name || "Client"}</p>
                      {r.reviewer_company && <p className="text-xs text-muted-foreground">{r.reviewer_company}</p>}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Verified client · Anonymous</p>
                  )}
                </div>

                {/* Mini score breakdown */}
                <div className="grid grid-cols-5 gap-1 pt-2">
                  {[
                    { label: "Strategy", val: r.score_strategic_clarity },
                    { label: "Comms", val: r.score_communication },
                    { label: "Speed", val: r.score_speed },
                    { label: "Value", val: r.score_commercial_value },
                    { label: "Impact", val: r.score_overall_impact },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <span className="text-xs font-bold text-foreground">{s.val || "—"}</span>
                      <p className="text-[8px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
