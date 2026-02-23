import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Briefcase, Users, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const industries = [
  "Technology",
  "Creative & Media",
  "Professional Services",
  "E-commerce & Retail",
  "Health & Wellness",
  "Education & Training",
  "Hospitality & Travel",
  "Non-Profit & Social Enterprise",
  "Finance & Insurance",
  "Other",
];

const teamSizes = [
  "Just me",
  "2–5 people",
  "6–15 people",
  "16–50 people",
  "50+",
];

const referralSources = [
  "Google Search",
  "Social Media",
  "Referral",
  "Event or Conference",
  "Other",
];

interface OnboardingWizardProps {
  onComplete: () => void;
  initialName?: string;
}

const TOTAL_STEPS = 4;

const OnboardingWizard = ({ onComplete, initialName }: OnboardingWizardProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(initialName || "");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const canAdvance = () => {
    if (step === 0) return true; // welcome
    if (step === 1) return fullName.trim().length > 0;
    if (step === 2) return companyName.trim().length > 0 && industry.length > 0;
    if (step === 3) return true; // optional
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

    setSaving(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    onComplete();
  };

  const next = () => {
    if (step === TOTAL_STEPS - 1) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress */}
      <div className="w-full h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Support Studio™ — Setup
        </p>
        <p className="text-[10px] text-muted-foreground">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="welcome"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Welcome
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
                  Let's set up your workspace
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  We'll walk you through a few quick steps to personalise your Support Studio™ experience. This takes less than a minute.
                </p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="personal"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">
                    About You
                  </p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                    Your Details
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    So your team knows who they're working with.
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-card border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Phone (optional)
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 000 000 0000"
                      className="bg-card border-border"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="business"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">
                    Your Business
                  </p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                    Tell Us About Your Business
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This helps us tailor your studio experience.
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Company / Brand Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                      className="bg-card border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Industry *
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {industries.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setIndustry(ind)}
                          className={`text-left text-xs px-3 py-2.5 border transition-all duration-200 ${
                            industry === ind
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Team Size
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {teamSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setTeamSize(size)}
                          className={`text-xs px-3 py-2 border transition-all duration-200 ${
                            teamSize === size
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="final"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">
                    Almost Done
                  </p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
                    One Last Thing
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    How did you hear about us? This is optional.
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      How did you find us?
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {referralSources.map((src) => (
                        <button
                          key={src}
                          onClick={() => setReferralSource(src)}
                          className={`text-left text-xs px-3 py-2.5 border transition-all duration-200 ${
                            referralSource === src
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {src}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="border border-border p-5 space-y-3">
                  <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                    Profile Summary
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-muted-foreground" />
                      <span className="text-foreground">{fullName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 size={12} className="text-muted-foreground" />
                      <span className="text-foreground">{companyName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={12} className="text-muted-foreground" />
                      <span className="text-foreground">{industry || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-muted-foreground" />
                      <span className="text-foreground">{teamSize || "—"}</span>
                    </div>
                  </div>
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
        ) : (
          <div />
        )}
        <Button
          onClick={next}
          disabled={!canAdvance() || saving}
          size="sm"
          className="text-xs tracking-wide gap-1"
        >
          {saving ? "Saving…" : step === TOTAL_STEPS - 1 ? (
            <>Complete Setup <Check size={12} /></>
          ) : (
            <>Continue <ArrowRight size={12} /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
