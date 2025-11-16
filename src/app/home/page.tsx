"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { RightSidebar } from "./_components/RightSidebar";
import { UsernameSetupDialog } from "./_components/UsernameSetupDialog";
import { PostCard } from "@/components/PostCard";
import Loading from "./_components/loading";
import { CreatePost } from "./_components/CreatePost";

export default function HomePage() {
  const myProfile = useQuery(api.userProfiles.getMyProfile);
  const posts = useQuery(api.posts.getAllPosts);
  
  const [open, setOpen] = useState(false);
  
  const showUsernameDialog = myProfile !== undefined && !myProfile?.username;

  return (
    <>
      {/* Username Setup Dialog */}
      <UsernameSetupDialog 
        open={showUsernameDialog} 
        onClose={() => {}} 
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-full max-w-2xl px-4 py-6 space-y-6">
            <section>
              <h1 className="text-2xl font-bold">Home</h1>
              <p className="text-muted-foreground text-sm">
                See what&apos;s happening
              </p>
            </section>

            {/* Create Post Composer */}
            {myProfile?.username && <CreatePost />}

            {posts === undefined ? (
              <Loading />
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No posts yet. Be the first to post something!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post}
                    showAuthor={true}
                  />
                ))}
              </div>
            )}

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

        <aside className="hidden lg:block w-80 border-l h-full">
          <RightSidebar />
        </aside>
      </div>
    </>
  );
}

