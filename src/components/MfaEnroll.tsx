import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldOff, Loader2, Check, Copy } from "lucide-react";

type Factor = { id: string; friendly_name?: string; status: string };

const MfaEnroll = () => {
  const { toast } = useToast();
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);

  // Enrollment state
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadFactors = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (!error && data) {
      setFactors(data.totp.filter((f) => f.status === "verified"));
    }
    setLoading(false);
  };

  useEffect(() => { loadFactors(); }, []);

  const handleEnroll = async () => {
    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator App",
    });

    if (error) {
      toast({ title: "Enrollment failed", description: error.message, variant: "destructive" });
      setEnrolling(false);
      return;
    }

    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setFactorId(data.id);
  };

  const handleVerifyEnroll = async () => {
    if (!factorId || verifyCode.length !== 6) return;
    setVerifying(true);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (challengeError) {
      toast({ title: "Challenge failed", description: challengeError.message, variant: "destructive" });
      setVerifying(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: verifyCode.trim(),
    });

    if (verifyError) {
      toast({ title: "Invalid code", description: "The code entered is incorrect. Try again.", variant: "destructive" });
      setVerifyCode("");
      setVerifying(false);
      return;
    }

    toast({ title: "2FA enabled", description: "Two-factor authentication is now active on your account." });
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
    setEnrolling(false);
    setVerifying(false);
    loadFactors();
  };

  const handleUnenroll = async (id: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "2FA removed", description: "Two-factor authentication has been disabled." });
    loadFactors();
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" /> Loading security settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {factors.length > 0 ? (
            <ShieldCheck size={18} className="text-green-600" strokeWidth={1.5} />
          ) : (
            <ShieldOff size={18} className="text-muted-foreground" strokeWidth={1.5} />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {factors.length > 0 ? "2FA is enabled" : "2FA is not enabled"}
            </p>
            <p className="text-xs text-muted-foreground">
              {factors.length > 0
                ? "Your account is protected with an authenticator app."
                : "Add an extra layer of security to your account."}
            </p>
          </div>
        </div>

        {factors.length === 0 && !enrolling && (
          <Button onClick={handleEnroll} size="sm" className="text-xs tracking-wide">
            Enable 2FA
          </Button>
        )}
      </div>

      {/* Enrolled factors list */}
      {factors.length > 0 && !enrolling && (
        <div className="space-y-2">
          {factors.map((factor) => (
            <div key={factor.id} className="flex items-center justify-between border border-border p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-sm text-foreground">{factor.friendly_name || "Authenticator App"}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnenroll(factor.id)}
                className="text-xs text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Enrollment flow */}
      {enrolling && qrCode && (
        <div className="border border-border p-6 space-y-5">
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            Set up authenticator
          </p>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
            </p>
            <div className="flex justify-center py-2">
              <img
                src={qrCode}
                alt="MFA QR Code"
                className="w-48 h-48 border border-border p-2 bg-white"
              />
            </div>
          </div>

          {secret && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Or enter this key manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono bg-secondary border border-border px-3 py-2 break-all">
                  {secret}
                </code>
                <Button variant="outline" size="icon" className="shrink-0 h-8 w-8" onClick={handleCopySecret}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Enter the 6-digit code from your app to confirm
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-3 py-2.5 text-lg tracking-[0.5em] text-center font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyEnroll}
              disabled={verifyCode.length !== 6 || verifying}
              className="text-xs tracking-wide"
            >
              {verifying ? "Verifying..." : "Confirm & Enable"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setEnrolling(false);
                setQrCode(null);
                setSecret(null);
                setFactorId(null);
                setVerifyCode("");
              }}
              className="text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MfaEnroll;
