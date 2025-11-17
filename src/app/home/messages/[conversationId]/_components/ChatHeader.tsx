import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  otherUser?: {
    username: string;
    avatar?: string;
  } | null;
  onBack: () => void;
}

export function ChatHeader({ otherUser, onBack }: ChatHeaderProps) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {otherUser && (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback>
                {otherUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{otherUser.username}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
