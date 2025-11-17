import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

interface ConversationCardProps {
  conversation: {
    _id: Id<"conversations">;
    _creationTime: number;
    participant1Id: string;
    participant2Id: string;
    lastMessageAt?: number;
    createdAt: number;
    otherUser: {
      userId: string;
      username: string;
      avatar?: string;
    } | null;
    lastMessage: {
      content: string;
      createdAt: number;
      senderId: string;
    } | null;
    unreadCount: number;
  };
  currentUserId: string;
}

export function ConversationCard({
  conversation,
  currentUserId,
}: ConversationCardProps) {
  const router = useRouter();

  if (!conversation.otherUser) return null;

  const handleClick = () => {
    router.push(`/home/messages/${conversation._id}`);
  };

  const isLastMessageFromMe = conversation.lastMessage?.senderId === currentUserId;
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
        hasUnread ? "bg-accent/50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.otherUser.avatar} />
          <AvatarFallback>
            {conversation.otherUser.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Username and Time */}
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-semibold truncate ${
                hasUnread ? "text-foreground" : "text-foreground/90"
              }`}
            >
              {conversation.otherUser.username}
            </h3>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {formatDistanceToNow(conversation.lastMessage.createdAt, {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          {/* Last Message */}
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-sm truncate ${
                hasUnread
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {conversation.lastMessage ? (
                <>
                  {isLastMessageFromMe && (
                    <span className="text-muted-foreground">You: </span>
                  )}
                  {conversation.lastMessage.content}
                </>
              ) : (
                <span className="italic">Start a conversation</span>
              )}
            </p>

            {/* Unread Badge */}
            {hasUnread && (
              <div className="shrink-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
