import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Inbox, FileText, CreditCard, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logActivity } from "@/lib/activity";

const tourSteps = [
  {
    icon: Sparkles,
    title: "Your Dashboard",
    description: "This is your command centre. See your Growth Score, subscription status, and retainer usage at a glance.",
    highlight: "Top section",
  },
  {
    icon: Inbox,
    title: "Current Priorities",
    description: "Active work items appear here. Track what's in progress, awaiting your input, or under review.",
    highlight: "Current Priorities section",
  },
  {
    icon: FileText,
    title: "Submit Requests",
    description: "Need something? Head to Requests to submit tasks directly to your team. They'll appear in the Work Manager instantly.",
    highlight: "Requests page",
  },
  {
    icon: CreditCard,
    title: "Billing & Retainer",
    description: "Track your retainer usage, view invoices, and manage your subscription — all in one place.",
    highlight: "Billing page",
  },
  {
    icon: Activity,
    title: "Activity Feed",
    description: "Every update, status change, and milestone is logged here. Stay informed without chasing updates.",
    highlight: "Recent Movement section",
  },
];

interface WelcomeTourProps {
  onClose: () => void;
  userName?: string;
}

const WelcomeTour = ({ onClose, userName }: WelcomeTourProps) => {
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const step = tourSteps[stepIndex];
  const isLast = stepIndex === tourSteps.length - 1;

  const handleClose = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ first_login: false } as any)
        .eq("user_id", user.id);

      const { data: clientId } = await supabase.rpc("get_my_client_id");
      await logActivity({
        client_id: clientId,
        action: "welcome_tour_completed",
        entity_type: "profile",
        details: { steps_viewed: stepIndex + 1, total_steps: tourSteps.length },
      });
    }
    onClose();
  };

  const handleSkip = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ first_login: false } as any)
        .eq("user_id", user.id);

      const { data: clientId } = await supabase.rpc("get_my_client_id");
      await logActivity({
        client_id: clientId,
        action: "welcome_tour_skipped",
        entity_type: "profile",
        details: { skipped_at_step: stepIndex + 1, total_steps: tourSteps.length },
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md mx-4 border border-border bg-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Welcome Tour — {stepIndex + 1}/{tourSteps.length}
          </p>
          <button onClick={handleSkip} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6">
          <div className="flex gap-1">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 transition-all duration-300 ${
                  i <= stepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 border border-primary/30 bg-primary/5 flex items-center justify-center">
                <step.icon size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-accent text-muted-foreground uppercase tracking-wider font-medium">
                  {step.highlight}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-between">
          {stepIndex > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setStepIndex((s) => s - 1)} className="text-xs gap-1">
              <ArrowLeft size={12} /> Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
              Skip tour
            </Button>
          )}
          {isLast ? (
            <Button size="sm" onClick={handleClose} className="text-xs tracking-wide gap-1">
              Get Started <Sparkles size={12} />
            </Button>
          ) : (
            <Button size="sm" onClick={() => setStepIndex((s) => s + 1)} className="text-xs tracking-wide gap-1">
              Next <ArrowRight size={12} />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeTour;
