import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, User, Building2, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "Technology",
  "Professional Services",
  "Creative & Media",
  "E-commerce & Retail",
  "Health & Wellness",
  "Education",
  "Finance & Accounting",
  "Non-Profit",
  "Real Estate",
  "Other",
];

const REFERRAL_SOURCES = [
  "Google search",
  "Social media",
  "Referral from a colleague",
  "LinkedIn",
  "Industry event",
  "Other",
];

const steps = [
  { label: "Personal", icon: User },
  { label: "Business", icon: Building2 },
  { label: "Confirm", icon: CheckCircle2 },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

const Signup = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Step 1: Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Business
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 2)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const step1Valid = fullName.trim() && email.trim() && password.length >= 6;
  const step2Valid = companyName.trim();

  const handleSignup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          company_name: companyName.trim(),
          industry,
          referral_source: referralSource,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: "Unable to sign up", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
            <CheckCircle2 size={24} className="text-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Verify your email</h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            We sent a verification link to <strong className="text-foreground">{email}</strong>.
            Click the link to activate your account and access your portal.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-8 text-sm tracking-wide">
              Back to Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors";
  const selectClass = "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase block mb-10">
          SUPPORT STUDIO™
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  i < step
                    ? "bg-foreground text-background"
                    : i === step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check size={14} strokeWidth={2} /> : <s.icon size={14} strokeWidth={1.5} />}
              </div>
              <div className="hidden sm:block">
                <p className={`text-[10px] uppercase tracking-widest ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px transition-colors duration-300 ${i < step ? "bg-foreground" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[320px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Personal details</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us who you are so we can set up your account.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Full name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Phone number <span className="text-muted-foreground/50">(optional)</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+27 ..." />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputClass} placeholder="Minimum 6 characters" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={goNext} disabled={!step1Valid} className="text-sm tracking-wide gap-2">
                    Continue <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Business information</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Help us understand your business so we can tailor your experience.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Company name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className={inputClass} placeholder="Your organisation" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Industry / sector</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
                      <option value="">Select an industry</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">How did you hear about us?</label>
                    <select value={referralSource} onChange={(e) => setReferralSource(e.target.value)} className={selectClass}>
                      <option value="">Select an option</option>
                      {REFERRAL_SOURCES.map((src) => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={goBack} className="text-sm tracking-wide gap-2">
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button onClick={goNext} disabled={!step2Valid} className="text-sm tracking-wide gap-2">
                    Review <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Confirm your details</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Review your information before creating your account.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                    <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Personal</p>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground">{fullName}</span>
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground truncate">{email}</span>
                      {phone && (
                        <>
                          <span className="text-muted-foreground">Phone</span>
                          <span className="text-foreground">{phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-3">
                    <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">Business</p>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Company</span>
                      <span className="text-foreground">{companyName}</span>
                      {industry && (
                        <>
                          <span className="text-muted-foreground">Industry</span>
                          <span className="text-foreground">{industry}</span>
                        </>
                      )}
                      {referralSource && (
                        <>
                          <span className="text-muted-foreground">Referral</span>
                          <span className="text-foreground">{referralSource}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={goBack} className="text-sm tracking-wide gap-2">
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button onClick={handleSignup} disabled={loading} className="text-sm tracking-wide">
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground tracking-widest">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full text-sm tracking-wide gap-2"
          size="lg"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
            });
            if (error) {
              toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
            }
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign up with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full text-sm tracking-wide gap-2 mt-3"
          size="lg"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("apple", {
              redirect_uri: window.location.origin,
            });
            if (error) {
              toast({ title: "Apple sign-in failed", description: String(error), variant: "destructive" });
            }
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Sign up with Apple
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
