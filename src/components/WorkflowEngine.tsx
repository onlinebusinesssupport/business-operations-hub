import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Lightbulb,
  Palette,
  Eye,
  Package,
  MessageSquare,
  Paperclip,
  Send,
  Video,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ── Types ── */

interface WorkflowStage {
  id: string;
  work_item_id: string;
  name: string;
  status: string;
  due_date: string | null;
  order_index: number;
  meeting_url: string | null;
  created_at: string;
}

interface StageComment {
  id: string;
  stage_id: string;
  work_item_id: string;
  author_id: string;
  content: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

interface WorkflowEngineProps {
  workItemId: string;
  workItemTitle: string;
  clientId: string;
  isAdmin?: boolean;
}

/* ── Stage config ── */

const STAGE_ICONS: Record<string, React.ElementType> = {
  Discovery: Search,
  Planning: Lightbulb,
  Creation: Palette,
  Review: Eye,
  Delivery: Package,
};

const STAGE_COLORS: Record<string, string> = {
  Discovery: "hsl(var(--primary))",
  Planning: "hsl(var(--accent-foreground))",
  Creation: "hsl(var(--primary))",
  Review: "hsl(var(--accent-foreground))",
  Delivery: "hsl(var(--primary))",
};

const DEFAULT_STAGES = ["Discovery", "Planning", "Creation", "Review", "Delivery"];

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

const WorkflowEngine = ({ workItemId, workItemTitle, clientId, isAdmin = false }: WorkflowEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [comments, setComments] = useState<StageComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attachFile, setAttachFile] = useState<File | null>(null);

