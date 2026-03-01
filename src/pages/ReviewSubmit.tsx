import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

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

const ReviewSubmit = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [reviewId, setReviewId] = useState("");

  const [form, setForm] = useState({
    score_overall: 0,
    score_strategic_clarity: 0, score_communication: 0, score_speed: 0,
    score_commercial_value: 0, score_overall_impact: 0,
    services_reviewed: [] as string[], value_rating: "", value_reason: "",
    impact_areas: [] as string[], biggest_transformation: "",
    nps_score: 8, nps_recommendation: "", almost_stopped: "",
    improvement_suggestion: "", one_sentence: "",
    visibility: "private", reviewer_name: "", reviewer_company: "", reviewer_website: "",
  });

  useEffect(() => {
    if (!token) { setError("Invalid review link."); setLoading(false); return; }
    (async () => {
      // Mark as opened
      const { data, error: err } = await supabase
        .from("reviews")
        .select("id, status, client_id")
        .eq("token", token)
        .maybeSingle();
      if (err || !data) { setError("This review link is invalid or expired."); setLoading(false); return; }
      if (data.status === "completed") { setSubmitted(true); setLoading(false); return; }
      setReviewId(data.id);
      if (data.status !== "opened") {
        await supabase.from("reviews").update({ status: "opened" }).eq("id", data.id);
        await supabase.from("review_requests").update({ opened_at: new Date().toISOString(), status: "opened" }).eq("review_id", data.id);
      }
      setLoading(false);
    })();
  }, [token]);

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));
  const toggleArray = (field: string, val: string) => {
    const arr = (form as any)[field] as string[];
    set(field, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const avgScore = Math.round(
      (form.score_strategic_clarity + form.score_communication + form.score_speed +
        form.score_commercial_value + form.score_overall_impact) / 5
    );
    const { error: err } = await supabase.from("reviews").update({
      ...form,
      score_overall: form.score_overall || avgScore,
      status: "completed",
      submitted_at: new Date().toISOString(),
    }).eq("id", reviewId);
    if (err) { setError("Failed to submit. Please try again."); setSubmitting(false); return; }
    await supabase.from("review_requests").update({ completed_at: new Date().toISOString(), status: "completed" }).eq("review_id", reviewId);
    setSubmitted(true);
    setSubmitting(false);
  };

  const totalSteps = 5;
  const canNext = () => {
    if (step === 0) return form.score_overall > 0;
    if (step === 1) return SCORE_LABELS.every((s) => (form as any)[s.key] > 0);
    return true;
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={24} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div {...fade} className="max-w-md text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
          <CheckCircle2 size={48} className="mx-auto text-primary" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground">Thank you.</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Thank you for trusting us with your business. That's never something we take lightly.
        </p>
        <p className="text-xs text-muted-foreground/60">— THE BUSINESS SUPPORT STUDIO™</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-divider px-6 py-4">
        <p className="font-display text-xs font-bold tracking-[0.2em] text-foreground uppercase">
          THE BUSINESS SUPPORT STUDIO™
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Progress */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          {step === 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                We care deeply about doing meaningful work. This takes 60 seconds — your honesty helps us improve and grow.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 0: Overall + Service */}
            {step === 0 && (
              <motion.div key="s0" {...fade} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">Overall, how would you rate your experience with us?</label>
                  <div className="flex justify-center">
                    <StarRating value={form.score_overall} onChange={(v) => set("score_overall", v)} size={32} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Which service did we support you with?</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => toggleArray("services_reviewed", s)}
                        className={`text-xs px-3 py-1.5 border transition-colors ${form.services_reviewed.includes(s) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Executive Scoring */}
            {step === 1 && (
              <motion.div key="s1" {...fade} className="space-y-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Service-Level Scoring</p>
                {SCORE_LABELS.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{s.label}</span>
                    <StarRating value={(form as any)[s.key]} onChange={(v) => set(s.key, v)} size={20} />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 2: Value + Impact + Transformation */}
            {step === 2 && (
              <motion.div key="s2" {...fade} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Did you feel the service delivered strong value for the investment?</label>
                  <div className="space-y-2">
                    {VALUE_OPTIONS.map((v) => (
                      <button key={v.value} type="button" onClick={() => set("value_rating", v.value)}
                        className={`w-full text-left text-sm px-4 py-2.5 border transition-colors ${form.value_rating === v.value ? "bg-primary/10 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <textarea value={form.value_reason} onChange={(e) => set("value_reason", e.target.value)}
                    placeholder="What made you choose that answer? (optional)" rows={2}
                    className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
                <div className="space-y-3">
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
                  <label className="text-sm font-medium text-foreground">What's the biggest change you experienced after working with us?</label>
                  <textarea value={form.biggest_transformation} onChange={(e) => set("biggest_transformation", e.target.value)}
                    rows={3} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </motion.div>
            )}

            {/* Step 3: NPS + Objections */}
            {step === 3 && (
              <motion.div key="s3" {...fade} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Would you recommend us to a friend, colleague, or family member?</label>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => set("nps_score", i)}
                        className={`w-8 h-8 text-xs font-medium border transition-colors ${form.nps_score === i ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                    <span>Not likely</span><span>Extremely likely</span>
                  </div>
                  <textarea value={form.nps_recommendation} onChange={(e) => set("nps_recommendation", e.target.value)}
                    placeholder="What would you say when recommending us?" rows={2}
                    className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">What almost stopped you from working with us initially?</label>
                  <textarea value={form.almost_stopped} onChange={(e) => set("almost_stopped", e.target.value)}
                    rows={2} className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Is there anything you wish we did better?</label>
                  <textarea value={form.improvement_suggestion} onChange={(e) => set("improvement_suggestion", e.target.value)}
                    rows={2} placeholder="Optional" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </motion.div>
            )}

            {/* Step 4: Permission + One-liner */}
            {step === 4 && (
              <motion.div key="s4" {...fade} className="space-y-6">
                <div className="space-y-3">
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
                  <label className="text-sm font-medium text-foreground">How would you describe working with us in one sentence?</label>
                  <textarea value={form.one_sentence} onChange={(e) => set("one_sentence", e.target.value)}
                    rows={2} placeholder="This becomes a hero testimonial" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} className="gap-2 text-xs">
              <ChevronLeft size={14} /> Back
            </Button>
            {step < totalSteps - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gap-2 text-xs">
                Continue <ChevronRight size={14} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2 text-xs">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
