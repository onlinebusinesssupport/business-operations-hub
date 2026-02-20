import { useState } from "react";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PoweredBadge from "@/components/PoweredBadge";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const currencies = ["USD", "EUR", "GBP", "ZAR", "AUD", "CAD", "CHF", "JPY", "SGD"];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Africa/Johannesburg",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const referrals = [
  { name: "—", email: "—", status: "Pending", date: "—" },
];

const Account = () => {
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [copied, setCopied] = useState(false);

  const badgeSnippet = `<a href="https://studioos.app" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;border:1px solid #e5e5e5;padding:4px 10px;font-family:sans-serif;text-decoration:none;color:#111"><span style="width:5px;height:5px;background:#1E3D2F;display:block"></span><span style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#888">Powered by</span><span style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#111">STUDIO.OS</span></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(badgeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    <p className="text-sm text-foreground">—</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">—</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-muted-foreground" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm text-foreground">—</p>
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
            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Currency
                </p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={selectClass}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Timezone
                </p>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={selectClass}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            <div className="border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  Language
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 size={14} className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">English (default)</p>
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-2">
                Additional languages coming soon.
              </p>
            </div>
          </div>
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
                <span>Name</span>
                <span>Email</span>
                <span>Status</span>
                <span>Date</span>
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
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-2">
                Embed Code
              </p>
              <pre className="text-xs text-foreground/80 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {badgeSnippet}
              </pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs gap-2"
              onClick={handleCopy}
            >
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
