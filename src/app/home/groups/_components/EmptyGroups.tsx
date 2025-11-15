import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyGroupsProps {
  onCreateGroup: () => void;
}

export function EmptyGroups({ onCreateGroup }: EmptyGroupsProps) {
  return (
    <Empty className="from-muted/50 to-background h-full bg-linear-to-b from-30%">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>No Groups Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t joined any groups yet. Create your first group or discover existing ones to connect with like-minded people.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreateGroup} size="sm">
          <Plus />
          Create Your First Group
        </Button>
      </EmptyContent>
    </Empty>
  );
}