  const fetchAll = useCallback(async () => {
    const [stagesRes, commentsRes] = await Promise.all([
      supabase
        .from("workflow_stages")
        .select("*")
        .eq("work_item_id", workItemId)
        .order("order_index", { ascending: true }),
      supabase
        .from("stage_comments")
        .select("*")
        .eq("work_item_id", workItemId)
        .order("created_at", { ascending: true }),
    ]);
    if (stagesRes.data) setStages(stagesRes.data);
    if (commentsRes.data) setComments(commentsRes.data);
    setLoading(false);
  }, [workItemId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`workflow-${workItemId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "workflow_stages", filter: `work_item_id=eq.${workItemId}` }, () => fetchAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "stage_comments", filter: `work_item_id=eq.${workItemId}` }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [workItemId, fetchAll]);

  // Init default stages if none exist (admin only)
  useEffect(() => {
    if (!loading && stages.length === 0 && isAdmin) {
      const init = async () => {
        await supabase.from("workflow_stages").insert(
          DEFAULT_STAGES.map((name, i) => ({
            work_item_id: workItemId,
            name,
            status: i === 0 ? "in_progress" : "todo",
            order_index: i,
          }))
        );
        fetchAll();
      };
      init();
    }
  }, [loading, stages.length, isAdmin, workItemId, fetchAll]);

  const completedCount = stages.filter((s) => s.status === "complete").length;
  const progressPct = stages.length > 0 ? (completedCount / stages.length) * 100 : 0;
  const currentStage = stages.find((s) => s.status === "in_progress") || stages.find((s) => s.status === "todo");

  const handleStageStatusChange = async (stageId: string, newStatus: string) => {
    if (!isAdmin) return;
    await supabase.from("workflow_stages").update({ status: newStatus }).eq("id", stageId);

    // Auto-advance: when completing a stage, set next to in_progress
    if (newStatus === "complete") {
      const idx = stages.findIndex((s) => s.id === stageId);
      if (idx < stages.length - 1) {
        await supabase.from("workflow_stages").update({ status: "in_progress" }).eq("id", stages[idx + 1].id);
      }
    }

    await supabase.from("activity_log").insert({
      entity_type: "workflow_stage",
      entity_id: stageId,
      action: "stage_status_change",
      actor_id: user?.id,
      client_id: clientId,
      details: { new_status: newStatus, work_item: workItemTitle },
    });

    fetchAll();
  };

  const handleScheduleMeeting = async (stageId: string, stageName: string) => {
    const roomName = `ss-${workItemId.slice(0, 8)}-${stageName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;

    await supabase.from("workflow_stages").update({ meeting_url: meetingUrl }).eq("id", stageId);

    await supabase.from("activity_log").insert({
      entity_type: "workflow_stage",
      entity_id: stageId,
      action: "meeting_scheduled",
      actor_id: user?.id,
      client_id: clientId,
      details: { meeting_url: meetingUrl, stage: stageName, work_item: workItemTitle },
    });

    toast({ title: "Meeting scheduled", description: `Jitsi room created for ${stageName}` });
    fetchAll();
  };

  const handleAddComment = async (stageId: string) => {
    if (!commentText.trim() || !user || submitting) return;
    setSubmitting(true);

    let attachmentUrl: string | null = null;
    let attachmentName: string | null = null;

    if (attachFile) {
      const path = `${clientId}/${workItemId}/${stageId}/${Date.now()}-${attachFile.name}`;
      const { error } = await supabase.storage.from("client-files").upload(path, attachFile);
      if (!error) {
        attachmentUrl = path;
        attachmentName = attachFile.name;
      }
    }

    await supabase.from("stage_comments").insert({
      stage_id: stageId,
      work_item_id: workItemId,
      author_id: user.id,
      content: commentText.trim(),
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
    });

    setCommentText("");
    setAttachFile(null);
    setSubmitting(false);
    fetchAll();
  };

  const stageComments = (stageId: string) => comments.filter((c) => c.stage_id === stageId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={16} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-4 text-center">
        No workflow stages configured for this project yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Production Pipeline — {completedCount}/{stages.length} stages
          </p>
          {currentStage && (
            <p className="text-[10px] text-muted-foreground">
              Current: <span className="text-foreground font-medium">{currentStage.name}</span>
            </p>
          )}
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      {/* Stage timeline */}
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const Icon = STAGE_ICONS[stage.name] || Search;
          const color = STAGE_COLORS[stage.name] || "hsl(var(--primary))";
          const isComplete = stage.status === "complete";
          const isCurrent = stage.status === "in_progress";
          const isExpanded = expandedStage === stage.id;
          const stComments = stageComments(stage.id);
          const isReview = stage.name === "Review";
          const isDiscovery = stage.name === "Discovery";

          return (
            <motion.div
              key={stage.id}
              {...fade}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className={`border transition-all ${
                isCurrent
                  ? "border-foreground/20 bg-secondary/30"
                  : isComplete
                  ? "border-primary/15 bg-primary/[0.02]"
                  : "border-border opacity-60"
              }`}
            >
              {/* Stage header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="relative">
                  {isComplete ? (
                    <CheckCircle2 size={18} className="text-primary" strokeWidth={1.5} />
                  ) : (
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className={isCurrent ? "" : "text-muted-foreground"}
                      style={isCurrent ? { color } : undefined}
                    />
                  )}
                  {/* Connector line */}
                  {i < stages.length - 1 && (
                    <div className={`absolute left-[8px] top-full w-px h-2 ${isComplete ? "bg-primary/30" : "bg-border"}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${isComplete ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {stage.name}
                    </p>
                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 ${
                      isComplete ? "bg-primary/10 text-primary" : isCurrent ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {stage.status === "complete" ? "Done" : stage.status === "in_progress" ? "Active" : "Upcoming"}
                    </span>
                    {stComments.length > 0 && (
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                        <MessageSquare size={9} /> {stComments.length}
                      </span>
                    )}
                  </div>
                  {stage.due_date && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock size={9} /> Due {new Date(stage.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {stage.meeting_url && (
                    <a
                      href={stage.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:underline text-[10px] flex items-center gap-1"
                    >
                      <Video size={10} /> Join
                    </a>
                  )}
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {/* Admin controls */}
                      {isAdmin && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {stage.status !== "complete" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px] h-7 gap-1.5"
                              onClick={() => handleStageStatusChange(stage.id, "complete")}
                            >
                              <CheckCircle2 size={11} /> Mark Complete
                            </Button>
                          )}
                          {stage.status === "complete" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px] h-7 gap-1.5"
                              onClick={() => handleStageStatusChange(stage.id, "in_progress")}
                            >
                              Reopen
                            </Button>
                          )}
                          {(isDiscovery || isReview) && !stage.meeting_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[11px] h-7 gap-1.5"
                              onClick={() => handleScheduleMeeting(stage.id, stage.name)}
                            >
                              <Video size={11} /> Schedule Meeting
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Client can also schedule discovery meeting */}
                      {!isAdmin && isDiscovery && isCurrent && !stage.meeting_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] h-7 gap-1.5"
                          onClick={() => handleScheduleMeeting(stage.id, stage.name)}
                        >
                          <Video size={11} /> Schedule Discovery Meeting
                        </Button>
                      )}

                      {/* Meeting link */}
                      {stage.meeting_url && (
                        <div className="flex items-center gap-2 p-3 bg-secondary/50 border border-border">
                          <Video size={14} className="text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">Meeting Room</p>
                            <a
                              href={stage.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline flex items-center gap-1 truncate"
                            >
                              {stage.meeting_url} <ExternalLink size={9} />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Comments / Feedback */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                          {isReview ? "Review Notes & Annotations" : "Comments"}
                        </p>

                        {stComments.length === 0 ? (
                          <p className="text-xs text-muted-foreground/60 py-2">No comments yet.</p>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {stComments.map((c) => (
                              <div key={c.id} className="flex gap-2.5 p-2.5 bg-background border border-border">
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                  <span className="text-[9px] font-medium text-muted-foreground">
                                    {c.author_id === user?.id ? "You" : "SS"}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
                                  {c.attachment_name && (
                                    <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                                      <Paperclip size={9} /> {c.attachment_name}
                                    </p>
                                  )}
                                  <p className="text-[9px] text-muted-foreground mt-1">
                                    {new Date(c.created_at).toLocaleDateString("en-US", {
                                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add comment */}
                        {(isCurrent || isComplete || isReview || isAdmin) && (
                          <div className="space-y-2">
                            <Textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder={isReview ? "Add review notes, feedback, or annotations…" : "Add a comment…"}
                              className="text-xs min-h-[60px] resize-none"
                            />
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] text-muted-foreground flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                                <Upload size={11} />
                                {attachFile ? attachFile.name : "Attach file"}
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => setAttachFile(e.target.files?.[0] || null)}
                                />
                              </label>
                              <Button
                                size="sm"
                                className="text-[11px] h-7 gap-1.5"
                                disabled={!commentText.trim() || submitting}
                                onClick={() => handleAddComment(stage.id)}
                              >
                                {submitting ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                                Post
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowEngine;
