import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KanbanBoard, KanbanColumn } from "@/components/KanbanBoard";
import InlineEdit from "@/components/InlineEdit";
import { logActivity } from "@/lib/activity";

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type PipelineStage = "new_inquiry" | "qualification" | "discovery" | "proposal" | "won";

const stageConfig: Record<PipelineStage, { label: string; dotColor: string; bgColor: string }> = {
  new_inquiry: { label: "New Inquiry", dotColor: "bg-blue-500", bgColor: "bg-blue-500/10" },
  qualification: { label: "Qualification", dotColor: "bg-amber-500", bgColor: "bg-amber-500/10" },
  discovery: { label: "Discovery", dotColor: "bg-purple-500", bgColor: "bg-purple-500/10" },
  proposal: { label: "Proposal", dotColor: "bg-primary", bgColor: "bg-primary/10" },
  won: { label: "Won", dotColor: "bg-emerald-500", bgColor: "bg-emerald-500/10" },
};

const stages: PipelineStage[] = ["new_inquiry", "qualification", "discovery", "proposal", "won"];

interface PipelineLead {
  id: string;
  db_id: string;
  type: "contact" | "application";
  name: string;
  email: string;
  business: string;
  stage: PipelineStage;
  service_interest?: string;
  website?: string;
  notes?: string;
  created_at: string;
  raw: any;
}

