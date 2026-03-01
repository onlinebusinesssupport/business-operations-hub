import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Globe, Calendar, User, Building2, Eye, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type Stage = "all" | "new_inquiry" | "qualification" | "discovery" | "proposal" | "activation";

const stageConfig: Record<Exclude<Stage, "all">, { label: string; color: string }> = {
  new_inquiry: { label: "New Inquiry", color: "bg-primary/20 text-primary" },
  qualification: { label: "Qualification", color: "bg-accent text-foreground" },
  discovery: { label: "Discovery", color: "bg-primary/30 text-primary" },
  proposal: { label: "Proposal", color: "bg-foreground/10 text-foreground" },
  activation: { label: "Activated", color: "bg-foreground text-background" },
};

interface Lead {
  id: string;
  type: "contact" | "application";
  name: string;
  email: string;
  business: string;
  stage: Exclude<Stage, "all">;
  service_interest?: string;
  website?: string;
  created_at: string;
  raw: any;
}

const AdminLeadPipeline = () => {
  const [filter, setFilter] = useState<Stage>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: contacts = [] } = useQuery({
    queryKey: ["pipeline-contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["pipeline-applications"],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Map to unified leads
  const leads: Lead[] = [
    ...contacts.map((c: any) => ({
      id: `contact-${c.id}`,
      type: "contact" as const,
      name: c.name,
      email: c.email,
      business: c.company || "—",
      stage: "new_inquiry" as const,
      service_interest: c.service_interest,
      website: c.website,
      created_at: c.created_at,
      raw: c,
    })),
    ...applications.map((a: any) => ({
      id: `app-${a.id}`,
      type: "application" as const,
      name: a.full_name,
      email: a.email,
      business: a.business_name,
      stage: a.status === "approved" ? "activation" as const
        : a.status === "declined" ? "qualification" as const
        : "qualification" as const,
      service_interest: a.areas_of_support?.join(", "),
      website: a.website,
      created_at: a.created_at,
      raw: a,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = filter === "all" ? leads : leads.filter((l) => l.stage === filter);
  const selected = leads.find((l) => l.id === selectedId);

  // Stage counts
  const stageCounts = Object.keys(stageConfig).reduce((acc, key) => {
    acc[key] = leads.filter((l) => l.stage === key).length;
    return acc;
  }, {} as Record<string, number>);

  if (selected) {
    const r = selected.raw;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back to Pipeline
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{selected.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selected.business} · {selected.type === "application" ? "Application" : "Contact Form"}</p>
          </div>
          <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 ${stageConfig[selected.stage].color}`}>
            {stageConfig[selected.stage].label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-divider p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{selected.email}</span></div>
              {selected.website && <div className="flex justify-between"><span className="text-muted-foreground">Website</span><a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate ml-2">{selected.website}</a></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="text-foreground capitalize">{selected.type === "application" ? "Application Form" : "Contact Form"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{new Date(selected.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</span></div>
            </div>
          </div>

          <div className="bg-card border border-divider p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Interest</p>
            <div className="space-y-2 text-sm">
              {selected.service_interest && <div className="flex justify-between"><span className="text-muted-foreground">Services</span><span className="text-foreground">{selected.service_interest}</span></div>}
              {selected.type === "contact" && r.connect_preference && <div className="flex justify-between"><span className="text-muted-foreground">Prefers</span><span className="text-foreground capitalize">{r.connect_preference}</span></div>}
              {selected.type === "application" && r.industry && <div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span className="text-foreground">{r.industry}</span></div>}
              {selected.type === "application" && r.team_size && <div className="flex justify-between"><span className="text-muted-foreground">Team Size</span><span className="text-foreground">{r.team_size}</span></div>}
              {selected.type === "application" && r.revenue_range && <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-foreground">{r.revenue_range}</span></div>}
            </div>
          </div>
        </div>

        {(selected.type === "contact" && r.message) && (
          <div className="bg-card border border-divider p-5 space-y-2">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Message</p>
            <p className="text-sm text-foreground leading-relaxed">{r.message}</p>
          </div>
        )}

        {(selected.type === "application" && r.pain_points) && (
          <div className="bg-card border border-divider p-5 space-y-2">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Pain Points</p>
            <p className="text-sm text-foreground leading-relaxed">{r.pain_points}</p>
          </div>
        )}

        {(selected.type === "application" && r.intent) && (
          <div className="bg-card border border-divider p-5 space-y-2">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Intent Signal</p>
            <p className="text-sm text-foreground leading-relaxed">{r.intent}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl font-bold text-foreground">Lead Pipeline</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Unified view of all inbound interest — contact forms and applications.
        </p>
      </motion.div>

      {/* Stage funnel */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.entries(stageConfig) as [Exclude<Stage, "all">, typeof stageConfig[keyof typeof stageConfig]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? "all" : key)}
              className={`p-4 border transition-all text-left ${
                filter === key ? "border-primary bg-primary/5" : "border-divider bg-card hover:border-primary/30"
              }`}
            >
              <p className="font-display text-2xl font-bold text-foreground">{stageCounts[key] || 0}</p>
              <p className="text-[10px] font-medium tracking-[0.1em] text-muted-foreground uppercase mt-1">{cfg.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-1.5 border transition-all ${filter === "all" ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider hover:border-foreground/30"}`}>
            All ({leads.length})
          </button>
          {(Object.entries(stageConfig) as [Exclude<Stage, "all">, typeof stageConfig[keyof typeof stageConfig]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs px-3 py-1.5 border transition-all ${filter === key ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider hover:border-foreground/30"}`}
            >
              {cfg.label} ({stageCounts[key] || 0})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lead list */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.15 }}>
        {filtered.length === 0 ? (
          <div className="border border-divider p-8 text-center">
            <p className="text-sm text-muted-foreground">No leads in this stage.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider divide-y divide-divider">
            {filtered.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className="w-full p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">{lead.name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.business} · {lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {lead.service_interest && (
                    <span className="text-[10px] px-2 py-0.5 bg-accent text-foreground hidden md:block truncate max-w-[120px]">
                      {lead.service_interest}
                    </span>
                  )}
                  <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${stageConfig[lead.stage].color}`}>
                    {stageConfig[lead.stage].label}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:block">
                    {new Date(lead.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </span>
                  <Eye size={14} className="text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLeadPipeline;
