import { motion } from "framer-motion";
import { Target, TrendingUp, Megaphone, BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const pipelineColumns = [
  {
    name: "New",
    leads: [
      { name: "Acme Corp", value: "$12,000", source: "Referral" },
      { name: "Bright Labs", value: "$8,500", source: "LinkedIn" },
    ],
  },
  {
    name: "Qualified",
    leads: [
      { name: "Vertex Inc", value: "$22,000", source: "Inbound" },
    ],
  },
  {
    name: "Proposal",
    leads: [
      { name: "Nova Group", value: "$15,000", source: "Referral" },
      { name: "Peak Digital", value: "$9,000", source: "Website" },
    ],
  },
  {
    name: "Closed",
    leads: [
      { name: "Summit Co", value: "$18,500", source: "LinkedIn" },
    ],
  },
];

const campaigns = [
  { name: "Q1 LinkedIn Outreach", status: "Active", leads: 24 },
  { name: "Email Nurture Sequence", status: "Active", leads: 156 },
  { name: "Referral Programme", status: "Draft", leads: 0 },
];

const conversionMetrics = [
  { label: "Total Leads", value: "—" },
  { label: "Conversion Rate", value: "—" },
  { label: "Pipeline Value", value: "—" },
  { label: "Avg Deal Size", value: "—" },
];

const LeadEngineStudio = () => {
  return (
    <div className="space-y-10">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <Link to="/portal/active-work" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-[0.1em] mb-4 transition-colors">
          <ArrowLeft size={12} /> Studios
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              Lead Engine Studio
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 bg-secondary text-muted-foreground">
            Inactive
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Pipeline management, campaign tracking, and lead conversion infrastructure.
        </p>
      </motion.div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="pipeline" className="text-xs tracking-wide">Pipeline</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs tracking-wide">Campaigns</TabsTrigger>
          <TabsTrigger value="sources" className="text-xs tracking-wide">Lead Sources</TabsTrigger>
          <TabsTrigger value="conversion" className="text-xs tracking-wide">Conversion</TabsTrigger>
        </TabsList>

        {/* Pipeline Kanban */}
        <TabsContent value="pipeline" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {pipelineColumns.map((col) => (
              <div key={col.name} className="border border-border">
                <div className="p-3 border-b border-border">
                  <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
                    {col.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{col.leads.length} leads</p>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {col.leads.map((lead) => (
                    <div key={lead.name} className="bg-background border border-border p-3 hover:border-primary/30 transition-colors cursor-pointer">
                      <p className="text-sm text-foreground font-medium">{lead.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">{lead.source}</span>
                        <span className="text-xs text-foreground font-medium">{lead.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="mt-6 space-y-3">
          {campaigns.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="border border-border p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Megaphone size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.leads} leads generated</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                c.status === "Active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {c.status}
              </span>
            </motion.div>
          ))}
        </TabsContent>

        {/* Lead Sources */}
        <TabsContent value="sources" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <BarChart3 size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Lead source analytics coming soon.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Breakdown by channel will appear here once data is collected.</p>
          </div>
        </TabsContent>

        {/* Conversion */}
        <TabsContent value="conversion" className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {conversionMetrics.map((m) => (
              <div key={m.label} className="border border-border p-5">
                <TrendingUp size={14} className="text-muted-foreground mb-3" strokeWidth={1.5} />
                <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadEngineStudio;
