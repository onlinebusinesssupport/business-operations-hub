import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);
const nameSchema = z.string().trim().min(1, "Full name is required").max(100, "Name must be under 100 characters");

interface NewsletterFormProps {
  source: string;
  compact?: boolean;
}

const NewsletterForm = ({ source, compact = false }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [popiConsent, setPopiConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedName = nameSchema.safeParse(fullName);
    if (!parsedName.success) {
      toast({ title: "Invalid name", description: parsedName.error.errors[0].message, variant: "destructive" });
      return;
    }

    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      toast({ title: "Invalid email", description: parsedEmail.error.errors[0].message, variant: "destructive" });
      return;
    }

    if (!popiConsent) {
      toast({ title: "Consent required", description: "Please agree to receive communications.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await (supabase as any)
      .from("newsletter_subscribers")
      .insert({
        email: parsedEmail.data.toLowerCase(),
        full_name: parsedName.data,
        source,
        is_active: true,
        popi_consent: true,
      });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already subscribed", description: "This email is already on our list." });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return;
      }
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }

    setSuccess(true);
    setEmail("");
    setFullName("");
    setPopiConsent(false);
    toast({ title: "You're in!", description: "You'll receive our next update." });
    setTimeout(() => setSuccess(false), 3000);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2 w-full">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-9 text-xs bg-background"
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-9 text-xs bg-background"
          />
        </div>
        <div className="flex items-start gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Checkbox
              id="popi-compact"
              checked={popiConsent}
              onCheckedChange={(v) => setPopiConsent(v === true)}
              className="mt-0.5"
            />
            <label htmlFor="popi-compact" className="text-[10px] text-muted-foreground leading-tight cursor-pointer">
              I consent to receiving communications in accordance with POPIA
            </label>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={loading || success}
            className="shrink-0 text-xs px-3"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : success ? <Check size={14} /> : (
              <>Subscribe <ArrowRight size={12} className="ml-1" /></>
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <Input
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="h-10 text-sm bg-background"
      />
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-10 text-sm bg-background"
      />
      <div className="flex items-start gap-2">
        <Checkbox
          id="popi-consent"
          checked={popiConsent}
          onCheckedChange={(v) => setPopiConsent(v === true)}
          className="mt-0.5"
        />
        <label htmlFor="popi-consent" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          I consent to receiving communications in accordance with POPIA
        </label>
      </div>
      <Button
        type="submit"
        disabled={loading || success}
        className="text-xs tracking-wide px-4"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : success ? <Check size={14} /> : (
          <>Subscribe <ArrowRight size={12} className="ml-1" /></>
        )}
      </Button>
    </form>
  );
};

export default NewsletterForm;
