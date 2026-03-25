import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, User, Building2, Shield, FileText, Briefcase,
  Upload, Check, Sparkles, AlertCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

const businessTypes = [
  { value: "individual", label: "Individual", icon: User },
  { value: "registered_company", label: "Registered Company", icon: Building2 },
  { value: "startup", label: "Startup", icon: Sparkles },
  { value: "freelancer", label: "Freelancer", icon: Briefcase },
];

const idTypes = [
  { value: "national_id", label: "National ID" },
  { value: "passport", label: "Passport" },
];

const serviceOptions = [
  "Lead Generation",
  "Social Media Management",
  "CRM Setup",
  "Operations Support",
  "Automation",
  "Marketing Strategy",
];

interface ClientOnboardingWizardProps {
  onComplete: () => void;
  clientId?: string;
  prefill?: {
    full_name?: string;
    email?: string;
    phone?: string;
    company_name?: string;
  };
}

const ClientOnboardingWizard = ({ onComplete, clientId, prefill }: ClientOnboardingWizardProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1 — Profile
  const [fullName, setFullName] = useState(prefill?.full_name || "");
  const [email, setEmail] = useState(prefill?.email || user?.email || "");
  const [phone, setPhone] = useState(prefill?.phone || "");
  const [businessName, setBusinessName] = useState(prefill?.company_name || "");
  const [businessType, setBusinessType] = useState("individual");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [taxReference, setTaxReference] = useState("");

  // Step 2 — Compliance & Identity
  const [idType, setIdType] = useState("national_id");
  const [idNumber, setIdNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [identityFile, setIdentityFile] = useState<File | null>(null);

  // Step 3 — Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [challenge, setChallenge] = useState("");

  const steps = [
    { key: "profile", label: "Client Profile", icon: User },
    { key: "compliance", label: "Compliance & Identity", icon: Shield },
    { key: "services", label: "Service Selection", icon: Briefcase },
  ];

  const canAdvance = () => {
    if (step === 0) return fullName.trim().length > 0 && email.trim().length > 0 && businessName.trim().length > 0;
    if (step === 1) return (idType === "national_id" ? idNumber.trim().length > 0 : passportNumber.trim().length > 0) && physicalAddress.trim().length > 0;
    if (step === 2) return selectedServices.length > 0;
    return true;
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB.");
      return;
    }
    setIdentityFile(file);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let identityDocPath: string | null = null;

      // Upload identity document if provided
      if (identityFile) {
        const ext = identityFile.name.split(".").pop();
        const path = `identity-docs/${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("client-files")
          .upload(path, identityFile);
        if (uploadErr) throw uploadErr;
        identityDocPath = path;
      }

      // Determine compliance status
      const hasIdDoc = !!identityDocPath;
      const hasTaxRef = !!taxReference.trim();
      const hasAddress = !!physicalAddress.trim();
      const complianceStatus = hasIdDoc && hasTaxRef && hasAddress
        ? "verified"
        : (!hasIdDoc || !hasAddress) ? "missing_documents" : "pending";

      // If clientId provided, update existing client
      if (clientId) {
        const { error } = await supabase
          .from("clients")
          .update({
            name: businessName.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            business_type: businessType,
            company_reg_number: businessType === "registered_company" ? companyRegNumber.trim() || null : null,
            tax_reference: taxReference.trim() || null,
            id_type: idType,
            id_number: idType === "national_id" ? idNumber.trim() || null : null,
            passport_number: idType === "passport" ? passportNumber.trim() || null : null,
            physical_address: physicalAddress.trim() || null,
            identity_doc_path: identityDocPath,
            compliance_status: complianceStatus,
            services: selectedServices,
            onboarding_challenge: challenge.trim() || null,
            status: "active",
            lifecycle_stage: "active",
          } as any)
          .eq("id", clientId);
        if (error) throw error;

        await logActivity({
          client_id: clientId,
          action: "onboarding_completed",
          entity_type: "client",
          entity_id: clientId,
          details: { compliance_status: complianceStatus, services: selectedServices },
        });
      } else {
        // Create new client record
        // First get profile id
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        const { data: newClient, error } = await supabase
          .from("clients")
          .insert({
            name: businessName.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            contact_profile_id: profile?.id || null,
            business_type: businessType,
            company_reg_number: businessType === "registered_company" ? companyRegNumber.trim() || null : null,
            tax_reference: taxReference.trim() || null,
            id_type: idType,
            id_number: idType === "national_id" ? idNumber.trim() || null : null,
            passport_number: idType === "passport" ? passportNumber.trim() || null : null,
            physical_address: physicalAddress.trim() || null,
            identity_doc_path: identityDocPath,
            compliance_status: complianceStatus,
            services: selectedServices,
            onboarding_challenge: challenge.trim() || null,
            status: "active",
            lifecycle_stage: "active",
          } as any)
          .select("id")
          .single();
        if (error) throw error;

        if (newClient) {
          // Create default pods for workspace
          const podNames = ["Requests", "Files", "Progress", "Messages", "Billing"];
          await supabase.from("pods").insert(
            podNames.map((name) => ({ client_id: newClient.id, name, status: "active" }))
          );

          await logActivity({
            client_id: newClient.id,
            action: "client_onboarded",
            entity_type: "client",
            entity_id: newClient.id,
            details: { compliance_status: complianceStatus, services: selectedServices },
          });
        }
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          company_name: businessName.trim() || null,
          onboarding_completed: true,
        })
        .eq("user_id", user.id);

      toast.success("Onboarding complete! Your workspace is ready.");
      onComplete();
    } catch (err: any) {
      console.error("Onboarding error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-border">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Client Onboarding
        </p>
        <div className="flex items-center gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                  isDone ? "bg-primary border-primary" : isActive ? "border-primary" : "border-border"
                }`}>
                  {isDone ? <Check size={12} className="text-primary-foreground" /> : <Icon size={12} className={isActive ? "text-primary" : "text-muted-foreground"} />}
                </div>
                <span className={`text-[10px] hidden md:inline ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && <div className="w-6 h-px bg-border hidden md:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
        <div className="max-w-xl mx-auto">
            {/* Step 1: Client Profile */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Step 1</p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Client Profile</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Tell us about yourself and your business.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 000 000 0000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Business Name *</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your company" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Business Type *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {businessTypes.map((bt) => {
                      const Icon = bt.icon;
                      return (
                        <button key={bt.value} onClick={() => setBusinessType(bt.value)}
                          className={`flex items-center gap-2.5 text-left text-xs px-3 py-3 border transition-all ${
                            businessType === bt.value ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          <Icon size={14} strokeWidth={1.5} />
                          {bt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional fields for registered company */}
                {businessType === "registered_company" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Company Registration Number</Label>
                      <Input value={companyRegNumber} onChange={(e) => setCompanyRegNumber(e.target.value)} placeholder="e.g. 2024/123456/07" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tax Reference Number</Label>
                      <Input value={taxReference} onChange={(e) => setTaxReference(e.target.value)} placeholder="e.g. 0123456789" />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Compliance & Identity */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Step 2</p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Compliance & Identity</h2>
                  <p className="mt-1 text-sm text-muted-foreground">We need to verify your identity for compliance purposes.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Identity Type *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {idTypes.map((t) => (
                      <button key={t.value} onClick={() => setIdType(t.value)}
                        className={`text-left text-xs px-3 py-3 border transition-all ${
                          idType === t.value ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {idType === "national_id" ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">ID Number *</Label>
                    <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="e.g. 8704125678091" maxLength={13} />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Passport Number *</Label>
                    <Input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} placeholder="e.g. A12345678" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Identity Document Upload</Label>
                  <div className="border border-dashed border-border p-6 text-center hover:border-primary/40 transition-colors">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="id-upload" />
                    <label htmlFor="id-upload" className="cursor-pointer space-y-2 block">
                      {identityFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="text-sm text-foreground">{identityFile.name}</span>
                          <Check size={14} className="text-emerald-500" />
                        </div>
                      ) : (
                        <>
                          <Upload size={20} className="mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Click to upload PDF, JPG, or PNG (max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Physical Address *</Label>
                  <Textarea value={physicalAddress} onChange={(e) => setPhysicalAddress(e.target.value)} placeholder="Street address, city, postal code" rows={3} />
                </div>

                {businessType !== "registered_company" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tax Reference Number</Label>
                    <Input value={taxReference} onChange={(e) => setTaxReference(e.target.value)} placeholder="e.g. 0123456789 (optional)" />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-2">Step 3</p>
                  <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Service Selection</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the services you need help with.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Services *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {serviceOptions.map((s) => (
                      <button key={s} onClick={() => toggleService(s)}
                        className={`flex items-center gap-2.5 text-left text-xs px-4 py-3 border transition-all ${
                          selectedServices.includes(s) ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                          selectedServices.includes(s) ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {selectedServices.includes(s) && <Check size={10} className="text-primary-foreground" />}
                        </div>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    What is the biggest operational challenge in your business right now?
                  </Label>
                  <Textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="Tell us about your biggest challenge..." rows={4} />
                </div>

                {/* Summary */}
                <div className="border border-border p-4 space-y-3">
                  <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Onboarding Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{fullName}</span></div>
                    <div><span className="text-muted-foreground">Business:</span> <span className="text-foreground">{businessName}</span></div>
                    <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground capitalize">{businessType.replace("_", " ")}</span></div>
                    <div><span className="text-muted-foreground">Services:</span> <span className="text-foreground">{selectedServices.length} selected</span></div>
                    <div><span className="text-muted-foreground">ID Doc:</span> <span className={identityFile ? "text-emerald-500" : "text-amber-500"}>{identityFile ? "Uploaded" : "Not uploaded"}</span></div>
                    <div><span className="text-muted-foreground">Address:</span> <span className={physicalAddress ? "text-emerald-500" : "text-amber-500"}>{physicalAddress ? "Provided" : "Missing"}</span></div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="gap-2 text-xs">
          <ArrowLeft size={14} /> Back
        </Button>
        <div className="flex items-center gap-3">
          {step < 2 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} className="gap-2 text-xs">
              Continue <ArrowRight size={14} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={saving || !canAdvance()} className="gap-2 text-xs">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? "Setting up workspace..." : "Complete Onboarding"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientOnboardingWizard;
