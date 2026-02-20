import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  ListChecks,
  FileText,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  Download,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/* Placeholder data — will connect to backend */
const tasks = [
  { title: "Update onboarding checklist", status: "In Progress", priority: "High", progress: 65 },
  { title: "Weekly client reporting", status: "In Progress", priority: "Medium", progress: 40 },
  { title: "Vendor agreement review", status: "Completed", priority: "Low", progress: 100 },
  { title: "Process documentation v2", status: "In Review", priority: "Medium", progress: 90 },
];

const sopFiles = [
  { name: "Client Onboarding Procedure.pdf", date: "28 Jan 2026" },
  { name: "Daily Operations Checklist.pdf", date: "25 Jan 2026" },
  { name: "Escalation Protocol.pdf", date: "20 Jan 2026" },
  { name: "Communication Standards.pdf", date: "15 Jan 2026" },
];

const workflows = [
  { name: "Client Onboarding", steps: 6, status: "Active" },
  { name: "Weekly Reporting", steps: 4, status: "Active" },
  { name: "Vendor Management", steps: 5, status: "Draft" },
  { name: "Escalation Flow", steps: 3, status: "Active" },
];

const OperationsStudio = () => {
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqPriority, setReqPriority] = useState("Medium");
  const [sopSearch, setSopSearch] = useState("");

  const filteredSops = sopSearch
    ? sopFiles.filter((f) => f.name.toLowerCase().includes(sopSearch.toLowerCase()))
    : sopFiles;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setReqTitle("");
    setReqDesc("");
    setReqPriority("Medium");
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <Link to="/portal/active-work" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-[0.1em] mb-4 transition-colors">
          <ArrowLeft size={12} /> Studios
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-muted-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">
              Operations Studio
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium px-3 py-1 bg-amber-500/10 text-amber-600">
            Building
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg">
          Centralised task management, standard operating procedures, and operational workflows.
        </p>
      </motion.div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="tasks" className="text-xs tracking-wide">Tasks</TabsTrigger>
          <TabsTrigger value="sops" className="text-xs tracking-wide">SOP Library</TabsTrigger>
          <TabsTrigger value="requests" className="text-xs tracking-wide">Requests</TabsTrigger>
          <TabsTrigger value="workflows" className="text-xs tracking-wide">Workflows</TabsTrigger>
        </TabsList>

        {/* Tasks */}
        <TabsContent value="tasks" className="mt-6 space-y-4">
          {tasks.map((task, i) => (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="border border-border p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                {task.status === "Completed" ? (
                  <CheckCircle2 size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                ) : (
                  <Clock size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{task.title}</p>
                  <p className="text-[11px] text-muted-foreground">{task.status} · {task.priority}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Progress value={task.progress} className="w-20 h-1.5" />
                <span className="text-xs text-muted-foreground w-8 text-right">{task.progress}%</span>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* SOP Library */}
        <TabsContent value="sops" className="mt-6 space-y-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search SOPs..."
              value={sopSearch}
              onChange={(e) => setSopSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="border border-border divide-y divide-border">
            {filteredSops.map((file) => (
              <div key={file.name} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.date}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Download size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))}
            {filteredSops.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground text-center">No SOPs found.</p>
            )}
          </div>
        </TabsContent>

        {/* Requests */}
        <TabsContent value="requests" className="mt-6">
          <div className="border border-border p-6">
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-5">
              Submit Request
            </p>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="text-sm text-foreground block mb-1.5">Title</label>
                <input
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="What do you need?"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm text-foreground block mb-1.5">Description</label>
                <textarea
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  rows={3}
                  placeholder="Provide details..."
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <label className="text-sm text-foreground block mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setReqPriority(p)}
                        className={`text-xs px-3 py-1.5 border transition-colors ${
                          reqPriority === p
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" size="sm" className="gap-2 text-xs">
                  <Send size={14} /> Submit
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Workflows */}
        <TabsContent value="workflows" className="mt-6 space-y-3">
          {workflows.map((wf, i) => (
            <motion.div
              key={wf.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="border border-border p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <ListChecks size={16} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-foreground">{wf.name}</p>
                  <p className="text-[11px] text-muted-foreground">{wf.steps} steps</p>
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${
                wf.status === "Active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {wf.status}
              </span>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperationsStudio;
