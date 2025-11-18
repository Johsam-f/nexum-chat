import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface GroupCardProps {
  group: {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
    lastMessage?: {
      content: string;
      createdAt: number;
      senderId: string;
    } | null;
    memberCount: number;
    unreadCount: number;
    userRole: "admin" | "member";
  };
}

export function GroupCard({ group }: GroupCardProps) {
  const hasUnread = group.unreadCount > 0;

  return (
    <Link href={`/home/groups/${group._id}`} className="block w-full max-w-full">
      <Card
        className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
          hasUnread ? "bg-accent/30" : ""
        } w-full max-w-full overflow-hidden`}
      >
        <div className="flex items-center gap-4 w-full max-w-full">
          <Avatar className="h-14 w-14">
            <AvatarImage src={group.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {group.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2 min-w-0 max-w-full">
                <h3 className="font-semibold truncate">{group.name}</h3>
                {group.userRole === "admin" && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
              {group.lastMessage && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(group.lastMessage.createdAt, {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>

            {group.lastMessage && (
              <p className={`text-sm text-muted-foreground truncate mt-1 ${hasUnread ? "font-semibold text-black dark:text-white" : ""}`}>
                {group.lastMessage.content}
              </p>
            )}
          </div>

          {hasUnread && (
            <Badge className="shrink-0 h-6 min-w-6 flex items-center justify-center">
              {group.unreadCount > 9 ? "9+" : group.unreadCount}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
