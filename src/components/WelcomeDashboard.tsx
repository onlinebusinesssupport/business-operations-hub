import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, MessageSquarePlus, User, ArrowRight, Compass, Settings, Zap, Target, Globe, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const studioCards = [
  { name: "Operations", icon: Settings, status: "active" as const },
  { name: "Automation", icon: Zap, status: "building" as const },
  { name: "Lead Engine", icon: Target, status: "locked" as const },
  { name: "Digital Presence", icon: Globe, status: "locked" as const },
  { name: "Experiences", icon: Sparkles, status: "locked" as const },
];

const statusBadge = {
  active: { label: "Active", className: "bg-primary/10 text-primary" },
  building: { label: "Building", className: "bg-yellow-500/10 text-yellow-600" },
  locked: { label: "Locked", className: "bg-muted text-muted-foreground" },
};

const quickStartItems = [
  {
    icon: User,
    title: "Complete your profile",
    description: "Add your details so your team knows who to reach.",
    href: "/portal/settings",
    cta: "Go to Settings",
  },
  {
    icon: MessageSquarePlus,
    title: "Submit your first request",
    description: "Tell us what you need. We'll get to work.",
    href: "/portal/requests",
    cta: "Create Request",
  },
  {
    icon: FileText,
    title: "Explore your files",
    description: "Access shared files and templates in one place.",
    href: "/portal/documents",
    cta: "View Files",
  },
];

interface WelcomeDashboardProps {
  onDismiss: () => void;
  userName?: string;
}

const WelcomeDashboard = ({ onDismiss, userName }: WelcomeDashboardProps) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"welcome" | "studios" | "quickstart">("welcome");

  const handleFinish = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);
    }
    onDismiss();
  };

  return (
    <div className="space-y-8">
      {phase === "welcome" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center text-center py-12">
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-6">Welcome</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
            Welcome to THE BUSINESS SUPPORT STUDIO™
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            {userName ? `${userName}, your` : "Your"} support environment is ready. Let's build momentum.
          </p>
          <Button onClick={() => setPhase("studios")} className="mt-8 text-sm tracking-wide gap-2">
            Enter Your Workspace <ArrowRight size={14} />
          </Button>
        </motion.div>
      )}

      {phase === "studios" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-2">Your Studios</p>
          <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Studio Activation Preview</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-8">These are the engines powering your support. Some are ready, others are being built for you.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            {studioCards.map((studio, i) => {
              const badge = statusBadge[studio.status];
              return (
                <motion.div
                  key={studio.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`border border-border p-5 flex flex-col gap-3 ${studio.status === "locked" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    {studio.status === "locked" ? (
                      <Lock size={16} className="text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <studio.icon size={16} className="text-muted-foreground" strokeWidth={1.5} />
                    )}
                    <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="font-display text-xs font-bold tracking-[0.1em] text-foreground uppercase">{studio.name}</p>
                  {studio.status === "locked" && (
                    <p className="text-[10px] text-muted-foreground">Unlock when activated</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <Button onClick={() => setPhase("quickstart")} className="text-sm tracking-wide gap-2">
            Continue <ArrowRight size={14} />
          </Button>
        </motion.div>
      )}

      {phase === "quickstart" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-2">Get Started</p>
          <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Quick Start</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-6">Three things to do first.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickStartItems.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link
                  to={item.href}
                  className="block border border-border p-6 hover:border-primary/40 transition-all duration-200 group h-full"
                >
                  <item.icon size={18} className="text-muted-foreground mb-4" strokeWidth={1.5} />
                  <h3 className="text-sm font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    {item.cta} <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="border border-border p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">You're in the Studio.</h3>
              <p className="text-xs text-muted-foreground mt-1">Dismiss this guide to see your full workspace.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleFinish} className="text-xs tracking-wide shrink-0">
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WelcomeDashboard;
