import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowRight, CheckCircle2, Clock, Mail, Loader2, X, Send } from "lucide-react";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const SERVICE_OPTIONS = [
  "Social Media Management", "Lead Generation", "Business Automation",
  "Executive Virtual Support", "Travel & Experiences", "Grants & Awards",
];

const AdminOnboardingQueue = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ full_name: "", email: "", company_name: "", services: [] as string[] });

  // Approved applications not yet converted to active clients
  const { data: approvedApps = [], isLoading: loadingApps } = useQuery({
    queryKey: ["onboarding-queue-apps"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "approved")
        .order("updated_at", { ascending: true }); // FCFS
      return data || [];
    },
  });

  // Onboarding clients (approved but not yet active)
  const { data: onboardingClients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["onboarding-queue-clients"],
    queryFn: async () => {
      const { data } = await supabase
        .from("clients")
        .select("*, profiles(full_name, email)")
        .eq("status", "onboarding")
        .order("created_at", { ascending: true }); // FCFS
      return data || [];
    },
  });

  const activateClient = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ status: "active", lifecycle_stage: "active" })
        .eq("id", clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-queue-clients"] });
      toast({ title: "Client activated", description: "Moved to active Partner Workspace." });
    },
  });

  const inviteCompany = useMutation({
    mutationFn: async (form: typeof inviteForm) => {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: {
          email: form.email,
          full_name: form.full_name,
          company_name: form.company_name,
          role: "client",
          services: form.services,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-queue-clients"] });
      toast({ title: "Invitation sent", description: data?.message || "The company will receive a signup link." });
      setShowInvite(false);
      setInviteForm({ full_name: "", email: "", company_name: "", services: [] });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const toggleService = (svc: string) => {
    setInviteForm((f) => ({
      ...f,
      services: f.services.includes(svc) ? f.services.filter((s) => s !== svc) : [...f.services, svc],
    }));
  };

  const isLoading = loadingApps || loadingClients;
  const queueItems = [
    ...onboardingClients.map((c: any) => ({ type: "client" as const, id: c.id, name: c.name, contact: c.profiles?.full_name || "—", email: c.profiles?.email || "", services: c.services || [], date: c.created_at })),
    ...approvedApps.map((a: any) => ({ type: "application" as const, id: a.id, name: a.business_name, contact: a.full_name, email: a.email, services: a.areas_of_support || [], date: a.updated_at })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // FCFS

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Onboarding Queue</h2>
          <p className="mt-1 text-sm text-muted-foreground">Approved leads and new clients awaiting activation. First come, first served.</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="gap-2 text-xs">
          <UserPlus size={14} /> Invite Company
        </Button>
      </motion.div>

      {/* Invite Company Form */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Invite a Company</p>
            <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <p className="text-xs text-muted-foreground">Enter the company details. They'll receive a signup link via email and go through the standard onboarding process.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Contact Name *</label>
              <input value={inviteForm.full_name} onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                placeholder="e.g. John Smith" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Email *</label>
              <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="email@company.com" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1.5">Company Name</label>
              <input value={inviteForm.company_name} onChange={(e) => setInviteForm({ ...inviteForm, company_name: e.target.value })}
                placeholder="e.g. Acme Ltd" className="w-full px-3 py-2 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1.5">Services</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((svc) => (
                  <button key={svc} type="button" onClick={() => toggleService(svc)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${inviteForm.services.includes(svc) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={() => inviteCompany.mutate(inviteForm)} disabled={inviteCompany.isPending || !inviteForm.full_name || !inviteForm.email} className="gap-2 text-xs">
            {inviteCompany.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Send Invitation
          </Button>
        </motion.div>
      )}

      {/* Queue */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading queue...</p>
        ) : queueItems.length === 0 ? (
          <div className="bg-card border border-divider p-12 text-center">
            <CheckCircle2 size={32} className="mx-auto text-primary/40 mb-3" />
            <p className="text-sm text-muted-foreground">No companies in the onboarding queue.</p>
            <p className="text-xs text-muted-foreground mt-1">Invite a company or approve an application to get started.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider divide-y divide-divider">
            <div className="grid grid-cols-12 gap-3 p-3 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              <span className="col-span-1">#</span>
              <span className="col-span-3">Company</span>
              <span className="col-span-2">Contact</span>
              <span className="col-span-2">Email</span>
              <span className="col-span-2">Services</span>
              <span className="col-span-2 text-right">Action</span>
            </div>
            {queueItems.map((item, i) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 p-3 items-center hover:bg-accent/30 transition-colors">
                <span className="col-span-1 text-xs text-muted-foreground font-medium">{i + 1}</span>
                <div className="col-span-3">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 ${item.type === "client" ? "bg-primary/10 text-primary" : "bg-accent text-foreground"}`}>
                    {item.type === "client" ? "Onboarding" : "Approved App"}
                  </span>
                </div>
                <p className="col-span-2 text-xs text-muted-foreground truncate">{item.contact}</p>
                <p className="col-span-2 text-xs text-muted-foreground truncate">{item.email}</p>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {item.services.slice(0, 2).map((s: string) => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 bg-accent text-foreground truncate max-w-[80px]">{s}</span>
                  ))}
                  {item.services.length > 2 && <span className="text-[9px] text-muted-foreground">+{item.services.length - 2}</span>}
                </div>
                <div className="col-span-2 flex justify-end">
                  {item.type === "client" ? (
                    <Button size="sm" onClick={() => activateClient.mutate(item.id)} className="gap-1.5 text-[11px] h-7">
                      <ArrowRight size={12} /> Activate
                    </Button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> Pending invite</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOnboardingQueue;
