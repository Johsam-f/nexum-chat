import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
}: MessageInputProps) {
  return (
    <div className="border-t p-4 bg-background">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] max-h-[120px] resize-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!value.trim()}
          className="shrink-0 h-[60px] w-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
