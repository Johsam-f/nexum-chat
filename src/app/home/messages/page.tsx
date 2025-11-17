"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyMessages } from "./_components/EmptyMessages";
import LoadingMessages from "./_components/loadingMsg";
import { ConversationCard } from "./_components/ConversationCard";
import { NewMessageDialog } from "./_components/NewMessageDialog";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function MessagesPage() {
  const { data: session } = authClient.useSession();
  const conversations = useQuery(api.messages.getMyConversations);
  const isLoading = conversations === undefined;
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  const handleNewMessage = () => {
    setShowNewMessageDialog(true);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Connect and chat with your friends
          </p>
        </div>
        <Button onClick={handleNewMessage} className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </header>

      {isLoading ? (
        <LoadingMessages />
      ) : conversations && conversations.length === 0 ? (
        <EmptyMessages onNewMessage={handleNewMessage} />
      ) : (
        <div className="space-y-2">
          {conversations?.map((conversation) => (
            <ConversationCard
              key={conversation._id}
              conversation={conversation}
              currentUserId={session?.user?.id || ""}
            />
          ))}
        </div>
      )}

      <NewMessageDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
      />
    </div>
  );
}