const AdminLeadPipeline = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const appStageMap = (status: string): PipelineStage => {
    switch (status) {
      case "approved": return "won";
      case "declined": return "qualification";
      case "in_review": return "discovery";
      case "proposal": return "proposal";
      default: return "qualification";
    }
  };

  const leads: PipelineLead[] = [
    ...contacts.map((c: any) => ({
      id: `contact-${c.id}`, db_id: c.id, type: "contact" as const,
      name: c.name, email: c.email, business: c.company || "—",
      stage: "new_inquiry" as PipelineStage, service_interest: c.service_interest,
      website: c.website, notes: c.message, created_at: c.created_at, raw: c,
    })),
    ...applications.map((a: any) => ({
      id: `app-${a.id}`, db_id: a.id, type: "application" as const,
      name: a.full_name, email: a.email, business: a.business_name,
      stage: appStageMap(a.status), service_interest: a.areas_of_support?.join(", "),
      website: a.website, notes: a.admin_notes || a.pain_points,
      created_at: a.created_at, raw: a,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const columns: KanbanColumn<PipelineLead>[] = stages.map((stage) => ({
    id: stage, title: stageConfig[stage].label, color: stageConfig[stage].dotColor,
    items: leads.filter((l) => l.stage === stage),
  }));

  const updateStage = useMutation({
    mutationFn: async ({ lead, newStage }: { lead: PipelineLead; newStage: PipelineStage }) => {
      if (lead.type === "application") {
        const statusMap: Record<PipelineStage, string> = {
          new_inquiry: "pending", qualification: "pending", discovery: "in_review",
          proposal: "proposal", won: "approved",
        };
        const { error } = await supabase.from("applications").update({ status: statusMap[newStage] }).eq("id", lead.db_id);
        if (error) throw error;
      }
      await logActivity({
        action: "drag",
        entity_type: "lead",
        entity_id: lead.db_id,
        details: { summary: `Moved "${lead.business}" → ${stageConfig[newStage].label}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["pipeline-applications"] });
    },
  });

  const activateClient = useMutation({
    mutationFn: async (lead: PipelineLead) => {
      const { data: newClient, error: clientErr } = await supabase.from("clients").insert({
        name: lead.business !== "—" ? lead.business : lead.name,
        status: "active",
        services: lead.service_interest ? lead.service_interest.split(",").map(s => s.trim()) : ["Operations"],
        notes: `Auto-created from ${lead.type} pipeline. Contact: ${lead.email}`,
      }).select("id").single();
      if (clientErr) throw clientErr;

      const onboardingTasks = [
        { title: "Welcome & Orientation", description: "Initial welcome call and workspace setup", priority: "high", status: "to_do" },
        { title: "Discovery Audit", description: "Conduct initial audit of current operations", priority: "high", status: "to_do" },
        { title: "Strategy Development", description: "Develop initial strategy and roadmap", priority: "medium", status: "to_do" },
        { title: "First Deliverable", description: "Prepare and deliver first milestone", priority: "medium", status: "to_do" },
      ];
      for (const task of onboardingTasks) {
        await supabase.from("work_items").insert({ ...task, client_id: newClient.id });
      }
      await supabase.from("updates").insert({
        client_id: newClient.id,
        content: `Welcome to SUPPORT STUDIO™. ${lead.business !== "—" ? lead.business : lead.name} has been activated.`,
        update_type: "progress",
      });
      await logActivity({
        client_id: newClient.id,
        action: "created",
        entity_type: "client",
        entity_id: newClient.id,
        details: { summary: `Client "${lead.business}" activated from pipeline` },
      });
      return newClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overview-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-work-items"] });
      toast({ title: "Client Activated ✨", description: "Workspace created. Onboarding tasks generated." });
    },
    onError: (err: Error) => toast({ title: "Activation failed", description: err.message, variant: "destructive" }),
  });

  const handleDragEnd = useCallback((itemId: string, sourceColumn: string, destColumn: string) => {
    if (sourceColumn === destColumn) return;
    const lead = leads.find((l) => l.id === itemId);
    if (!lead) return;
    const newStage = destColumn as PipelineStage;
    updateStage.mutate({ lead, newStage });
    if (newStage === "won" && sourceColumn !== "won") activateClient.mutate(lead);
    toast({ title: "Stage updated", description: `${lead.name} moved to ${stageConfig[newStage].label}` });
  }, [leads, updateStage, activateClient, toast]);

  const handleInlineUpdate = useCallback(async (lead: PipelineLead, field: string, value: string) => {
    if (lead.type === "application") {
      const updateData: any = {};
      if (field === "business") updateData.business_name = value;
      if (field === "notes") updateData.admin_notes = value;
      if (Object.keys(updateData).length > 0) {
        await supabase.from("applications").update(updateData).eq("id", lead.db_id);
        queryClient.invalidateQueries({ queryKey: ["pipeline-applications"] });
        await logActivity({
          action: "field_edit",
          entity_type: "lead",
          entity_id: lead.db_id,
          details: { summary: `Updated ${field} on "${lead.business}"`, field, new_value: value },
        });
      }
    }
  }, [queryClient]);

  const selected = leads.find((l) => l.id === selectedId);

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
          <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 ${stageConfig[selected.stage].bgColor}`}>
            {stageConfig[selected.stage].label}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-divider p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{selected.email}</span></div>
              {selected.website && <div className="flex justify-between"><span className="text-muted-foreground">Website</span><a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate ml-2">{selected.website}</a></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="text-foreground capitalize">{selected.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{new Date(selected.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}</span></div>
            </div>
          </div>
          <div className="bg-card border border-divider p-5 space-y-3">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Interest</p>
            <div className="space-y-2 text-sm">
              {selected.service_interest && <div className="flex justify-between"><span className="text-muted-foreground">Services</span><span className="text-foreground">{selected.service_interest}</span></div>}
              {selected.type === "application" && r.industry && <div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span className="text-foreground">{r.industry}</span></div>}
              {selected.type === "application" && r.revenue_range && <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-foreground">{r.revenue_range}</span></div>}
            </div>
          </div>
        </div>
        {selected.notes && (
          <div className="bg-card border border-divider p-5 space-y-2">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">Notes</p>
            <p className="text-sm text-foreground leading-relaxed">{selected.notes}</p>
          </div>
        )}
      </div>
    );
  }

  const totalLeads = leads.length;
  const wonCount = leads.filter(l => l.stage === "won").length;

  return (
    <div className="space-y-6">
      <motion.div {...fade} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Lead Pipeline</h2>
            <p className="mt-1 text-sm text-muted-foreground">Drag leads across stages. Drop into "Won" to auto-activate.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-foreground">{totalLeads}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Leads</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-primary">{wonCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Won</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }}>
        <KanbanBoard
          columns={columns}
          onDragEnd={handleDragEnd}
          getItemId={(lead) => lead.id}
          renderCard={(lead, isDragging) => (
            <div
              className={`bg-card border border-divider p-4 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                isDragging ? "rotate-1 scale-[1.02]" : "hover:border-primary/30"
              }`}
              onClick={() => !isDragging && setSelectedId(lead.id)}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{lead.name[0]}</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{lead.type}</span>
              </div>
              <div className="text-sm font-medium text-foreground truncate">
                {lead.type === "application" ? (
                  <InlineEdit value={lead.business} onSave={(v) => handleInlineUpdate(lead, "business", v)} className="text-sm font-medium" placeholder="Company name" />
                ) : (
                  lead.business !== "—" ? lead.business : lead.name
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 truncate">{lead.name} · {lead.email}</p>
              {lead.service_interest && (
                <div className="mt-2">
                  <span className="text-[9px] px-1.5 py-0.5 bg-accent text-foreground uppercase tracking-wider truncate inline-block max-w-full">
                    {lead.service_interest.split(",")[0].trim()}
                  </span>
                </div>
              )}
              {lead.type === "application" && (
                <div className="mt-2">
                  <InlineEdit value={lead.notes || ""} onSave={(v) => handleInlineUpdate(lead, "notes", v)} className="text-[11px] text-muted-foreground" placeholder="Add notes..." multiline />
                </div>
              )}
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                {new Date(lead.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
              </p>
              {lead.stage === "won" && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <Sparkles size={10} /> Activated
                </div>
              )}
            </div>
          )}
        />
      </motion.div>
    </div>
  );
};

export default AdminLeadPipeline;
