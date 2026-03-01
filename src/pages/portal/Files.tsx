import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, FolderOpen, Upload, Inbox, Search, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const categoryLabel: Record<string, string> = {
  shared: "Shared by SUPPORT STUDIO™",
  report: "Reports",
  contract: "Contracts & Agreements",
  deliverable: "Deliverables",
  uploaded: "Uploaded by You",
};

const Files = () => {
  const [search, setSearch] = useState("");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["portal-files"],
    queryFn: async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = search
    ? documents.filter((d: any) => d.name.toLowerCase().includes(search.toLowerCase()))
    : documents;

  // Group by category
  const grouped = filtered.reduce((acc: Record<string, any[]>, doc: any) => {
    const cat = doc.category || "shared";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <div className="space-y-10">
      <motion.div {...fade} transition={{ duration: 0.4 }}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Files
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
          All shared documents, deliverables, and reference materials in one place.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div {...fade} transition={{ duration: 0.3, delay: 0.05 }} className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/60"
        />
      </motion.div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading files...</p>
      ) : categories.length === 0 ? (
        <motion.div {...fade} transition={{ duration: 0.3, delay: 0.1 }} className="border border-border p-12 text-center">
          <Inbox size={28} className="mx-auto text-muted-foreground/40 mb-3" strokeWidth={1} />
          <p className="text-sm text-muted-foreground">
            {search ? "No files match your search." : "No documents yet."}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">Files will appear here as your team shares them.</p>
        </motion.div>
      ) : (
        categories.map(([category, docs], ci) => (
          <motion.div key={category} {...fade} transition={{ duration: 0.3, delay: 0.1 + ci * 0.06 }}>
            <p className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase mb-3 flex items-center gap-2">
              <FolderOpen size={12} strokeWidth={1.5} />
              {categoryLabel[category] || category}
            </p>
            <div className="border border-border divide-y divide-border">
              {docs.map((doc: any) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(doc.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <ExternalLink size={16} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Files;
