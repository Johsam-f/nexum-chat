"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupChatHeader } from "./_components/GroupChatHeader";
import { GroupMessageBubble } from "./_components/GroupMessageBubble";
import { GroupMessageInput } from "./_components/GroupMessageInput";
import { ChatLoadingSkeleton } from "./_components/ChatLoadingSkeleton";
import { InvalidGroup } from "./_components/InvalidGroup";
import { NoGroupMessages } from "./_components/NoGroupMessages";
import { useState, useEffect, useRef } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  // Validate ID format
  const isValidId = groupId && /^[a-z0-9]{32}$/.test(groupId);

  const groupInfo = useQuery(
    api.groups.getGroupInfo,
    isValidId ? { groupId: groupId as Id<"groups"> } : "skip"
  );
  const messages = useQuery(
    api.groupMessages.getGroupMessages,
    isValidId ? { groupId: groupId as Id<"groups"> } : "skip"
  );
  const sendMessage = useMutation(api.groupMessages.sendGroupMessage);

  const isLoading = messages === undefined || groupInfo === undefined;
  const currentUserId = session?.user?.id;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isValidId) return;

    try {
      await sendMessage({
        groupId: groupId as Id<"groups">,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Invalid ID
  if (!isValidId) {
    return <InvalidGroup onBack={() => router.push("/home/groups")} />;
  }

  if (isLoading) {
    return <ChatLoadingSkeleton />;
  }

  // Not a member or group doesn't exist
  if (!groupInfo) {
    return <InvalidGroup onBack={() => router.push("/home/groups")} />;
  }

  if (!messages || messages.length === 0) {
    return (
      <NoGroupMessages
        group={groupInfo}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        onBack={() => router.push("/home/groups")}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <GroupChatHeader group={groupInfo} onBack={() => router.push("/home/groups")} />

      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          {messages.map((message) => (
            <GroupMessageBubble
              key={message._id}
              message={message}
              isFromCurrentUser={message.senderId === currentUserId}
            />
          ))}
        </ScrollArea>
      </div>

      <GroupMessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
