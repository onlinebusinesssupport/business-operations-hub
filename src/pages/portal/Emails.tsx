import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { format } from "date-fns";

interface ClientEmail {
  id: string;
  to_email: string;
  subject: string;
  body_text: string | null;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const Emails = () => {
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["my-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_emails")
        .select("id, to_email, subject, body_text, status, sent_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ClientEmail[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Emails sent to you by Support Studio</p>
      </div>

      <div className="border border-border rounded-md divide-y divide-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          emails.map((email) => (
            <div key={email.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{email.subject}</p>
                <span className="text-xs text-muted-foreground">
                  {email.sent_at ? format(new Date(email.sent_at), "dd MMM yyyy") : "—"}
                </span>
              </div>
              {email.body_text && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{email.body_text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Emails;
