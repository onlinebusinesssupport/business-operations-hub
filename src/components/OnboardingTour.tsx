import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  X,
  LayoutDashboard,
  Briefcase,
  MessageSquarePlus,
  FileText,
  Bell,
  Settings,
} from "lucide-react";

const tourSteps = [
  {
    icon: LayoutDashboard,
    title: "Your Dashboard",
    description:
      "This is your command centre. Get a real-time overview of what's in motion, pending, and recently completed.",
    selector: "[data-tour='dashboard']",
    position: "right" as const,
  },
  {
    icon: Briefcase,
    title: "Studios",
    description:
      "Each Studio focuses on a core business function. Track progress, timelines, and deliverables across all active engagements.",
    selector: "[data-tour='projects']",
    position: "right" as const,
  },
  {
    icon: MessageSquarePlus,
    title: "Requests",
    description:
      "Need something done? Submit a structured request here. Your support partner will pick it up and keep you updated.",
    selector: "[data-tour='requests']",
    position: "right" as const,
  },
  {
    icon: FileText,
    title: "Files",
    description:
      "All shared files, templates, and deliverables live here. No more digging through email threads — everything is organised.",
    selector: "[data-tour='documents']",
    position: "right" as const,
  },
  {
    icon: Bell,
    title: "Conversations",
    description:
      "Stay informed. Your support partner posts progress notes, milestone completions, and important updates here.",
    selector: "[data-tour='updates']",
    position: "right" as const,
  },
  {
    icon: Settings,
    title: "Settings",
    description:
      "Manage your profile, preferences, and notification settings from your account page.",
    selector: "[data-tour='settings']",
    position: "right" as const,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = useCallback(() => {
    const step = tourSteps[currentStep];
    const el = document.querySelector(step.selector);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    // Small delay to allow sidebar render
    const timer = setTimeout(updateTargetRect, 100);
    window.addEventListener("resize", updateTargetRect);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTargetRect);
    };
  }, [updateTargetRect]);

  const isLast = currentStep === tourSteps.length - 1;
  const step = tourSteps[currentStep];

  // Calculate tooltip position
  const tooltipStyle: React.CSSProperties = targetRect
    ? {
        position: "fixed",
        top: Math.max(16, targetRect.top - 20),
        left: targetRect.right + 16,
        zIndex: 10001,
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
      };

  // If tooltip would go off screen on right, recalculate
  if (targetRect && targetRect.right + 360 > window.innerWidth) {
    tooltipStyle.left = undefined;
    (tooltipStyle as any).right = 16;
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000]"
        style={{ backgroundColor: "hsl(var(--foreground) / 0.4)" }}
      >
        {/* Spotlight cutout on target */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute rounded-lg"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: "0 0 0 9999px hsl(var(--foreground) / 0.4)",
              backgroundColor: "hsl(var(--background))",
              zIndex: 10000,
            }}
          />
        )}
      </motion.div>

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          style={tooltipStyle}
          className="w-[320px] bg-background border border-border rounded-xl shadow-lg p-6"
        >
          {/* Skip button */}
          <button
            onClick={onComplete}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip tour"
          >
            <X size={14} />
          </button>

          {/* Step counter */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
              <step.icon size={16} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>

          <h3 className="font-serif text-lg font-medium text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-5">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-6 bg-foreground"
                    : i < currentStep
                    ? "w-1.5 bg-foreground/40"
                    : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="text-xs gap-1"
            >
              <ArrowLeft size={12} /> Back
            </Button>

            {isLast ? (
              <Button size="sm" onClick={onComplete} className="text-xs tracking-wide">
                Launch Workspace
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="text-xs tracking-wide gap-1"
              >
                Next <ArrowRight size={12} />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default OnboardingTour;
