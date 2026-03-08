import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 — broken route:", location.pathname + location.search);

    // Log to activity_log for admin monitoring
    const logBrokenRoute = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from("activity_log").insert({
          action: "404_broken_route",
          entity_type: "route",
          entity_id: null,
          actor_id: session?.user?.id || null,
          details: {
            path: location.pathname,
            search: location.search,
            referrer: document.referrer || null,
            timestamp: new Date().toISOString(),
          },
        });
      } catch {
        // Silently fail — don't block the user
      }
    };
    logBrokenRoute();
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="w-14 h-14 mx-auto border border-border flex items-center justify-center">
          <AlertTriangle size={24} className="text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Route Not Found</p>
          <h1 className="font-display text-4xl font-bold text-foreground">404</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The page <code className="text-xs bg-muted px-1.5 py-0.5 font-mono">{location.pathname}</code> doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 text-xs">
            <ArrowLeft size={14} /> Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="text-xs">
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
