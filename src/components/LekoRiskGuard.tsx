import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LekoRiskGuardProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  entityType: string;
  entityName: string;
  risks: string[];
}

const LekoRiskGuard = ({ open, onClose, onConfirm, loading, entityType, entityName, risks }: LekoRiskGuardProps) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border w-full max-w-md mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-destructive/5">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">LEKO Risk Guard</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Deletion Warning</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-foreground">
                You're about to delete <span className="font-semibold">{entityName}</span> ({entityType}).
              </p>

              {risks.length > 0 && (
                <div className="space-y-2">
                  {risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20">
                      <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground leading-relaxed">{risk}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground italic">
                LEKO recommends reviewing linked records before proceeding. This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onConfirm}
                disabled={loading}
                className="text-xs gap-2"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                {loading ? "Deleting..." : "Delete Anyway"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LekoRiskGuard;
