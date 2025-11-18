

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyGroups } from "./_components/EmptyGroups";
import { GroupCard } from "./_components/GroupCard";
import { NewGroupDialog } from "./_components/NewGroupDialog";
import { useState } from "react";

export default function GroupsPage() {
  const groups = useQuery(api.groups.getMyGroups);
  const isLoading = groups === undefined;
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  const handleCreateGroup = () => {
    setShowNewGroupDialog(true);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Connect with communities that share your interests
          </p>
        </div>
        <Button onClick={handleCreateGroup} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Groups List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : groups && groups.length === 0 ? (
        <EmptyGroups onCreateGroup={handleCreateGroup} />
      ) : (
        <div className="space-y-4">
          {groups?.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
      />
    </div>
  );
}