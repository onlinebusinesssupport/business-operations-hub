import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Upload, Loader2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const stagger = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const AdminDocuments = () => {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadClientId, setUploadClientId] = useState("");
  const [uploadCategory, setUploadCategory] = useState("shared");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["admin-clients-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (file: File) => {
    if (!uploadClientId) {
      toast({ title: "Select a client first", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const filePath = `${uploadClientId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("client-files")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("client-files")
        .getPublicUrl(filePath);

      const { error: docError } = await supabase.from("documents").insert({
        name: file.name,
        client_id: uploadClientId,
        category: uploadCategory,
        file_url: urlData.publicUrl,
      });
      if (docError) throw docError;

      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      toast({ title: "File uploaded", description: file.name });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteDoc = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      toast({ title: "Document deleted" });
    },
  });

  const downloadFile = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.click();
  };

  const filtered = selectedClient === "all" ? documents : documents.filter((d: any) => d.client_id === selectedClient);

  const grouped = filtered.reduce((acc: Record<string, any[]>, doc: any) => {
    const cat = doc.category || "shared";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <motion.div {...stagger} transition={{ duration: 0.3 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Documents</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage files across all clients.</p>
        </div>
      </motion.div>

      {/* Upload section */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="bg-card border border-divider rounded-xl p-5">
        <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3">Upload File</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Client *</label>
            <select value={uploadClientId} onChange={(e) => setUploadClientId(e.target.value)} className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select client</option>
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Category</label>
            <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="shared">Shared</option>
              <option value="internal">Internal</option>
              <option value="deliverable">Deliverable</option>
              <option value="onboarding">Onboarding</option>
            </select>
          </div>
          <div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading || !uploadClientId} className="gap-2 text-xs">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Uploading..." : "Choose File"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedClient("all")} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedClient === "all" ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider"}`}>
            All Clients
          </button>
          {clients.map((c: any) => (
            <button key={c.id} onClick={() => setSelectedClient(c.id)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedClient === c.id ? "bg-foreground text-background border-foreground" : "bg-card text-muted-foreground border-divider"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Documents list */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8">Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No documents found.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, docs]) => (
          <motion.div key={category} {...stagger} transition={{ duration: 0.3 }}>
            <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase mb-3 flex items-center gap-2 capitalize">
              <FileText size={14} strokeWidth={1.5} /> {category}
            </p>
            <div className="bg-card border border-divider rounded-xl divide-y divide-divider">
              {(docs as any[]).map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.clients?.name || "Unknown"} · {new Date(doc.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.file_url && (
                      <button onClick={() => downloadFile(doc.file_url, doc.name)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Download size={16} strokeWidth={1.5} />
                      </button>
                    )}
                    <button onClick={() => deleteDoc.mutate(doc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AdminDocuments;
