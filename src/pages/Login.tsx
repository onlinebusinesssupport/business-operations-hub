import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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
        <Link to="/" className="font-sans text-sm font-semibold tracking-[0.15em] text-foreground uppercase block mb-10">
          SUPPORT STUDIO
        </Link>

        {/* Portal type selector */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-8">
          <button
            type="button"
            onClick={() => setPortalType("client")}
            className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
              portalType === "client"
                ? "bg-terracotta text-terracotta-foreground"
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
                ? "bg-terracotta text-terracotta-foreground"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
        </div>

        <h1 className="font-serif text-2xl font-medium text-foreground">
          {portalType === "client" ? "Client Portal" : "Admin Workspace"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {portalType === "client"
            ? "Access your projects, documents, and updates."
            : "Sign in to manage operations and clients."}
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
          <Button type="submit" className="w-full text-sm tracking-wide" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Forgot your password?
          </Link>
          {portalType === "client" && (
            <p className="text-xs text-muted-foreground">
              No account?{" "}
              <Link to="/signup" className="text-foreground hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
