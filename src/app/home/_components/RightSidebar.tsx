"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, Users, Sparkles } from "lucide-react";
import { NewMessageDialog } from "../messages/_components/NewMessageDialog";
import { NewGroupDialog } from "../groups/_components/NewGroupDialog";
import { useState } from "react";

// Placeholder data - will be replaced with real Convex queries later
const onlineFriends = [
  { id: 1, name: "Alex Johnson", avatar: "/placeholder-avatar-1.jpg", status: "online" },
  { id: 2, name: "Sarah Chen", avatar: "/placeholder-avatar-2.jpg", status: "online" },
  { id: 3, name: "Mike Torres", avatar: "/placeholder-avatar-3.jpg", status: "online" },
];

export function RightSidebar() {
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Start something new</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => setShowNewMessageDialog(true)}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Start New Chat
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => setShowNewGroupDialog(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </CardContent>
        </Card>

        {/* Online Friends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Online Friends </CardTitle>
            <CardDescription>
              <p className="text-sm text-red-400">Online viewing functionality coming soon!!!!!</p>
              {onlineFriends.length} online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineFriends.map((friend, index) => (
                <div key={friend.id}>
                  <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                    </div>
                    <span className="text-sm font-medium">{friend.name}</span>
                  </div>
                  {index < onlineFriends.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3" size="sm">
              View All Friends
            </Button>
          </CardContent>
        </Card>

        {/* About Nexum Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              About Nexum Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with friends, share moments, and stay in touch with the people who matter most.
            </p>
          </CardContent>
        </Card>
      </div>

      <NewMessageDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
      />
    </ScrollArea>
  );
}
