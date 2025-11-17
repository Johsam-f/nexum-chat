

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";

interface NoMessagesProps {
  otherUser?: {
    username: string;
    avatar?: string;
  } | null;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBack: () => void;
}

export function NoMessages({
  otherUser,
  newMessage,
  onMessageChange,
  onSendMessage,
  onKeyDown,
  onBack,
}: NoMessagesProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground">
            Start a conversation by sending your first message!
          </p>
        </Card>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={onSendMessage} className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px] resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="shrink-0 h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}