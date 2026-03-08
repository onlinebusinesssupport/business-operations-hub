import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, Plus, Search, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ClientEmail {
  id: string;
  client_id: string | null;
  sent_by: string;
  to_email: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const AdminEmails = () => {
  const [composeOpen, setComposeOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClient, setFilterClient] = useState<string>("all");
  const queryClient = useQueryClient();

  // Form state
  const [toClientId, setToClientId] = useState<string>("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["client-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_emails")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ClientEmail[];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-for-email"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (payload: { to_email: string; subject: string; body_html: string; client_id?: string }) => {
      const { data, error } = await supabase.functions.invoke("send-client-email", {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Email sent", description: "Your email has been delivered successfully." });
      queryClient.invalidateQueries({ queryKey: ["client-emails"] });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setComposeOpen(false);
    setToClientId("");
    setToEmail("");
    setSubject("");
    setBodyHtml("");
  };

  const handleClientSelect = (clientId: string) => {
    setToClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client?.email) setToEmail(client.email);
  };

  const handleSend = () => {
    if (!toEmail || !subject || !bodyHtml) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    sendMutation.mutate({
      to_email: toEmail,
      subject,
      body_html: bodyHtml,
      client_id: toClientId || undefined,
    });
  };

  const filtered = emails.filter((e) => {
    const matchesSearch =
      !search ||
      e.to_email.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchesClient = filterClient === "all" || e.client_id === filterClient;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Emails</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send and track client communications
          </p>
        </div>
        <Button onClick={() => setComposeOpen(true)} size="sm" className="gap-2">
          <Plus size={14} />
          Compose
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-[200px] h-9 text-sm">
            <SelectValue placeholder="All clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Email list */}
      <div className="border border-border rounded-md divide-y divide-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No emails sent yet</p>
          </div>
        ) : (
          filtered.map((email) => {
            const clientName = clients.find((c) => c.id === email.client_id)?.name;
            return (
              <div key={email.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{email.subject}</p>
                    <Badge variant={email.status === "sent" ? "default" : "destructive"} className="text-[10px] shrink-0">
                      {email.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    To: {email.to_email}
                    {clientName && <span className="ml-2">· {clientName}</span>}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {email.sent_at ? format(new Date(email.sent_at), "dd MMM yyyy, HH:mm") : "—"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
            <DialogDescription>Send a branded email from your domain</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Client (optional)</label>
              <Select value={toClientId} onValueChange={handleClientSelect}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a client…" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">To *</label>
              <Input
                placeholder="recipient@example.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Subject *</label>
              <Input
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Message *</label>
              <Textarea
                placeholder="Write your message here…"
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                rows={6}
                className="text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Your message will be wrapped in a branded Support Studio™ template.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
            <Button size="sm" onClick={handleSend} disabled={sendMutation.isPending} className="gap-2">
              <Send size={13} />
              {sendMutation.isPending ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmails;
