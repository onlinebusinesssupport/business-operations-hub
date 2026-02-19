import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <h1 className="font-serif text-2xl font-medium text-foreground">Check your email</h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            If an account exists for <strong className="text-foreground">{email}</strong>, you will receive a password reset link.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-8 text-sm">Back to Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <Link to="/" className="font-sans text-sm font-semibold tracking-[0.15em] text-foreground uppercase block mb-10">SUPPORT STUDIO</Link>
        <h1 className="font-serif text-2xl font-medium text-foreground">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we will send a reset link.</p>

        <form onSubmit={handleReset} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 text-sm bg-background border border-divider rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <Button type="submit" className="w-full text-sm tracking-wide" size="lg" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/login" className="text-foreground hover:underline">Back to Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
