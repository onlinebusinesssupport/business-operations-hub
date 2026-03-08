import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Home, Mail, MessageSquare, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import lekoAvatar from "@/assets/leko-avatar.png";

const SESSION_KEY = "bss_404_count";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [showLekoTip, setShowLekoTip] = useState(false);
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;

    console.error("404 — dead link:", location.pathname + location.search);

    // Track session 404 count
    const count = Number(sessionStorage.getItem(SESSION_KEY) || "0") + 1;
    sessionStorage.setItem(SESSION_KEY, String(count));
    if (count >= 3) setShowLekoTip(true);

    // Log to activity_log for admin monitoring
    const logBrokenRoute = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from("activity_log").insert({
          action: "DEAD_LINK",
          entity_type: "route",
          entity_id: null,
          actor_id: session?.user?.id || null,
          details: {
            path: location.pathname,
            search: location.search,
            referrer: document.referrer || null,
            session_hit_count: count,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {
        // Silently fail
      }
    };
    logBrokenRoute();
  }, [location.pathname, location.search]);

  // Reset ref on path change
  useEffect(() => {
    logged.current = false;
  }, [location.pathname]);

  const messagesRoute = isAdmin ? "/admin/messages" : user ? "/portal/messages" : "/contact";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        {/* 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <p className="font-display text-[120px] md:text-[160px] font-bold leading-none text-primary/10 select-none">
            404
          </p>
        </motion.div>

        {/* Copy */}
        <div className="-mt-16 relative z-10 space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight"
          >
            Eish! You've reached a dead end.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto"
          >
            Even our AI, LEKO, couldn't find this page. It might have been "exterminated"
            or moved to a more exclusive neighbourhood.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="text-xs text-muted-foreground/60 font-mono"
          >
            {location.pathname}
          </motion.p>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 text-xs border-border hover:bg-accent/50"
          >
            <ArrowLeft size={14} /> Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="gap-2 text-xs"
          >
            <Home size={14} /> Take Me Home
          </Button>
        </motion.div>

        {/* Emergency Support */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="border border-border bg-card p-5 space-y-4 mx-auto max-w-sm"
        >
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Emergency Support
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail size={14} className="text-primary" />
            <a
              href="mailto:support@supportstudio.com"
              className="text-foreground hover:text-primary transition-colors"
            >
              support@supportstudio.com
            </a>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(messagesRoute)}
            className="w-full gap-2 text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <MessageSquare size={14} /> Message Admin
          </Button>
        </motion.div>

        {/* LEKO tooltip after 3+ 404s in session */}
        <AnimatePresence>
          {showLekoTip && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="border border-primary/30 bg-primary/5 p-4 mx-auto max-w-sm flex items-start gap-3 text-left"
            >
              <img src={lekoAvatar} alt="LEKO" className="w-8 h-8 rounded-full border border-primary/20 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-xs text-foreground leading-relaxed">
                  I noticed you're struggling to find your way. Let me connect you with someone who can help.
                </p>
                <button
                  onClick={() => navigate(messagesRoute)}
                  className="text-[11px] text-primary font-medium hover:underline flex items-center gap-1.5"
                >
                  <Brain size={12} /> Chat with an expert →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer mark */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase"
        >
          The Business Support Studio™
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
