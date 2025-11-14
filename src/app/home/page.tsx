"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { RightSidebar } from "./_components/RightSidebar";
import { UsernameSetupDialog } from "./_components/UsernameSetupDialog";

export default function HomePage() {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const myProfile = useQuery(api.userProfiles.getMyProfile);
  
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const showUsernameDialog = myProfile !== undefined && !myProfile?.username;

  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentUser === null) {
    return null;
  }

  return (
    <>
      {/* Username Setup Dialog */}
      <UsernameSetupDialog 
        open={showUsernameDialog} 
        onClose={() => {}} 
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content - Centered */}
        <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-4xl px-4 py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name || currentUser.email}! 👋</h1>
            <p className="text-muted-foreground mt-1">Ready to connect with friends and start chatting?</p>
          </div>

          {/* Dashboard Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Your Dashboard</CardTitle>
              <CardDescription>Quick overview of your activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Messages</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Friends</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Sidebar Trigger */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <RightSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-80 border-l h-full">
          <RightSidebar />
        </aside>
      </div>
    </>
  );
}

