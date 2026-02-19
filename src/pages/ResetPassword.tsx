import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Password updated", description: "You can now sign in with your new password." });
    navigate("/login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <p className="text-sm text-muted-foreground">Verifying reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-medium text-foreground">Set new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your new password below.</p>

        <form onSubmit={handleUpdate} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2.5 text-sm bg-background border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <Button type="submit" className="w-full text-sm tracking-wide" size="lg" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
