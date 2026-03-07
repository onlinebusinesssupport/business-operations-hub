import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Briefcase, Users, MapPin, Check, Sparkles, Settings, Zap, Target, Globe, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

const industries = [
  "Technology", "Creative & Media", "Professional Services", "E-commerce & Retail",
  "Health & Wellness", "Education & Training", "Hospitality & Travel",
  "Non-Profit & Social Enterprise", "Finance & Insurance", "Other",
];

const teamSizes = ["Just me", "2–5 people", "6–15 people", "16–50 people", "50+"];
const referralSources = ["Google Search", "Social Media", "Referral", "Event or Conference", "Other"];

const studioIcons: Record<string, any> = {
  "Operations": Settings,
  "Automation": Zap,
  "Lead Engine": Target,
  "Digital Presence": Globe,
  "Grants & Awards": Compass,
  "Travel & Activities": Sparkles,
};

interface OnboardingWizardProps {
  onComplete: () => void;
  initialName?: string;
}

const OnboardingWizard = ({ onComplete, initialName }: OnboardingWizardProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Profile data
  const meta = user?.user_metadata || {};
  const [fullName, setFullName] = useState(initialName || meta.full_name || "");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState(meta.company_name || "");
  const [industry, setIndustry] = useState(meta.industry || "");
  const [teamSize, setTeamSize] = useState("");
  const [referralSource, setReferralSource] = useState("");

  // Client context
  const [clientServices, setClientServices] = useState<string[]>([]);
  const [clientTier, setClientTier] = useState("standard");
  const [brandName, setBrandName] = useState("THE BUSINESS SUPPORT STUDIO™");

  // Determine which essentials are already filled
  const essentialsFilled = useMemo(() => ({
    fullName: !!fullName.trim(),
    companyName: !!companyName.trim(),
    industry: !!industry,
  }), [fullName, companyName, industry]);

  const allEssentialsFilled = essentialsFilled.fullName && essentialsFilled.companyName && essentialsFilled.industry;
  const hasAnyUnfilled = !essentialsFilled.fullName || !essentialsFilled.companyName || !essentialsFilled.industry;

  // Steps: Welcome → Essentials (conditional) → Complete
  // If all essentials pre-filled, skip Essentials step
  const steps = useMemo(() => {
    const s = ["welcome"];
    if (hasAnyUnfilled) s.push("essentials");
    s.push("complete");
    return s;
  }, [hasAnyUnfilled]);

  const totalSteps = steps.length;
  const currentStepKey = steps[step] || "welcome";

  // Load existing profile + client data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, company_name, industry, referral_source")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.company_name) setCompanyName(profile.company_name);
        if (profile.industry) setIndustry(profile.industry);
        if (profile.referral_source) setReferralSource(profile.referral_source);
      }

      // Get client services/tier for personalized welcome
      const { data: clientId } = await supabase.rpc("get_my_client_id");
      if (clientId) {
        const { data: client } = await supabase
          .from("clients")
          .select("services, tier")
          .eq("id", clientId)
          .maybeSingle();
        if (client) {
          setClientServices(client.services || []);
          setClientTier(client.tier || "standard");
        }
      }

      // Load brand name from onboarding template (VA mode)
      const { data: tmpl } = await supabase
        .from("onboarding_templates")
        .select("brand_name, va_mode")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (tmpl && (tmpl as any).va_mode && (tmpl as any).brand_name) {
        setBrandName((tmpl as any).brand_name);
      }

      setLoading(false);
    };
    loadProfile();
  }, [user]);

  const firstName = fullName.split(" ")[0] || "there";

  const canAdvance = () => {
    if (currentStepKey === "welcome") return true;
    if (currentStepKey === "essentials") return fullName.trim().length > 0 && companyName.trim().length > 0 && industry.length > 0;
    if (currentStepKey === "complete") return true;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        company_name: companyName.trim() || null,
        industry: industry || null,
        referral_source: referralSource || null,
        onboarding_completed: true,
      })
      .eq("user_id", user.id);

    if (!error) {
      // Log completion to activity feed
      const { data: clientId } = await supabase.rpc("get_my_client_id");
      await logActivity({
        client_id: clientId,
        action: allEssentialsFilled ? "onboarding_auto_completed" : "onboarding_completed",
        entity_type: "profile",
        details: {
          skipped_essentials: allEssentialsFilled,
          steps_shown: steps.length,
        },
      });
    }

    setSaving(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setShowComplete(true);
    setTimeout(() => onComplete(), 3000);
  };

  const next = () => {
    if (currentStepKey === "complete") {
      handleFinish();
    } else {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const tierLabels: Record<string, string> = {
    starter: "Starter", standard: "Standard", growth: "Growth", enterprise: "Enterprise",
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-2 border-primary flex items-center justify-center">
            <span className="font-display text-lg font-bold text-primary">SS</span>
          </div>
          <p className="text-sm text-muted-foreground">Preparing your workspace…</p>
          <motion.div
            className="h-0.5 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>
      </div>
    );
  }

  // Completion screen with premium animation
  if (showComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 max-w-md px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles size={40} className="mx-auto text-primary" strokeWidth={1.5} />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
            You're all set.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to SUPPORT STUDIO™ — Clarity builds momentum. Systems build freedom.
          </p>
          <p className="text-xs text-muted-foreground/70 italic">— Dylan, Founder</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
            className="h-0.5 bg-primary mx-auto max-w-[200px]"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress */}
      <div className="w-full h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          The Business Support Studio™ — Setup
        </p>
        <div className="flex items-center gap-3">
          {allEssentialsFilled && currentStepKey === "welcome" && (
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-medium tracking-wider uppercase">
              100% Pre-filled
            </span>
          )}
          <p className="text-[10px] text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {currentStepKey === "welcome" && (
              <motion.div
                key="welcome"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center space-y-8"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <div className="w-16 h-16 mx-auto border-2 border-primary flex items-center justify-center mb-6">
                    <span className="font-display text-lg font-bold text-primary">SS</span>
                  </div>
                </motion.div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
                    Welcome{firstName !== "there" ? `, ${firstName}` : ""}
                  </p>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
                    Your {tierLabels[clientTier] || "Standard"} Workspace Is Ready
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {allEssentialsFilled
                    ? "We've pre-filled your profile from your application. Just confirm and you're in."
                    : "Let's finish setting up your profile — it'll take less than a minute."}
                </p>

                {/* Service preview based on tier */}
                {clientServices.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Your Enabled Studios</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {clientServices.map((s, i) => {
                        const Icon = studioIcons[s] || Sparkles;
                        return (
                          <motion.div
                            key={s}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="flex items-center gap-2 border border-border px-3 py-2"
                          >
                            <Icon size={12} className="text-primary" strokeWidth={1.5} />
                            <span className="text-xs text-foreground">{s}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pre-fill summary if essentials complete */}
                {allEssentialsFilled && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border border-border p-4 text-left max-w-sm mx-auto space-y-2"
                  >
                    <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Profile Preview</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2"><Users size={11} className="text-muted-foreground" /><span className="text-foreground">{fullName}</span></div>
                      <div className="flex items-center gap-2"><Building2 size={11} className="text-muted-foreground" /><span className="text-foreground">{companyName}</span></div>
                      <div className="flex items-center gap-2"><Briefcase size={11} className="text-muted-foreground" /><span className="text-foreground">{industry}</span></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStepKey === "essentials" && (
              <motion.div
                key="essentials"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Your Essentials</p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Complete Your Profile</h2>
                  <p className="mt-2 text-sm text-muted-foreground">We only need what's missing — the rest is pre-filled.</p>
                </div>
                <div className="space-y-5">
                  {/* Only show unfilled fields prominently, filled ones as read-only */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className={essentialsFilled.fullName ? "bg-muted border-border" : "bg-card border-border"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-display" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                    <Input id="email-display" value={user?.email || ""} disabled className="bg-muted border-border text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-xs uppercase tracking-wider text-muted-foreground">Company / Brand Name *</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" className={essentialsFilled.companyName ? "bg-muted border-border" : "bg-card border-border"} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Industry *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {industries.map((ind) => (
                        <button key={ind} onClick={() => setIndustry(ind)}
                          className={`text-left text-xs px-3 py-2.5 border transition-all duration-200 ${
                            industry === ind ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >{ind}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">Phone (optional)</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 000 000 0000" className="bg-card border-border" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStepKey === "complete" && (
              <motion.div
                key="complete"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Ready To Go</p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                    {allEssentialsFilled ? "Confirm & Enter" : "Final Touches"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {allEssentialsFilled ? "Everything looks great. Hit confirm to enter your workspace." : "Review your profile and optionally tell us how you found us."}
                  </p>
                </div>

                {/* Optional referral (only if not already set) */}
                {!referralSource && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">How did you find us? (optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {referralSources.map((src) => (
                        <button key={src} onClick={() => setReferralSource(src)}
                          className={`text-left text-xs px-3 py-2.5 border transition-all duration-200 ${
                            referralSource === src ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >{src}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profile summary */}
                <div className="border border-border p-5 space-y-3">
                  <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Profile Summary</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2"><Users size={12} className="text-muted-foreground" /><span className="text-foreground">{fullName || "—"}</span></div>
                    <div className="flex items-center gap-2"><Building2 size={12} className="text-muted-foreground" /><span className="text-foreground">{companyName || "—"}</span></div>
                    <div className="flex items-center gap-2"><Briefcase size={12} className="text-muted-foreground" /><span className="text-foreground">{industry || "—"}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-muted-foreground" /><span className="text-foreground">{teamSize || "—"}</span></div>
                  </div>
                </div>

                {/* Quick-start tips */}
                <div className="border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <p className="text-xs font-medium text-foreground">Quick Start Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>→ Submit your first request to get the team moving</li>
                    <li>→ Upload brand assets so we have everything we need</li>
                    <li>→ Check your active studios to see what's enabled</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 md:px-12 py-4 flex items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" size="sm" onClick={back} className="text-xs gap-1">
            <ArrowLeft size={12} /> Back
          </Button>
        ) : <div />}
        <Button onClick={next} disabled={!canAdvance() || saving} size="sm" className="text-xs tracking-wide gap-1">
          {saving ? "Saving…" : currentStepKey === "complete" ? (
            <>{allEssentialsFilled ? "Confirm & Enter" : "Complete Setup"} <Check size={12} /></>
          ) : (
            <>Continue <ArrowRight size={12} /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
