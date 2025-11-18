import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface GroupMessageBubbleProps {
  message: {
    _id: string;
    content: string;
    createdAt: number;
    sender: {
      userId: string;
      username: string;
      avatar?: string;
    };
  };
  isFromCurrentUser: boolean;
}

export function GroupMessageBubble({
  message,
  isFromCurrentUser,
}: GroupMessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 mb-4 ${
        isFromCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {message.sender.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col max-w-[70%] ${
          isFromCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {!isFromCurrentUser && (
          <span className="text-xs font-medium text-muted-foreground mb-1">
            {message.sender.username}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isFromCurrentUser
              ? "dark:bg-primary bg-gray-700 text-primary-foreground"
              : "dark:bg-muted bg-gray-300"
          }`}
        >
          <p className="text-sm wrap-break-word whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
