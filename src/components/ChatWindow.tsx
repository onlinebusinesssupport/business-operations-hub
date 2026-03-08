import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, Search, Circle } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
}

interface Conversation {
  user_id: string;
  display_name: string;
  last_message: string;
  last_at: string;
  unread: number;
}

interface ChatWindowProps {
  /** If provided, locks the chat to a single conversation (client portal mode) */
  lockedRecipientId?: string;
  lockedRecipientName?: string;
  /** Show inbox sidebar (admin mode) */
  showInbox?: boolean;
}

const formatMsgTime = (date: string) => {
  const d = new Date(date);
  if (isToday(d)) return format(d, "HH:mm");
  if (isYesterday(d)) return `Yesterday ${format(d, "HH:mm")}`;
  return format(d, "dd MMM, HH:mm");
};

const ChatWindow = ({ lockedRecipientId, lockedRecipientName, showInbox = true }: ChatWindowProps) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(lockedRecipientId || null);
  const [selectedUserName, setSelectedUserName] = useState<string>(lockedRecipientName || "");
  const [newMessage, setNewMessage] = useState("");
  const [inboxSearch, setInboxSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Fetch all messages for current user ───
  const { data: allMessages = [] } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user?.id,
  });

  // ─── Fetch ALL clients for inbox (admin) ───
  const { data: clients = [] } = useQuery({
    queryKey: ["chat-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, contact_profile_id, profiles:contact_profile_id(user_id, full_name, email)")
        .eq("subscription_status", "active")
        .order("name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && isAdmin && showInbox,
  });

  const getDisplayName = useCallback((userId: string) => {
    if (lockedRecipientId && userId === lockedRecipientId) return lockedRecipientName || "Support";
    const profile = profiles.find((p) => p.user_id === userId);
    if (profile) return profile.full_name || profile.company_name || profile.email || "User";
    // Fallback to client name
    const client = clients.find((c: any) => (c.profiles as any)?.user_id === userId);
    if (client) return client.name;
    return "User";
  }, [profiles, clients, lockedRecipientId, lockedRecipientName]);

  // ─── Build conversation list from ALL clients + message data ───
  const conversations: Conversation[] = (() => {
    if (!user?.id || !showInbox) return [];

    // Build message-based conversation map
    const msgMap = new Map<string, { last_message: string; last_at: string; unread: number }>();
    allMessages.forEach((msg) => {
      const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
      const existing = msgMap.get(otherId);
      const isUnread = msg.recipient_id === user.id && !msg.is_read;
      if (!existing || new Date(msg.created_at) > new Date(existing.last_at)) {
        msgMap.set(otherId, {
          last_message: msg.content,
          last_at: msg.created_at,
          unread: (existing?.unread || 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unread += 1;
      }
    });

    // Merge: all clients + any conversations with non-client users
    const convMap = new Map<string, Conversation>();

    // Add all active clients (even without messages)
    clients.forEach((client: any) => {
      const clientUserId = (client.profiles as any)?.user_id;
      if (!clientUserId || clientUserId === user.id) return;
      const msgData = msgMap.get(clientUserId);
      convMap.set(clientUserId, {
        user_id: clientUserId,
        display_name: client.name || (client.profiles as any)?.full_name || "Client",
        last_message: msgData?.last_message || "",
        last_at: msgData?.last_at || "",
        unread: msgData?.unread || 0,
      });
    });

    // Add any conversations with users not in clients list
    msgMap.forEach((data, otherId) => {
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          user_id: otherId,
          display_name: getDisplayName(otherId),
          ...data,
        });
      }
    });

    return Array.from(convMap.values()).sort((a, b) => {
      // Conversations with messages first, sorted by recency
      if (a.last_at && !b.last_at) return -1;
      if (!a.last_at && b.last_at) return 1;
      if (a.last_at && b.last_at) return new Date(b.last_at).getTime() - new Date(a.last_at).getTime();
      return a.display_name.localeCompare(b.display_name);
    });
  })();

  const filteredConversations = conversations.filter(
    (c) => !inboxSearch || c.display_name.toLowerCase().includes(inboxSearch.toLowerCase())
  );

  // ─── Active conversation messages ───
  const activeMessages = allMessages.filter(
    (msg) =>
      selectedUserId &&
      ((msg.sender_id === user?.id && msg.recipient_id === selectedUserId) ||
        (msg.sender_id === selectedUserId && msg.recipient_id === user?.id))
  );

  // ─── Send message ───
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId || !user?.id || !newMessage.trim()) return;
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: selectedUserId,
        content: newMessage.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", user?.id] });
      inputRef.current?.focus();
    },
  });

  // ─── Mark messages as read when viewing ───
  useEffect(() => {
    if (!selectedUserId || !user?.id) return;
    const unread = activeMessages.filter(
      (m) => m.recipient_id === user.id && !m.is_read
    );
    if (unread.length > 0) {
      supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", unread.map((m) => m.id))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["messages", user?.id] });
        });
    }
  }, [selectedUserId, activeMessages.length]);

  // ─── Realtime subscription ───
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", user?.id] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // ─── Auto-scroll to bottom ───
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMutation.mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] border border-border rounded-lg overflow-hidden bg-card">
      {/* Inbox sidebar */}
      {showInbox && (
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations…"
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.user_id}
                  onClick={() => {
                    setSelectedUserId(conv.user_id);
                    setSelectedUserName(conv.display_name);
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-border/50 transition-colors ${
                    selectedUserId === conv.user_id
                      ? "bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate">{conv.display_name}</span>
                    {conv.unread > 0 && (
                      <span className="ml-2 shrink-0 h-5 min-w-5 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {formatMsgTime(conv.last_at)}
                  </p>
                </button>
              ))
            )}
          </ScrollArea>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedUserId ? (
          <>
            {/* Header */}
            <div className="h-12 px-4 flex items-center border-b border-border shrink-0">
              <Circle size={8} className="text-emerald-500 fill-emerald-500 mr-2" />
              <span className="text-sm font-medium text-foreground">
                {selectedUserName || getDisplayName(selectedUserId)}
              </span>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-3">
                {activeMessages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isMine ? "text-primary-foreground/60" : "text-muted-foreground/60"
                          }`}
                        >
                          {formatMsgTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2 shrink-0">
              <Input
                ref={inputRef}
                placeholder="Type a message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-10 text-sm"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMutation.isPending}
                className="h-10 w-10 shrink-0"
              >
                <Send size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
