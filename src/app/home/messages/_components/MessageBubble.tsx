import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: {
    _id: string;
    content: string;
    createdAt: number;
    senderId: string;
    sender: {
      userId: string;
      username: string;
      avatar?: string;
    } | null;
  };
  isFromCurrentUser: boolean;
}

export function MessageBubble({ message, isFromCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        isFromCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isFromCurrentUser && message.sender && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>
            {message.sender.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <main
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isFromCurrentUser ? "items-end" : "items-start"
        )}
      >
        {/* message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 wrap-break-word",
            isFromCurrentUser
              ? "bg-gray-800 dark:bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-gray-300 dark:bg-muted rounded-tl-sm"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground px-2">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </span>
      </main>
    </div>
  );
}
