import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, Pause, TrendingUp, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const automations = [
  { name: "Weekly Digest Pipeline", status: "Live", runs: 24, lastRun: "2h ago" },
  { name: "Lead Notification Trigger", status: "Live", runs: 156, lastRun: "15min ago" },
  { name: "Invoice Reminder Sequence", status: "Paused", runs: 8, lastRun: "5 days ago" },
  { name: "Onboarding Email Flow", status: "Live", runs: 42, lastRun: "1h ago" },
];

const performanceMetrics = [
  { label: "Total Runs", value: "—" },
  { label: "Success Rate", value: "—" },
  { label: "Time Saved", value: "—" },
  { label: "Active Workflows", value: "—" },
];

const AutomationStudio = () => {
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqTitle("");
    setReqDesc("");
  };

  return (
    <div className="space-y-10">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <Link to="/portal/active-work" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-[0.1em] mb-4 transition-colors">
          <ArrowLeft size={12} /> Studios
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              Automation Studio
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 bg-amber-500/10 text-amber-600">
            Building
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Live automation pipelines, workflow orchestration, and performance monitoring.
        </p>
      </motion.div>

      <Tabs defaultValue="automations" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="automations" className="text-xs tracking-wide">Live Automations</TabsTrigger>
          <TabsTrigger value="workflows" className="text-xs tracking-wide">Workflow Builder</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs tracking-wide">Performance</TabsTrigger>
          <TabsTrigger value="request" className="text-xs tracking-wide">Request New</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="mt-6 space-y-3">
          {automations.map((auto, i) => (
            <motion.div
              key={auto.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="border border-border p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {auto.status === "Live" ? (
                  <Play size={14} className="text-primary shrink-0" strokeWidth={2} />
                ) : (
                  <Pause size={14} className="text-muted-foreground shrink-0" strokeWidth={2} />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{auto.name}</p>
                  <p className="text-[11px] text-muted-foreground">{auto.runs} runs · Last: {auto.lastRun}</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                auto.status === "Live" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {auto.status}
              </span>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          <div className="border border-border p-12 flex flex-col items-center justify-center text-center">
            <Zap size={32} className="text-muted-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Workflow builder coming soon.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Visual workflow design will be available here.</p>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {performanceMetrics.map((m) => (
              <div key={m.label} className="border border-border p-5">
                <TrendingUp size={14} className="text-muted-foreground mb-3" strokeWidth={1.5} />
                <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="request" className="mt-6">
          <div className="border border-border p-6 max-w-xl">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-5">
              Request New Automation
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-foreground block mb-1.5">Automation Name</label>
                <input
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Weekly report digest"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm text-foreground block mb-1.5">Description</label>
                <textarea
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe what this automation should do..."
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <Button type="submit" size="sm" className="gap-2 text-xs">
                <Send size={14} /> Submit Request
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationStudio;
