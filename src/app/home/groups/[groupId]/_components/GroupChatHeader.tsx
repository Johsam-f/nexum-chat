import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users } from "lucide-react";

interface GroupChatHeaderProps {
  group: {
    name: string;
    avatar?: string;
    members: Array<{
      userId: string;
      username: string;
      avatar?: string;
      role: "admin" | "member";
    }>;
  };
  onBack: () => void;
}

export function GroupChatHeader({ group, onBack }: GroupChatHeaderProps) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={group.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {group.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{group.name}</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>
              {group.members.length} {group.members.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
