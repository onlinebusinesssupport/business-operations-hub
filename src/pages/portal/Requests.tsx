import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
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
    setTitle("");
    setDescription("");
    setPriority("Medium");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-foreground block mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need?"
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
              <Button type="submit" size="sm" className="gap-2 text-xs rounded-lg">
                <Send size={14} />
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Previous requests */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }}>
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">
          Previous Requests
        </p>
        <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
          {existingRequests.map((r) => (
            <div key={r.title} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.priority} priority · {r.date}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-lg ${
                  r.status === "Completed"
                    ? "bg-accent text-muted-foreground"
                    : "bg-accent text-foreground"
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
