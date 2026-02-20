import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [portalType, setPortalType] = useState<"client" | "admin">("client");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Unable to sign in", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (portalType === "admin" && !roleData) {
        toast({ title: "Access denied", description: "This account does not have admin privileges.", variant: "destructive" });
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      navigate(roleData && portalType === "admin" ? "/admin" : "/portal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="font-display text-sm font-bold tracking-[0.2em] text-foreground uppercase block mb-10">
          SUPPORT STUDIO™
        </Link>

        {/* Portal type selector */}
        <div className="flex border border-border overflow-hidden mb-8">
          <button
            type="button"
            onClick={() => setPortalType("client")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
              portalType === "client"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setPortalType("admin")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
              portalType === "admin"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
          Enter SUPPORT STUDIO
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {portalType === "client"
            ? "Access your Studio and step into structured support."
            : "Sign in to manage platform operations."}
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <Button type="submit" className="w-full text-sm tracking-wide" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground tracking-widest">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full text-sm tracking-wide gap-2"
          size="lg"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
            });
            if (error) {
              toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
            }
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full text-sm tracking-wide gap-2 mt-3"
          size="lg"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("apple", {
              redirect_uri: window.location.origin,
            });
            if (error) {
              toast({ title: "Apple sign-in failed", description: String(error), variant: "destructive" });
            }
          }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Continue with Apple
        </Button>

        <div className="mt-6 text-center space-y-2">
          <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Forgot your password?
          </Link>
          {portalType === "client" && (
            <p className="text-xs text-muted-foreground">
              No account?{" "}
              <Link to="/apply" className="text-foreground hover:underline">
                Apply for access
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
