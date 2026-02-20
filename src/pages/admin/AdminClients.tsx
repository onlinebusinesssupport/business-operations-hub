import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Plus, ArrowLeft, Loader2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusStyles: Record<string, string> = {
  active: "bg-foreground text-background",
  onboarding: "bg-accent text-foreground",
  paused: "bg-accent text-muted-foreground",
};

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", full_name: "", company_name: "", services: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, profiles:contact_profile_id(full_name, email, phone, company_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (form: typeof inviteForm) => {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: {
          email: form.email,
          full_name: form.full_name,
          company_name: form.company_name,
          role: "client",
          services: form.services ? form.services.split(",").map((s) => s.trim()) : [],
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast({ title: "Client invited", description: data?.message });
      setShowInvite(false);
      setInviteForm({ email: "", full_name: "", company_name: "", services: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Invite failed", description: err.message, variant: "destructive" });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("clients").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      toast({ title: "Status updated" });
    },
  });

  const filtered = clients.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.profiles?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const selected = clients.find((c: any) => c.id === selectedId);

  if (selected) {
    const profile = (selected as any).profiles;
    return (
      <div className="space-y-6">
        <motion.div {...stagger} transition={{ duration: 0.3 }}>
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Clients
          </button>
          <h2 className="font-serif text-2xl text-foreground">{selected.name}</h2>
          <span className={`inline-block text-xs px-2.5 py-1 rounded-lg mt-2 capitalize ${statusStyles[selected.status] || statusStyles.onboarding}`}>
            {selected.status}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="bg-card border border-divider rounded-xl p-6">
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{profile?.full_name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{profile?.email || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{profile?.phone || "—"}</span></div>
            </div>
          </motion.div>

          <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="bg-card border border-divider rounded-xl p-6">
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Services</p>
            <div className="flex flex-wrap gap-2">
              {(selected.services || []).map((s: string) => (
                <span key={s} className="text-xs bg-accent text-foreground px-3 py-1.5 rounded-lg">{s}</span>
              ))}
              {(!selected.services || selected.services.length === 0) && (
                <span className="text-xs text-muted-foreground">No services assigned</span>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Notes</p>
          <p className="text-sm text-foreground leading-relaxed">{selected.notes || "No notes yet."}</p>
        </motion.div>

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Actions</p>
          <div className="flex gap-3 flex-wrap">
            {selected.status !== "active" && (
              <Button size="sm" onClick={() => updateStatus.mutate({ id: selected.id, status: "active" })}>
                Set Active
              </Button>
            )}
            {selected.status !== "paused" && (
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "paused" })}>
                Pause
              </Button>
            )}
            {selected.status !== "onboarding" && (
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: selected.id, status: "onboarding" })}>
                Set Onboarding
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your client database.</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="gap-2 text-xs">
          <Plus size={14} /> Invite Client
        </Button>
      </motion.div>

      {/* Invite dialog */}
      {showInvite && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-divider rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Invite New Client</p>
            <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Full Name *</label>
              <input value={inviteForm.full_name} onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Email *</label>
              <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Company Name</label>
              <input value={inviteForm.company_name} onChange={(e) => setInviteForm({ ...inviteForm, company_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Services (comma-separated)</label>
              <input value={inviteForm.services} onChange={(e) => setInviteForm({ ...inviteForm, services: e.target.value })} placeholder="Operations, Automation" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <Button onClick={() => inviteMutation.mutate(inviteForm)} disabled={inviteMutation.isPending || !inviteForm.email || !inviteForm.full_name} className="gap-2 text-xs">
            {inviteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {inviteMutation.isPending ? "Sending..." : "Send Invite"}
          </Button>
        </motion.div>
      )}

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="w-full bg-card border border-divider rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8">Loading clients...</p>
        ) : filtered.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No clients found. Invite your first client above.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {filtered.map((client: any) => (
              <button key={client.id} onClick={() => setSelectedId(client.id)} className="w-full p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-foreground">{client.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${statusStyles[client.status] || statusStyles.onboarding}`}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {client.profiles?.email || "No contact"} · {(client.services || []).join(" · ") || "No services"}
                  </p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminClients;
