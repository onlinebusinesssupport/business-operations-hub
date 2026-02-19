import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Plus } from "lucide-react";

const stagger = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

interface Client {
  id: string;
  name: string;
  status: "Active" | "Onboarding" | "Paused";
  services: string[];
  notes: string;
}

const clientsData: Client[] = [
  { id: "1", name: "Apex Ltd", status: "Active", services: ["Operations Support", "Executive Assistance"], notes: "Long-term retainer. Weekly check-ins on Fridays." },
  { id: "2", name: "Nova Co", status: "Active", services: ["Systems and Processes", "Business Coordination"], notes: "Scaling fast. Focus on reporting and vendor management." },
  { id: "3", name: "Meridian Group", status: "Active", services: ["Operations Support"], notes: "SOP documentation in progress." },
  { id: "4", name: "Vertex Partners", status: "Onboarding", services: ["Executive Assistance", "Business Coordination"], notes: "Discovery call completed. Setting up workspace." },
  { id: "5", name: "Helix Ventures", status: "Paused", services: ["Operations Support"], notes: "Paused until Q2. Follow up in March." },
  { id: "6", name: "Prism Digital", status: "Active", services: ["Systems and Processes", "Operations Support"], notes: "Monthly reporting cycle. Template delivered." },
];

const statusStyles: Record<string, string> = {
  Active: "bg-foreground text-background",
  Onboarding: "bg-accent text-foreground",
  Paused: "bg-accent text-muted-foreground",
};

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filtered = clientsData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedClient) {
    return (
      <div className="space-y-6">
        <motion.div {...stagger} transition={{ duration: 0.3 }}>
          <button
            onClick={() => setSelectedClient(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            Back to Clients
          </button>
          <h2 className="font-serif text-2xl text-foreground">{selectedClient.name}</h2>
          <span className={`inline-block text-xs px-2.5 py-1 rounded-lg mt-2 ${statusStyles[selectedClient.status]}`}>
            {selectedClient.status}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="bg-card border border-divider rounded-xl p-6">
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Services Assigned</p>
            <div className="flex flex-wrap gap-2">
              {selectedClient.services.map((s) => (
                <span key={s} className="text-xs bg-accent text-foreground px-3 py-1.5 rounded-lg">{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="bg-card border border-divider rounded-xl p-6">
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Notes</p>
            <p className="text-sm text-foreground leading-relaxed">{selectedClient.notes}</p>
          </motion.div>
        </div>

        <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="bg-card border border-divider rounded-xl p-6">
          <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-4">Quick Actions</p>
          <div className="flex gap-3">
            <button className="text-xs bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">View Portal</button>
            <button className="text-xs bg-accent text-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors">Add Work Item</button>
            <button className="text-xs bg-accent text-foreground px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors">Send Update</button>
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
        <button className="flex items-center gap-2 text-xs bg-foreground text-background px-4 py-2.5 rounded-lg hover:bg-foreground/90 transition-colors">
          <Plus size={14} /> Add Client
        </button>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-card border border-divider rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </motion.div>

      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="w-full p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground">{client.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${statusStyles[client.status]}`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {client.services.join(" · ")}
                </p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminClients;
