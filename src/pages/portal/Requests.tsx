import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Inbox, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const priorities = ["Low", "Medium", "High"];

const statusLabel: Record<string, string> = {
  new: "Open",
  in_progress: "In Progress",
  resolved: "Completed",
};

const Requests = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the client's ID
  const { data: clientId } = useQuery({
    queryKey: ["my-client-id"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_my_client_id");
      if (error) throw error;
      return data as string | null;
    },
  });

  // Fetch requests for this client
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["portal-requests", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createRequest = useMutation({
    mutationFn: async () => {
      if (!clientId || !user) throw new Error("Not linked to a client account");
      const { error } = await supabase.from("requests").insert({
        title: title.trim(),
        description: description.trim() || null,
        priority: priority.toLowerCase(),
        client_id: clientId,
        submitted_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portal-requests"] });
      toast({ title: "Request submitted", description: "Your team will review it shortly." });
      setTitle("");
      setDescription("");
      setPriority("Medium");
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createRequest.mutate();
  };

  return (
    <div className="space-y-8">
      <motion.div {...stagger} transition={{ duration: 0.3 }}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Requests</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Submit a new request or review previous submissions. Everything is tracked in one place.
        </p>
      </motion.div>

      {/* New request form */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.08 }}>
        <div className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-5">
            New Request
          </p>
          {!clientId && !isLoading ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 mx-auto border-2 border-primary/30 bg-primary/5 flex items-center justify-center animate-pulse">
                <Inbox size={22} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-foreground font-medium">Setting up your custom workspace</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                We're configuring your workspace based on your application — this takes just a moment. You'll be able to submit requests shortly.
              </p>
              <div className="flex justify-center">
                <div className="h-0.5 w-24 bg-border overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-primary rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-foreground block mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What do you need?"
                  required
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm text-foreground block mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide any relevant details..."
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
                <div>
                  <label className="text-sm text-foreground block mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                          priority === p
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground border-divider hover:border-foreground/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" size="sm" className="gap-2 text-xs rounded-lg" disabled={createRequest.isPending || !title.trim()}>
                  {createRequest.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Submit Request
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      {/* Previous requests */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
          Previous Requests
        </p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading...</p>
        ) : requests.length === 0 ? (
          <div className="border border-border p-8 text-center">
            <Inbox size={28} className="mx-auto text-muted-foreground mb-2" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          </div>
        ) : (
          <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
            {requests.map((r: any) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.priority} priority · {new Date(r.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg ${
                    r.status === "resolved"
                      ? "bg-accent text-muted-foreground"
                      : "bg-accent text-foreground"
                  }`}
                >
                  {statusLabel[r.status] || r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Requests;
