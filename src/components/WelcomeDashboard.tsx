import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, MessageSquarePlus, User, ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import OnboardingTour from "./OnboardingTour";

const quickStartItems = [
  {
    icon: User,
    title: "Complete your profile",
    description: "Add your details so your team knows who to reach.",
    href: "/portal/account",
    cta: "Go to Account",
  },
  {
    icon: MessageSquarePlus,
    title: "Submit your first request",
    description: "Tell us what you need. We will get to work.",
    href: "/portal/requests",
    cta: "Create Request",
  },
  {
    icon: FileText,
    title: "Explore your documents",
    description: "Access shared files and templates in one place.",
    href: "/portal/documents",
    cta: "View Documents",
  },
];

interface WelcomeDashboardProps {
  onDismiss: () => void;
  userName?: string;
}

const WelcomeDashboard = ({ onDismiss, userName }: WelcomeDashboardProps) => {
  const { user } = useAuth();
  const [showTour, setShowTour] = useState(false);

  const handleDismiss = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);
    }
    onDismiss();
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("user_id", user.id);
    }
    onDismiss();
  };

  return (
    <>
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-2">
            Welcome
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground">
            {userName ? `Welcome, ${userName}.` : "Welcome to Support Studio."}
          </h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-lg">
            Your account is ready. Take a quick tour to learn how your portal works, or jump straight in.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={() => setShowTour(true)} className="text-sm tracking-wide gap-2">
              <Compass size={14} /> Take the Tour
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="text-sm tracking-wide">
              Skip to Dashboard
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
            Quick Start
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStartItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              >
                <Link
                  to={item.href}
                  className="block bg-card border border-border rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <item.icon size={18} className="text-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  <span className="text-xs text-foreground font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    {item.cta} <ArrowRight size={12} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-foreground" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">You are all set.</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Once you are comfortable, dismiss this guide to see your full dashboard. You can always find help in your account settings.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDismiss} className="text-xs tracking-wide shrink-0">
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomeDashboard;
