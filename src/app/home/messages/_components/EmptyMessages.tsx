import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyMessagesProps {
  onNewMessage?: () => void;
}

export function EmptyMessages({ onNewMessage }: EmptyMessagesProps) {
  return (
    <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircle />
        </EmptyMedia>
        <EmptyTitle>No Messages Yet</EmptyTitle>
        <EmptyDescription>
          Start a conversation with your friends. Your messages will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onNewMessage} size="sm">
          <Plus />
          New Message
        </Button>
      </EmptyContent>
    </Empty>
  );
}
