import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Globe, FileText, Plus, Trash2, GripVertical, Save, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import portraitImg from "@/assets/portrait.png";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const DEFAULT_TASKS = [
  { title: "Complete your profile setup", description: "Fill in your personal and business details so your team can get started.", priority: "high" },
  { title: "Review your active studios", description: "Explore the studios assigned to your workspace and understand what's included.", priority: "medium" },
  { title: "Submit your first request", description: "Use the Requests module to tell your team what you need first.", priority: "medium" },
  { title: "Upload key brand assets", description: "Share logos, brand guidelines, or any files your team will need.", priority: "low" },
];

interface OnboardingTask {
  title: string;
  description: string;
  priority: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch existing template
  const { data: templateData, isLoading: templateLoading } = useQuery({
    queryKey: ["onboarding-template"],
    queryFn: async () => {
      const { data } = await supabase
        .from("onboarding_templates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [brandName, setBrandName] = useState("THE BUSINESS SUPPORT STUDIO™");
  const [vaMode, setVaMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize from DB or defaults
  if (!initialized && !templateLoading) {
    if (templateData) {
      const dbTasks = (templateData as any).tasks;
      setTasks(Array.isArray(dbTasks) && dbTasks.length > 0 ? dbTasks : DEFAULT_TASKS);
      setBrandName((templateData as any).brand_name || "THE BUSINESS SUPPORT STUDIO™");
      setVaMode((templateData as any).va_mode || false);
    } else {
      setTasks(DEFAULT_TASKS);
    }
    setInitialized(true);
  }

  const saveTemplate = useMutation({
    mutationFn: async () => {
      const payload = {
        tasks: tasks as any,
        brand_name: brandName,
        va_mode: vaMode,
        created_by: user?.id || null,
        updated_at: new Date().toISOString(),
      };

      if (templateData) {
        const { error } = await supabase
          .from("onboarding_templates")
          .update(payload as any)
          .eq("id", (templateData as any).id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("onboarding_templates")
          .insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-template"] });
      toast.success("Onboarding template saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", priority: "medium" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: keyof OnboardingTask, value: string) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  };

  const resetToDefaults = () => {
    setTasks(DEFAULT_TASKS);
    setBrandName("THE BUSINESS SUPPORT STUDIO™");
    setVaMode(false);
    toast.info("Reset to defaults — save to apply");
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Admin configuration and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="border border-border p-6">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
          <User size={14} strokeWidth={1.5} /> Profile
        </p>
        <div className="flex items-center gap-4">
          <img src={portraitImg} alt="Manager" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-foreground">Dylan</p>
            <p className="text-xs text-muted-foreground">thequitehelpinghand@gmail.com</p>
            <p className="text-xs text-muted-foreground">Operations Manager</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="border border-border p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
            <Bell size={14} strokeWidth={1.5} /> Notifications
          </p>
          <div className="space-y-4">
            {[
              { label: "New client requests", enabled: true },
              { label: "Work item deadlines", enabled: true },
              { label: "Weekly summary", enabled: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{n.label}</span>
                <div className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${n.enabled ? "bg-foreground" : "bg-accent"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${n.enabled ? "translate-x-4 bg-background" : "translate-x-0.5 bg-muted-foreground"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="border border-border p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
            <Shield size={14} strokeWidth={1.5} /> Security
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              <button className="text-xs text-foreground underline mt-1">Change password</button>
            </div>
            <div>
              <p className="text-sm text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Not enabled</p>
              <button className="text-xs text-foreground underline mt-1">Enable 2FA</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Onboarding Templates */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }} className="border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase flex items-center gap-2">
            <FileText size={14} strokeWidth={1.5} /> Onboarding Templates
          </p>
          <div className="flex items-center gap-2">
            <button onClick={resetToDefaults} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline">
              Reset defaults
            </button>
          </div>
        </div>

        {/* VA Mode toggle */}
        <div className="flex items-center justify-between border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">VA Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customise branding for your own VA business. Replaces "SUPPORT STUDIO™" throughout onboarding.
            </p>
          </div>
          <button onClick={() => setVaMode(!vaMode)} className="text-foreground">
            {vaMode ? <ToggleRight size={28} className="text-primary" /> : <ToggleLeft size={28} className="text-muted-foreground" />}
          </button>
        </div>

        {/* Brand name (visible when VA mode is on) */}
        {vaMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Brand Name</Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="YOUR BRAND NAME™"
              className="bg-card border-border"
            />
            <p className="text-[10px] text-muted-foreground">This replaces all brand references in the onboarding wizard.</p>
          </motion.div>
        )}

        {/* Task list */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            These tasks are automatically created for every new client on approval. Drag to reorder, edit inline.
          </p>
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-border p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <GripVertical size={14} className="text-muted-foreground mt-2 shrink-0 cursor-grab" />
                <div className="flex-1 space-y-3">
                  <Input
                    value={task.title}
                    onChange={(e) => updateTask(index, "title", e.target.value)}
                    placeholder="Task title"
                    className="bg-card border-border text-sm font-medium"
                  />
                  <Input
                    value={task.description}
                    onChange={(e) => updateTask(index, "description", e.target.value)}
                    placeholder="Task description"
                    className="bg-card border-border text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">Priority</Label>
                    <div className="flex gap-1">
                      {["low", "medium", "high"].map((p) => (
                        <button
                          key={p}
                          onClick={() => updateTask(index, "priority", p)}
                          className={`text-[10px] px-2 py-1 border transition-all capitalize ${
                            task.priority === p
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeTask(index)} className="text-muted-foreground hover:text-destructive transition-colors mt-2 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}

          <button
            onClick={addTask}
            className="w-full border border-dashed border-border p-3 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={12} /> Add Task
          </button>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] text-muted-foreground">
            {templateData ? "Last saved: " + new Date((templateData as any).updated_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "Not yet saved"}
          </p>
          <Button
            onClick={() => saveTemplate.mutate()}
            disabled={saveTemplate.isPending}
            size="sm"
            className="text-xs tracking-wide gap-2"
          >
            {saveTemplate.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save Template
          </Button>
        </div>
      </motion.div>

      {/* Platform */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.25 }} className="border border-border p-6">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5 flex items-center gap-2">
          <Globe size={14} strokeWidth={1.5} /> Platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-foreground">Platform</p>
            <p className="text-xs text-muted-foreground">The Business Support Studio</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Version</p>
            <p className="text-xs text-muted-foreground">2.1.0</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Environment</p>
            <p className="text-xs text-muted-foreground">Production</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
