"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DiscardPostDialog } from "./DiscardPostDialog";
import { ImagePreview } from "@/components/CloudinaryUpload";

const MAX_CHARACTERS = 280;

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session } = authClient.useSession();
  const myProfile = useQuery(api.userProfiles.getMyProfile);
  const createPost = useMutation(api.posts.createPost);

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const canPost = content.trim().length > 0 && !isOverLimit && !isPosting;

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setContent("");
    setSelectedFile(null);
    setPreviewUrl(undefined);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(undefined);
  };

  const handlePost = async () => {
    if (!canPost) return;

    setIsPosting(true);
    try {
      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      // Upload image to Cloudinary 
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
        imagePublicId = uploadData.public_id;
      }

      // Create the post
      await createPost({ 
        content: content.trim(),
        imageUrl,
        imagePublicId,
      });

      setContent("");
      handleRemoveImage();
      setIsOpen(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Post on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canPost) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {!isOpen && (
        <CollapsibleTrigger asChild>
          <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {myProfile?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-muted-foreground">What&apos;s on your mind?</span>
                <Button size="sm" onClick={handleOpen} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </Card>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent>
        <Card className="p-4">
          <div className="space-y-4">

            <header className="flex items-center justify-between">
              <h3 className="font-semibold">Create Post</h3>
              <DiscardPostDialog handleClose={handleClose} />
            </header>

            <main className="flex gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {myProfile?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none min-h-[120px]"
                maxLength={MAX_CHARACTERS + 20}
              />
            </main>

            <div className="border-t" />

            <div className="flex items-center justify-between">
              {/* Image Upload */}
              <ImagePreview
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveImage}
                previewUrl={previewUrl}
                disabled={isPosting}
              />

              <section className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    isOverLimit
                      ? "text-destructive font-semibold"
                      : characterCount > MAX_CHARACTERS * 0.9
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {characterCount}/{MAX_CHARACTERS}
                </span>

                <Button
                  onClick={handlePost}
                  disabled={!canPost}
                  size="sm"
                  className="gap-2"
                >
                  {isPosting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Post
                </Button>
              </section>
            </div>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
