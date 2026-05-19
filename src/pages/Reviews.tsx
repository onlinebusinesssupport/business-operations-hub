import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Filter, TrendingUp, PenLine, X, ChevronRight, ChevronLeft, CheckCircle2, Loader2, LogIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const STUDIO_FILTERS = [
  "All", "Social Media Management", "Lead Generation", "Business Automation",
  "Executive Virtual Support", "Travel & Experiences", "Grants & Awards",
];

const SERVICE_OPTIONS = [
  "Social Media Management", "Lead Generation", "Business Automation",
  "Executive Virtual Support", "Travel & Experiences", "Grants & Awards",
];

const VALUE_OPTIONS = [
  { value: "exceptional", label: "Exceptional value" },
  { value: "good", label: "Good value" },
  { value: "fair", label: "Fair value" },
  { value: "not_worth", label: "Not worth the investment" },
];

const IMPACT_OPTIONS = [
  "Increased revenue", "Saved time", "Reduced stress", "Improved systems",
  "More consistent leads", "Stronger brand presence", "Better work-life balance",
];

const VISIBILITY_OPTIONS = [
  { value: "public_named", label: "Yes — with my name & company" },
  { value: "public_anonymous", label: "Yes — but anonymously" },
  { value: "private", label: "Keep this private" },
];

const SCORE_LABELS = [
  { key: "score_strategic_clarity", label: "Strategic Clarity" },
  { key: "score_communication", label: "Communication" },
  { key: "score_speed", label: "Speed of Execution" },
  { key: "score_commercial_value", label: "Commercial Value" },
  { key: "score_overall_impact", label: "Overall Impact" },
];

