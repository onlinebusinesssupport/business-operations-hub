import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

interface NewsletterFormProps {
  source: string;
  compact?: boolean;
}

const NewsletterForm = ({ source, compact = false }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Invalid email", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await (supabase as any)
      .from("newsletter_subscribers")
      .upsert(
        { email: parsed.data.toLowerCase(), source, is_active: true },
        { onConflict: "email" }
      );

    setLoading(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }

    setSuccess(true);
    setEmail("");
    toast({ title: "You're in!", description: "You'll receive our next update." });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? "gap-2" : "gap-3"} w-full`}>
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`${compact ? "h-9 text-xs" : "h-10 text-sm"} bg-background`}
      />
      <Button
        type="submit"
        size={compact ? "sm" : "default"}
        disabled={loading || success}
        className={`shrink-0 ${compact ? "text-xs px-3" : "text-xs tracking-wide px-4"}`}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : success ? (
          <Check size={14} />
        ) : (
          <>
            Subscribe
            <ArrowRight size={12} className="ml-1" />
          </>
        )}
      </Button>
    </form>
  );
};

export default NewsletterForm;
