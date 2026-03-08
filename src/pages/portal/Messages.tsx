import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ChatWindow from "@/components/ChatWindow";

const Messages = () => {
  const { user } = useAuth();

  // Find the admin user to lock the conversation
  const { data: adminUser } = useQuery({
    queryKey: ["admin-user-for-chat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (!adminUser) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Chat with your account manager</p>
        </div>
        <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Chat with your account manager</p>
      </div>
      <ChatWindow
        lockedRecipientId={adminUser.user_id}
        lockedRecipientName="Support Studio"
        showInbox={false}
      />
    </div>
  );
};

export default Messages;