const StarRating = ({ value, onChange, size = 24 }: { value: number; onChange: (v: number) => void; size?: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="transition-transform hover:scale-110">
        <Star size={size} className={s <= value ? "text-primary fill-primary" : "text-border"} />
      </button>
    ))}
  </div>
);

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"highest" | "latest">("latest");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    score_overall: 0,
    score_strategic_clarity: 0, score_communication: 0, score_speed: 0,
    score_commercial_value: 0, score_overall_impact: 0,
    services_reviewed: [] as string[], value_rating: "", value_reason: "",
    impact_areas: [] as string[], biggest_transformation: "",
    nps_score: null as number | null, nps_recommendation: "", almost_stopped: "",
    improvement_suggestion: "", one_sentence: "",
    visibility: "private", reviewer_name: "", reviewer_company: "", reviewer_website: "",
    service_date: "",
  });

  // Public reviews: only show those submitted 24+ hours ago
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "completed")
        .neq("visibility", "private")
        .lte("submitted_at", cutoff)
        .order("submitted_at", { ascending: false });
      return data || [];
    },
  });

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));
  const toggleArray = (field: string, val: string) => {
    const arr = (form as any)[field] as string[];
    set(field, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleWriteReviewClick = () => {
    if (!user) {
      navigate("/signup?redirect=/reviews&action=write-review");
      return;
    }
    setShowWriteReview(true);
    setSubmitted(false);
    setStep(0);
  };

  const handlePublicSubmit = async () => {
    setSubmitting(true);
    const avgScore = Math.round(
      (form.score_strategic_clarity + form.score_communication + form.score_speed +
        form.score_commercial_value + form.score_overall_impact) / 5
    );
    const { error } = await supabase.from("reviews").insert({
      ...form,
      score_overall: form.score_overall || avgScore,
      nps_score: form.nps_score,
      status: "completed",
      submitted_at: new Date().toISOString(),
      client_id: "70f82cf4-b1e3-43fa-8fe5-c8e477e6c5df",
    });
    if (error) {
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const totalSteps = 5;
  const canNext = () => {
    if (step === 0) return form.score_overall > 0;
    if (step === 1) return SCORE_LABELS.every((s) => (form as any)[s.key] > 0);
    if (step === 3) return form.nps_score !== null;
    return true;
  };

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
          <motion.div {...fade} transition={{ duration: 0.5 }} className="flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">CLIENT REVIEWS</span>
              <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold text-foreground">
                What clients say about working with the studio
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Real feedback from real businesses. Every review is verified and tied to completed work with SUPPORT STUDIO™.
              </p>
            </div>
            <Button onClick={handleWriteReviewClick} className="gap-2 text-xs mt-4">
              {user ? <PenLine size={14} /> : <LogIn size={14} />}
              {user ? "Write a Review" : "Sign Up to Review"}
            </Button>
          </motion.div>

          {/* Write Review Modal */}
          <AnimatePresence>
            {showWriteReview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={(e) => { if (e.target === e.currentTarget) setShowWriteReview(false); }}>
                <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  className="w-full max-w-lg bg-card border border-border p-6 space-y-6 max-h-[85vh] overflow-y-auto">

                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-foreground">Share Your Experience</p>
                    <button onClick={() => setShowWriteReview(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                  </div>

                  {submitted ? (
                    <div className="text-center space-y-4 py-8">
                      <CheckCircle2 size={40} className="mx-auto text-primary" />
                      <h2 className="font-display text-xl font-bold text-foreground">Thank you.</h2>
                      <p className="text-sm text-muted-foreground">Your honesty helps our team improve and grow. Your trust is never taken lightly.</p>
                      <p className="text-xs text-muted-foreground">Your review will appear publicly within 24 hours after being acknowledged.</p>
                      <Button onClick={() => setShowWriteReview(false)} variant="outline" size="sm" className="text-xs">Close</Button>
                    </div>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                          <div key={i} className={`h-1 flex-1 transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
                        ))}
                      </div>

                      {step === 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          Our team cares deeply about doing meaningful work. This takes 60 seconds — your honesty helps us improve and grow.
                        </p>
                      )}

                      <AnimatePresence mode="wait">
                        {step === 0 && (
                          <motion.div key="s0" {...fade} className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground">Overall, how would you rate your experience working with the studio?</label>
                              <div className="flex justify-center"><StarRating value={form.score_overall} onChange={(v) => set("score_overall", v)} size={28} /></div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground">Which service did our team support you with?</label>
                              <div className="flex flex-wrap gap-2">
                                {SERVICE_OPTIONS.map((s) => (
                                  <button key={s} type="button" onClick={() => toggleArray("services_reviewed", s)}
                                    className={`text-xs px-3 py-1.5 border transition-colors ${form.services_reviewed.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">When did you use this service?</label>
                              <input type="date" value={form.service_date} onChange={(e) => set("service_date", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                            </div>
                          </motion.div>
                        )}
                        {step === 1 && (
                          <motion.div key="s1" {...fade} className="space-y-5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Service-Level Scoring</p>
                            {SCORE_LABELS.map((s) => (
                              <div key={s.key} className="flex items-center justify-between">
                                <span className="text-sm text-foreground">{s.label}</span>
                                <StarRating value={(form as any)[s.key]} onChange={(v) => set(s.key, v)} size={18} />
                              </div>
                            ))}
                          </motion.div>
                        )}
                        {step === 2 && (
                          <motion.div key="s2" {...fade} className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Did our service deliver strong value?</label>
                              <div className="space-y-2">
                                {VALUE_OPTIONS.map((v) => (
                                  <button key={v.value} type="button" onClick={() => set("value_rating", v.value)}
                                    className={`w-full text-left text-sm px-4 py-2.5 border transition-colors ${form.value_rating === v.value ? "bg-primary/10 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">What impact did our work have?</label>
                              <div className="flex flex-wrap gap-2">
                                {IMPACT_OPTIONS.map((i) => (
                                  <button key={i} type="button" onClick={() => toggleArray("impact_areas", i)}
                                    className={`text-xs px-3 py-1.5 border transition-colors ${form.impact_areas.includes(i) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {i}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Biggest change after working with the studio?</label>
                              <textarea value={form.biggest_transformation} onChange={(e) => set("biggest_transformation", e.target.value)}
                                rows={2} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                            </div>
                          </motion.div>
                        )}
                        {step === 3 && (
                          <motion.div key="s3" {...fade} className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">How likely are you to recommend the studio? (0–10)</label>
                              <div className="flex gap-1 justify-center flex-wrap">
                                {Array.from({ length: 11 }).map((_, i) => (
                                  <button key={i} type="button" onClick={() => set("nps_score", i)}
                                    className={`w-8 h-8 text-xs font-medium border transition-colors ${form.nps_score === i ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {i}
                                  </button>
                                ))}
                              </div>
                              {form.nps_score === null && (
                                <p className="text-xs text-muted-foreground text-center">Please select a score to continue</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">What almost stopped you from working with the studio?</label>
                              <textarea value={form.almost_stopped} onChange={(e) => set("almost_stopped", e.target.value)}
                                rows={2} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Anything you wish we did better?</label>
                              <textarea value={form.improvement_suggestion} onChange={(e) => set("improvement_suggestion", e.target.value)}
                                rows={2} placeholder="Optional" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                            </div>
                          </motion.div>
                        )}
                        {step === 4 && (
                          <motion.div key="s4" {...fade} className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Can we share your feedback publicly?</label>
                              <div className="space-y-2">
                                {VISIBILITY_OPTIONS.map((v) => (
                                  <button key={v.value} type="button" onClick={() => set("visibility", v.value)}
                                    className={`w-full text-left text-sm px-4 py-2.5 border transition-colors ${form.visibility === v.value ? "bg-primary/10 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {form.visibility !== "private" && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                                <input value={form.reviewer_name} onChange={(e) => set("reviewer_name", e.target.value)}
                                  placeholder="Your name" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                                <input value={form.reviewer_company} onChange={(e) => set("reviewer_company", e.target.value)}
                                  placeholder="Company name" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                                <input value={form.reviewer_website} onChange={(e) => set("reviewer_website", e.target.value)}
                                  placeholder="Website (optional)" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
                              </motion.div>
                            )}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">Describe working with the studio in one sentence</label>
                              <textarea value={form.one_sentence} onChange={(e) => set("one_sentence", e.target.value)}
                                rows={2} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between pt-2">
                        <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} className="gap-2 text-xs">
                          <ChevronLeft size={14} /> Back
                        </Button>
                        {step < totalSteps - 1 ? (
                          <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gap-2 text-xs">
                            Continue <ChevronRight size={14} />
                          </Button>
                        ) : (
                          <Button onClick={handlePublicSubmit} disabled={submitting} className="gap-2 text-xs">
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            {submitting ? "Submitting..." : "Submit Review"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                <Button onClick={handleWriteReviewClick} variant="outline" size="sm" className="mt-4 gap-2 text-xs">
                  <PenLine size={13} /> Write a Review
                </Button>
              </div>
            ) : filtered.map((r: any, i: number) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="bg-card border border-divider p-6 space-y-4">
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

                {r.one_sentence && (
                  <p className="text-sm font-medium text-foreground leading-relaxed">"{r.one_sentence}"</p>
                )}

                {r.biggest_transformation && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.biggest_transformation}</p>
                )}

                {(r.impact_areas || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.impact_areas.map((area: string) => (
                      <span key={area} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary">{area}</span>
                    ))}
                  </div>
                )}

                {(r.services_reviewed || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.services_reviewed.map((svc: string) => (
                      <span key={svc} className="text-[10px] px-2 py-0.5 bg-accent text-foreground">{svc}</span>
                    ))}
                  </div>
                )}

                {/* Admin reply shown publicly */}
                {r.admin_reply && (
                  <div className="bg-secondary/50 border border-border p-3 space-y-1">
                    <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Response from the studio · SUPPORT STUDIO™</p>
                    <p className="text-sm text-foreground">{r.admin_reply}</p>
                  </div>
                )}

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
