import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyFriendsProps {
  onDiscover?: () => void;
}

export function EmptyFriends({ onDiscover }: EmptyFriendsProps) {
  return (
    <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>No Friends Yet</EmptyTitle>
        <EmptyDescription>
          Start building your network by following people you&apos;re interested in. Discover new connections in the community.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onDiscover} size="sm">
          <UserPlus />
          Discover People
        </Button>
      </EmptyContent>
    </Empty>
  );
}
