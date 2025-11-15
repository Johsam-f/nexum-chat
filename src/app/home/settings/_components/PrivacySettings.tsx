"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface PrivacySettingsProps {
  initialIsPrivate?: boolean;
}

export function PrivacySettings({ initialIsPrivate = false }: PrivacySettingsProps) {
  const updateProfile = useMutation(api.userProfiles.updateProfile);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
  const [isSaving, setIsSaving] = useState(false);

  const handlePrivacyToggle = async (value: boolean) => {
    setIsPrivate(value);
    setIsSaving(true);
    try {
      await updateProfile({ isPrivate: value });
    } catch (error) {
      console.error("Failed to update privacy:", error);
      setIsPrivate(!value);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Security
        </CardTitle>
        <CardDescription>
          Control who can see your content and interact with you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="private-account" className="text-base">
              Private Account
            </Label>
            <p className="text-sm text-muted-foreground">
              Only approved followers can see your posts
            </p>
          </div>
          <Switch
            id="private-account"
            checked={isPrivate}
            onCheckedChange={handlePrivacyToggle}
            disabled={isSaving}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Account Visibility</Label>
            <p className="text-sm text-muted-foreground">
              {isPrivate ? "Your account is private" : "Your account is public"}
            </p>
          </div>
          <Eye className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
