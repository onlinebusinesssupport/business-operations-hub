import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const priorities = ["Low", "Medium", "High"];

const existingRequests = [
  { title: "Update weekly report format", priority: "Medium", date: "12 Feb", status: "In progress" },
  { title: "Add vendor to contact list", priority: "Low", date: "10 Feb", status: "Completed" },
  { title: "Prepare board meeting notes", priority: "High", date: "8 Feb", status: "Completed" },
];

const Requests = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — will connect to backend
    setTitle("");
    setDescription("");
    setPriority("Medium");
  };

  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">Requests</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-lg">
          Submit a new request or review what's already been raised. Everything
          is tracked in one place.
        </p>
      </motion.div>

      {/* New request form */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
        <div className="bg-background border border-divider rounded-md p-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
            New Request
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-foreground block mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need?"
                className="w-full bg-secondary border border-divider rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide any relevant details..."
                className="w-full bg-secondary border border-divider rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
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
                      className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                        priority === p
                          ? "bg-foreground text-background border-foreground"
                          : "bg-secondary text-muted-foreground border-divider hover:border-foreground/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" size="sm" className="gap-2 text-xs">
                <Send size={14} />
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Previous requests */}
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }}>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Previous Requests
        </h3>
        <div className="bg-background border border-divider rounded-md divide-y divide-divider">
          {existingRequests.map((r) => (
            <div key={r.title} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.priority} priority · {r.date}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-sm ${
                  r.status === "Completed"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-foreground/5 text-foreground"
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Requests;
