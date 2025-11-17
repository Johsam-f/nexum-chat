"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMessageDialog({ open, onOpenChange }: NewMessageDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const allUsers = useQuery(api.userProfiles.getAllUsers);
  const getOrCreateConversation = useMutation(api.messages.getOrCreateConversation);

  const isLoading = allUsers === undefined;

  const filteredUsers = allUsers?.filter((user: { username: string }) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = async (userId: string) => {
    try {
      const conversationId = await getOrCreateConversation({ otherUserId: userId });
      onOpenChange(false);
      setSearchQuery("");
      router.push(`/home/messages/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Search for a user to start a conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Users List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user: { userId: string; username: string; avatar?: string; bio?: string }) => (
                <Card
                  key={user.userId}
                  className="p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectUser(user.userId)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{user.username}</h4>
                      {user.bio && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? "No users found" : "Start typing to search"}
                </p>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
