import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  Building,
  Globe2,
  Clock,
  DollarSign,
  Languages,
  Users,
  Copy,
  Check,
  Save,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PoweredBadge from "@/components/PoweredBadge";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
];

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)" },
];

const languages = [
  { code: "en", name: "English", status: "active" as const },
  { code: "es", name: "Español", status: "coming" as const },
  { code: "fr", name: "Français", status: "coming" as const },
  { code: "pt", name: "Português", status: "coming" as const },
  { code: "ar", name: "العربية", status: "coming" as const },
  { code: "zh", name: "中文", status: "coming" as const },
];

const referrals = [
  { name: "—", email: "—", status: "Pending", date: "—" },
];

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile data
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    company_name: string | null;
    created_at: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, company_name, created_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setProfile(data);
    };
    load();
  }, [user]);

  const badgeSnippet = `<a href="https://studioos.app" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;border:1px solid #e5e5e5;padding:4px 10px;font-family:sans-serif;text-decoration:none;color:#111"><span style="width:5px;height:5px;background:#1E3D2F;display:block"></span><span style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888">Powered by</span><span style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#111">STUDIO.OS</span></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveGlobal = async () => {
    setSaving(true);
    // For now, settings are local. Future: persist to a settings table.
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Settings saved", description: `Currency: ${currency} · Timezone: ${timezone}` });
    setSaving(false);
  };

  const selectClass = "w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring appearance-none";

  return (
    <div className="space-y-10">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight">
          Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Account, preferences, and platform configuration.
        </p>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="profile" className="text-xs tracking-wide">Profile</TabsTrigger>
          <TabsTrigger value="global" className="text-xs tracking-wide">Globalization</TabsTrigger>
          <TabsTrigger value="referrals" className="text-xs tracking-wide">Referrals</TabsTrigger>
          <TabsTrigger value="badge" className="text-xs tracking-wide">Badge</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-6">
              <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-5">
                Account Details
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Organisation</p>
                    <p className="text-sm text-foreground">{profile?.company_name || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">{profile?.email || user?.email || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm text-foreground">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border p-6">
              <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-5">
                Platform Summary
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Studios", value: "0" },
                  { label: "Tasks Completed", value: "—" },
                  { label: "Automations", value: "—" },
                  { label: "Files Stored", value: "—" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Globalization */}
        <TabsContent value="global" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Currency */}
            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Currency
                </p>
              </div>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClass}>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                Used for finance, pipeline values, and reports.
              </p>
            </div>

            {/* Timezone */}
            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Timezone
                </p>
              </div>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectClass}>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                All timestamps and deadlines use this timezone.
              </p>
            </div>

            {/* Language */}
            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Language
                </p>
              </div>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => lang.status === "active" && setLanguage(lang.code)}
                    disabled={lang.status === "coming"}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm border transition-colors ${
                      language === lang.code
                        ? "border-primary bg-primary/5 text-foreground"
                        : lang.status === "coming"
                        ? "border-border text-muted-foreground/40 cursor-not-allowed"
                        : "border-border text-foreground hover:border-foreground/30"
                    }`}
                  >
                    <span>{lang.name}</span>
                    {lang.status === "coming" && (
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/40">Soon</span>
                    )}
                    {language === lang.code && (
                      <Check size={12} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSaveGlobal} disabled={saving} className="text-sm tracking-wide gap-2">
            {saving ? <Save size={14} className="animate-pulse" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </TabsContent>

        {/* Referrals */}
        <TabsContent value="referrals" className="mt-6 space-y-6">
          <div className="border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-muted-foreground" strokeWidth={1.5} />
              <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                Referral Tracking
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg">
              Track referrals you've made to other businesses. Active referrals that convert may qualify for infrastructure credits.
            </p>
            <div className="border border-border divide-y divide-border">
              <div className="grid grid-cols-4 p-3 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium">
                <span>Name</span><span>Email</span><span>Status</span><span>Date</span>
              </div>
              {referrals.map((ref, i) => (
                <div key={i} className="grid grid-cols-4 p-3 text-sm text-foreground">
                  <span>{ref.name}</span>
                  <span className="text-muted-foreground">{ref.email}</span>
                  <span className="text-muted-foreground">{ref.status}</span>
                  <span className="text-muted-foreground">{ref.date}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/60 mt-4">
              Referral programme details will be shared once activated.
            </p>
          </div>
        </TabsContent>

        {/* Badge */}
        <TabsContent value="badge" className="mt-6 space-y-6">
          <div className="border border-border p-6">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-4">
              Embeddable Badge
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg">
              Add this badge to your website to signal that your business infrastructure is powered by STUDIO.OS.
            </p>
            <div className="mb-6">
              <PoweredBadge />
            </div>
            <div className="bg-secondary border border-border p-4">
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-2">Embed Code</p>
              <pre className="text-xs text-foreground/80 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {badgeSnippet}
              </pre>
            </div>
            <Button variant="outline" size="sm" className="mt-3 text-xs gap-2" onClick={handleCopy}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy Embed Code"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
