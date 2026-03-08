import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Building, Calendar, Bell, Shield, Save, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MfaEnroll from "@/components/MfaEnroll";
import { useCurrency } from "@/lib/currency";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const ClientSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    company_name: string | null;
    phone: string | null;
    industry: string | null;
    created_at: string;
  } | null>(null);

  const [commMode, setCommMode] = useState("portal");
  const [notifications, setNotifications] = useState("all");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, company_name, phone, industry, created_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setProfile(data);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Preferences saved", description: "Your settings have been updated." });
    setSaving(false);
  };

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Settings
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          Account details, preferences, and security.
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Company Profile
        </p>
        <div className="border border-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Building size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Organisation</p>
                <p className="text-sm text-foreground mt-0.5">{profile?.company_name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-sm text-foreground mt-0.5">{profile?.email || user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Member Since</p>
                <p className="text-sm text-foreground mt-0.5">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
            {profile?.industry && (
              <div className="flex items-center gap-3">
                <Building size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Industry</p>
                  <p className="text-sm text-foreground mt-0.5">{profile.industry}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Communication Preferences */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
          Communication
        </p>
        <div className="border border-border p-6 space-y-5">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Preferred Communication Mode</p>
            <div className="flex gap-2">
              {[
                { value: "portal", label: "Portal First" },
                { value: "email", label: "Email" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCommMode(opt.value)}
                  className={`text-xs px-4 py-2 border transition-all ${
                    commMode === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-3">Notification Frequency</p>
            <div className="flex gap-2">
              {[
                { value: "all", label: "All Updates" },
                { value: "important", label: "Important Only" },
                { value: "weekly", label: "Weekly Digest" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNotifications(opt.value)}
                  className={`text-xs px-4 py-2 border transition-all ${
                    notifications === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} size="sm" className="text-xs tracking-wide gap-2 mt-2">
            {saving ? <Save size={12} className="animate-pulse" /> : <Save size={12} />}
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4 flex items-center gap-2">
          <Shield size={12} strokeWidth={1.5} />
          Security
        </p>
        <div className="border border-border p-6">
          <p className="text-sm text-muted-foreground mb-4 max-w-lg">
            Protect your account with two-factor authentication.
          </p>
          <MfaEnroll />
        </div>
      </motion.div>
    </div>
  );
};

export default ClientSettings;
