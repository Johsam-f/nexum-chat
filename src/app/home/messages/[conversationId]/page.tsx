"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "../_components/MessageBubble";
import { ChatHeader } from "./_components/ChatHeader";
import { MessageInput } from "./_components/MessageInput";
import { ChatLoadingSkeleton } from "./_components/ChatLoadingSkeleton";
import { InvalidConversation } from "./_components/InvalidConversation";
import { NoMessages } from "./_components/NoMessages";
import { useState, useEffect, useRef } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  // Validate ID format - Convex IDs for conversations
  const isValidId = conversationId && /^[a-z0-9]{32}$/.test(conversationId);

  const conversationInfo = useQuery(
    api.messages.getConversationInfo,
    isValidId ? { conversationId: conversationId as Id<"conversations"> } : "skip"
  );
  const conversation = useQuery(
    api.messages.getMessages,
    isValidId ? { conversationId: conversationId as Id<"conversations"> } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markAsRead);

  const isLoading = conversation === undefined || conversationInfo === undefined;
  const currentUserId = session?.user?.id;
  const otherUser = conversationInfo?.otherUser;

  // Mark messages as read when entering chat
  useEffect(() => {
    if (isValidId && currentUserId) {
      markAsRead({ conversationId: conversationId as Id<"conversations"> });
    }
  }, [conversationId, isValidId, currentUserId, markAsRead]);

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
  }, [conversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isValidId) return;

    try {
      await sendMessage({
        conversationId: conversationId as Id<"conversations">,
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
    return <InvalidConversation onBack={() => router.push("/home/messages")} />;
  }

  if (isLoading) {
    return <ChatLoadingSkeleton />;
  }

  if (!conversation || conversation.length === 0) {
    return (
      <NoMessages
        otherUser={otherUser}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
        onBack={() => router.push("/home/messages")}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatHeader 
        otherUser={otherUser} 
        onBack={() => router.push("/home/messages")} 
      />

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {conversation.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isFromCurrentUser={message.senderId === currentUserId}
          />
        ))}
      </ScrollArea>

      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
