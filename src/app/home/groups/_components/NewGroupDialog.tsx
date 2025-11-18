"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewGroupDialog({ open, onOpenChange }: NewGroupDialogProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allUsers = useQuery(api.userProfiles.getAllUsers);
  const createGroup = useMutation(api.groups.createGroup);
  const [isCreating, setIsCreating] = useState(false);

  const filteredUsers = allUsers?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    setIsCreating(true);
    try {
      const groupId = await createGroup({
        name: groupName.trim(),
        description: description.trim() || undefined,
        memberIds: selectedMembers,
      });

      setGroupName("");
      setDescription("");
      setSelectedMembers([]);
      setSearchQuery("");
      onOpenChange(false);

      router.push(`/home/groups/${groupId}`);
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a group to chat with multiple people
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name *</Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Add Members *</Label>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {filteredUsers && filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleToggleMember(user.userId)}
                    >
                      <Checkbox
                        checked={selectedMembers.includes(user.userId)}
                        onCheckedChange={() => handleToggleMember(user.userId)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.username}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No users found
                </div>
              )}
            </ScrollArea>
            {selectedMembers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0 || isCreating}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
