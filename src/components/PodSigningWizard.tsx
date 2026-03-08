import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  CheckCircle2,
  Loader2,
  FileText,
  Clock,
  ChevronRight,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignedDocument {
  id: string;
  project_id: string;
  type: string;
  file_path: string | null;
  signed_by_client: boolean;
  signed_by_admin: boolean;
  signed_at: string | null;
  esign_provider: string | null;
}

interface PodSigningWizardProps {
  podId: string;
  podName: string;
  workItemId: string;
  clientId: string;
  onComplete?: () => void;
}

const DOC_ORDER = ["NDA", "MOU", "Service Agreement"];

const DOC_DESCRIPTIONS: Record<string, string> = {
  NDA: "Non-Disclosure Agreement — protects confidential information shared during our engagement.",
  MOU: "Memorandum of Understanding — outlines the scope, expectations, and mutual commitments.",
  "Service Agreement": "Service Agreement — defines deliverables, timelines, billing terms, and SLAs.",
};

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

const PodSigningWizard = ({ podId, podName, workItemId, clientId, onComplete }: PodSigningWizardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<SignedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [activeTab, setActiveTab] = useState<"sign" | "documents">("sign");

  const fetchDocs = useCallback(async () => {
    const { data } = await supabase
      .from("signed_documents")
      .select("*")
      .eq("project_id", workItemId)
      .order("created_at", { ascending: true });
    if (data) setDocs(data);
    setLoading(false);
  }, [workItemId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`signing-${workItemId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "signed_documents", filter: `project_id=eq.${workItemId}` },
        () => fetchDocs()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [workItemId, fetchDocs]);

  // Pre-fill signer name from profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setSignerName(data.full_name);
      });
  }, [user]);

  const sortedDocs = DOC_ORDER.map((type) => docs.find((d) => d.type === type)).filter(Boolean) as SignedDocument[];
  const signedCount = sortedDocs.filter((d) => d.signed_by_client).length;
  const allSigned = signedCount === sortedDocs.length && sortedDocs.length > 0;
  const currentDoc = sortedDocs.find((d) => !d.signed_by_client);

  const handleSign = async () => {
    if (!currentDoc || !signerName.trim() || signing) return;
    setSigning(true);

    try {
      const { data, error } = await supabase.functions.invoke("sign-document", {
        body: {
          document_id: currentDoc.id,
          signer_name: signerName.trim(),
          pod_id: podId,
        },
      });

      if (error) throw error;

      toast({
        title: `${currentDoc.type} signed`,
        description: data?.all_signed
          ? "All documents signed! Your pod is now active."
          : "Moving to the next document.",
      });

      await fetchDocs();

      if (data?.all_signed && onComplete) {
        onComplete();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Signing failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async (doc: SignedDocument) => {
    if (!doc.file_path) return;
    const { data } = await supabase.storage
      .from("signed-documents")
      .createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={18} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["sign", "documents"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "sign" ? "Sign Documents" : "Signed Documents"}
          </button>
        ))}
      </div>

      {activeTab === "sign" && (
        <motion.div {...fade} transition={{ duration: 0.3 }} className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Document signing — {signedCount}/{sortedDocs.length} complete
              </p>
              {allSigned && (
                <span className="text-[10px] font-medium text-primary flex items-center gap-1">
                  <CheckCircle2 size={10} /> All signed
                </span>
              )}
            </div>
            <Progress value={(signedCount / Math.max(sortedDocs.length, 1)) * 100} className="h-1" />
          </div>

          {/* Document list */}
          <div className="space-y-3">
            {sortedDocs.map((doc, i) => {
              const isCurrent = currentDoc?.id === doc.id;
              const isSigned = doc.signed_by_client;

              return (
                <motion.div
                  key={doc.id}
                  {...fade}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className={`border p-4 transition-all ${
                    isCurrent
                      ? "border-foreground/30 bg-secondary/50"
                      : isSigned
                      ? "border-primary/20 bg-primary/[0.02]"
                      : "border-border opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isSigned ? (
                        <CheckCircle2 size={16} className="text-primary" strokeWidth={1.5} />
                      ) : isCurrent ? (
                        <FileSignature size={16} className="text-foreground" strokeWidth={1.5} />
                      ) : (
                        <FileText size={16} className="text-muted-foreground" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{doc.type}</p>
                        {isSigned && (
                          <span className="text-[9px] uppercase tracking-wider text-primary font-medium bg-primary/10 px-1.5 py-0.5">
                            Signed
                          </span>
                        )}
                        {isCurrent && !isSigned && (
                          <span className="text-[9px] uppercase tracking-wider text-foreground font-medium bg-foreground/10 px-1.5 py-0.5">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {DOC_DESCRIPTIONS[doc.type] || doc.type}
                      </p>
                      {isSigned && doc.signed_at && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Clock size={10} />
                          Signed {new Date(doc.signed_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    {!isSigned && !isCurrent && (
                      <ChevronRight size={14} className="text-muted-foreground/30 mt-1" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Signing form */}
          {currentDoc && !allSigned && (
            <motion.div
              {...fade}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border border-foreground/20 p-5 space-y-4"
            >
              <p className="text-xs text-muted-foreground">
                By typing your full name below, you confirm that you have reviewed and agree to the terms of the <strong className="text-foreground">{currentDoc.type}</strong> for <strong className="text-foreground">{podName}</strong>.
              </p>
              <div className="flex gap-3">
                <Input
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Full legal name"
                  className="text-sm flex-1"
                />
                <Button
                  onClick={handleSign}
                  disabled={!signerName.trim() || signing}
                  size="sm"
                  className="text-xs tracking-wide gap-2 shrink-0"
                >
                  {signing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <FileSignature size={12} />
                  )}
                  {signing ? "Signing…" : `Sign ${currentDoc.type}`}
                </Button>
              </div>
            </motion.div>
          )}

          {allSigned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-primary/30 bg-primary/[0.03] p-5 text-center space-y-2"
            >
              <CheckCircle2 size={24} className="text-primary mx-auto" />
              <p className="text-sm font-medium text-foreground">All documents signed</p>
              <p className="text-xs text-muted-foreground">
                Your {podName} is now active. A discovery meeting has been scheduled.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === "documents" && (
        <motion.div {...fade} transition={{ duration: 0.3 }} className="space-y-3">
          {sortedDocs.filter((d) => d.signed_by_client).length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              No signed documents yet. Complete the signing flow to see them here.
            </p>
          ) : (
            sortedDocs
              .filter((d) => d.signed_by_client)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="border border-border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.type}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock size={9} />
                        {doc.signed_at
                          ? new Date(doc.signed_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PodSigningWizard;
