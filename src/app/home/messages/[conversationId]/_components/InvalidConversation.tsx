import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface InvalidConversationProps {
  onBack: () => void;
}

export function InvalidConversation({ onBack }: InvalidConversationProps) {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">Invalid Conversation</h2>
        <p className="text-muted-foreground mb-4">
          The conversation link you followed is invalid.
        </p>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
      </Card>
    </div>
  );
}
