import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, User, Building2, Crosshair, Sparkles, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "Technology", "Professional Services", "Creative & Media", "E-commerce & Retail",
  "Health & Wellness", "Education", "Finance & Accounting", "Non-Profit",
  "Real Estate", "Hospitality", "Manufacturing", "Other",
];

const TEAM_SIZES = ["Solo", "2–5", "6–15", "16–50", "50+"];
const REVENUE_RANGES = ["Pre-revenue", "< $10k/mo", "$10k–$50k/mo", "$50k–$200k/mo", "$200k+/mo"];
const CHANNELS = ["Organic / SEO", "Paid Ads", "Referrals", "Social Media", "Outbound", "Events", "Other"];

const SUPPORT_AREAS = [
  "Operations", "Automation", "Lead Generation", "Digital Presence", "Internal Systems",
];

const steps = [
  { label: "Identity", icon: User },
  { label: "Business", icon: Building2 },
  { label: "Readiness", icon: Crosshair },
  { label: "Intent", icon: Sparkles },
];

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

const Apply = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Step 1
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [primaryChannel, setPrimaryChannel] = useState("");

  // Step 3
  const [painPoints, setPainPoints] = useState("");
  const [areas, setAreas] = useState<string[]>([]);

  // Step 4
  const [intent, setIntent] = useState("");

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 3)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const step1Valid = fullName.trim() && businessName.trim() && email.trim() && country.trim();
  const step2Valid = industry.trim();
  const step3Valid = painPoints.trim().length > 10 && areas.length > 0;
  const step4Valid = intent.trim().length > 10;

  const toggleArea = (area: string) => {
    setAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("applications").insert({
      full_name: fullName.trim(),
      business_name: businessName.trim(),
      email: email.trim(),
      country: country.trim(),
      website: website.trim() || null,
      industry,
      team_size: teamSize,
      revenue_range: revenueRange,
      primary_channel: primaryChannel,
      pain_points: painPoints.trim(),
      areas_of_support: areas,
      intent: intent.trim(),
    });

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="mx-auto w-14 h-14 bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle2 size={28} className="text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
            You're on our radar.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            We review each application carefully to ensure alignment.
            You'll hear from us within 24–48 hours.
          </p>
          <Link to="/">
            <Button variant="outline" className="mt-8 text-sm tracking-wide">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors";
  const selectClass = "w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
        <Link to="/" className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase block mb-10">
          STUDIO.OS
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
          Apply for Studio Access
        </h1>
        <p className="mt-2 text-sm text-muted-foreground mb-8">
          Access is granted by invitation. Tell us about your business so we can determine fit.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 flex items-center justify-center shrink-0 transition-colors duration-300 text-[11px] font-medium ${
                i <= step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`hidden sm:block text-[10px] uppercase tracking-widest ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-foreground" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="min-h-[360px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div key="s0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Identity</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Full name *</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Business name *</label>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} placeholder="Your company" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Country *</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="e.g. South Africa" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Website <span className="text-muted-foreground/50">(optional)</span></label>
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} placeholder="https://..." />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={goNext} disabled={!step1Valid} className="text-sm tracking-wide gap-2">Continue <ArrowRight size={14} /></Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Business Snapshot</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Industry *</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Team size</label>
                    <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={selectClass}>
                      <option value="">Select size</option>
                      {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Monthly revenue range</label>
                    <select value={revenueRange} onChange={(e) => setRevenueRange(e.target.value)} className={selectClass}>
                      <option value="">Select range</option>
                      {REVENUE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Primary growth channel</label>
                    <select value={primaryChannel} onChange={(e) => setPrimaryChannel(e.target.value)} className={selectClass}>
                      <option value="">Select channel</option>
                      {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={goBack} className="text-sm tracking-wide gap-2"><ArrowLeft size={14} /> Back</Button>
                  <Button onClick={goNext} disabled={!step2Valid} className="text-sm tracking-wide gap-2">Continue <ArrowRight size={14} /></Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Infrastructure Readiness</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">What's currently breaking in your business? *</label>
                    <textarea
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      rows={4}
                      className={inputClass + " resize-none"}
                      placeholder="Tell us about the bottlenecks, inefficiencies, or gaps..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Which areas do you need most support in? *</label>
                    <div className="flex flex-wrap gap-2">
                      {SUPPORT_AREAS.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArea(area)}
                          className={`px-3 py-1.5 text-xs transition-colors border ${
                            areas.includes(area)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={goBack} className="text-sm tracking-wide gap-2"><ArrowLeft size={14} /> Back</Button>
                  <Button onClick={goNext} disabled={!step3Valid} className="text-sm tracking-wide gap-2">Continue <ArrowRight size={14} /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">Intent Signal</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Why do you want access to STUDIO.OS? *</label>
                    <textarea
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      rows={5}
                      className={inputClass + " resize-none"}
                      placeholder="What outcome are you looking for?"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={goBack} className="text-sm tracking-wide gap-2"><ArrowLeft size={14} /> Back</Button>
                  <Button onClick={handleSubmit} disabled={loading || !step4Valid} className="text-sm tracking-wide">
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Already have access?{" "}
          <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Apply;
