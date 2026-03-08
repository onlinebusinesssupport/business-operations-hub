import ChatWindow from "@/components/ChatWindow";

const AdminMessages = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time messaging with clients
        </p>
      </div>
      <ChatWindow showInbox />
    </div>
  );
};

export default AdminMessages;
