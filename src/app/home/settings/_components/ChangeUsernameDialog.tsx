"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Edit2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ChangeUsernameDialogProps {
  currentUsername?: string;
}

export function ChangeUsernameDialog({ currentUsername }: ChangeUsernameDialogProps) {
    const [open, setOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

  const myProfile = useQuery(api.userProfiles.getMyProfile);
  const updateUsername = useMutation(api.userProfiles.updateUsername);

  const checkAvailability = useQuery(
    api.userProfiles.checkUsernameAvailability,
    newUsername && newUsername.length >= 3 ? { username: newUsername } : "skip"
  );

  // Check if the availability result matches the current input
  const isCheckingCurrentUsername = checkAvailability?.username?.toLowerCase() === newUsername.toLowerCase().trim();

  // Update error state when availability check completes
  useEffect(() => {
    if (newUsername.length >= 3 && isCheckingCurrentUsername && checkAvailability) {
      if (!checkAvailability.available) {
        setError("This username is already taken");
      } else if (error === "This username is already taken") {
        // Clear the "already taken" error if username is now available
        setError("");
      }
    }
  }, [checkAvailability, isCheckingCurrentUsername, newUsername, error]);

  // Calculate if user can change username
  const canChangeUsername = () => {
    if (!myProfile?.lastUsernameChange) return true;
    
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const timeSinceLastChange = Date.now() - myProfile.lastUsernameChange;
    return timeSinceLastChange >= THIRTY_DAYS_MS;
  };

  // Validate username format (excluding availability check)
  const validateUsername = (username: string): string | null => {
    const normalized = username.toLowerCase().trim();
    
    if (normalized.length < 3 || normalized.length > 20) {
      return "Username must be between 3 and 20 characters";
    }

    if (!/^[a-z0-9_]+$/.test(normalized)) {
      return "Username can only contain lowercase letters, numbers, and underscores";
    }

    if (normalized === currentUsername?.toLowerCase()) {
      return "New username must be different from current username";
    }

    return null;
  };

  const handleUsernameChange = (value: string) => {
    setNewUsername(value);
    setError("");
    
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
    }
  };

  const handleSubmit = async () => {
    // Check format validation
    const validationError = validateUsername(newUsername);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check availability
    if (!checkAvailability?.available) {
      setError("This username is already taken");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUsername({ newUsername });
      toast.success("Username updated successfully!");
      setOpen(false);
      setNewUsername("");
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update username";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !canChangeUsername();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          disabled={isDisabled}
        >
          <Edit2 className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Choose a new username for your account
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Username</Label>
            <div className="text-sm text-muted-foreground">
              @{currentUsername || "Not set"}
            </div>
          </div>

          {/* New Username Input */}
          {canChangeUsername() && (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-username">New Username</Label>
                <div className="relative">
                  <Input
                    id="new-username"
                    placeholder="Enter new username"
                    value={newUsername}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={error ? "border-destructive" : checkAvailability?.available ? "border-green-500" : ""}
                    maxLength={20}
                  />
                  {newUsername.length >= 3 && checkAvailability !== undefined && isCheckingCurrentUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkAvailability.available ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {!error && newUsername.length >= 3 && isCheckingCurrentUsername && checkAvailability?.available && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 inline-block mr-1" />
                    Username is available!
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {newUsername.length}/20 characters
                </p>
              </div>

              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="text-sm font-medium">Username Rules:</p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>3-20 characters long</li>
                  <li>Only lowercase letters, numbers, and underscores</li>
                  <li>Must be unique</li>
                  <li>Can be changed once every 30 days</li>
                </ul>
              </div>
            </>
          )}
        </section>

        <DialogFooter>
          {canChangeUsername() ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setNewUsername("");
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !!error || !newUsername.trim() || (isCheckingCurrentUsername && checkAvailability?.available === false)}
              >
                {isSubmitting ? "Updating..." : "Update Username"}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
