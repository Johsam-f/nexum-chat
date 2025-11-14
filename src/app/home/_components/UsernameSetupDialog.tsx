"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface UsernameSetupDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UsernameSetupDialog({ open, onClose }: UsernameSetupDialogProps) {
  const suggestedUsername = useQuery(api.userProfiles.suggestUsername);
  const updateProfile = useMutation(api.userProfiles.updateProfile);
  
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const checkAvailability = useQuery(
    api.userProfiles.checkUsernameAvailability,
    username && username.length >= 3 ? { username } : "skip"
  );

  // Set suggested username as default when it loads
  useEffect(() => {
    if (suggestedUsername && !username) {
      setUsername(suggestedUsername);
    }
  }, [suggestedUsername, username]);

  const handleUsernameSubmit = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Username can only contain lowercase letters, numbers, and underscores");
      return;
    }

    if (checkAvailability !== undefined && !checkAvailability.available) {
      setError("This username is already taken");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updateProfile({ username });
      onClose();
        toast.success("Username set successfully!",{
            description: "Your username has been updated. and you can now start using Nexum Chat!",
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update username");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Choose Your Username</AlertDialogTitle>
          <AlertDialogDescription>
            Pick a unique username to get started. This is how others will find and mention you on Nexum Chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  setUsername(value);
                  setError("");
                }}
                disabled={isSubmitting}
                className="pr-10"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleUsernameSubmit();
                  }
                }}
              />
              {username.length < 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
              {username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkAvailability === undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : checkAvailability.available ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              3-20 characters. Lowercase letters, numbers, and underscores only.
            </p>
            {username.length >=3 && checkAvailability !== undefined && checkAvailability.available && (
              <p className="text-xs text-green-500">This username is available!</p>
            )}
            {username.length < 3 && (
              <p className="text-xs text-red-500">Username must be at least 3 characters</p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
            {checkAvailability !== undefined && !checkAvailability.available && (
              <p className="text-xs text-red-500">This username is already taken</p>
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={handleUsernameSubmit}
            disabled={
              isSubmitting ||
              !username ||
              username.length < 3 ||
              checkAvailability === undefined ||
              !checkAvailability.available
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
