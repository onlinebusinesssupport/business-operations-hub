import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

const MfaVerify = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);

    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp[0];
      if (!totpFactor) {
        toast({ title: "No MFA factor found", description: "Please contact support.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: code.trim(),
      });

      if (verifyError) {
        toast({ title: "Invalid code", description: "The verification code is incorrect. Please try again.", variant: "destructive" });
        setCode("");
        setLoading(false);
        return;
      }

      // MFA verified — check role and navigate
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        navigate(roleData ? "/admin" : "/portal");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [code, loading, navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase block mb-10">
          THE BUSINESS SUPPORT STUDIO™
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={20} className="text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground uppercase tracking-tight">
              Two-Factor Verification
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter the code from your authenticator app
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-3 py-3 text-lg tracking-[0.5em] text-center font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full text-sm tracking-wide"
            size="lg"
            disabled={code.length !== 6 || loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out and try again
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MfaVerify;
