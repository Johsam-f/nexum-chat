"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Clock } from "lucide-react";
import { ChangeUsernameDialog } from "./ChangeUsernameDialog";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface AccountInformationProps {
  email?: string;
  username?: string;
  displayName?: string;
}

export function AccountInformation({ email, username, displayName }: AccountInformationProps) {
  const myProfile = useQuery(api.userProfiles.getMyProfile);

  const getCooldownInfo = () => {
    if (!myProfile?.lastUsernameChange) {
      return { canChange: true, daysRemaining: 0 };
    }

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const timeSinceLastChange = now - myProfile.lastUsernameChange;
    const canChange = timeSinceLastChange >= THIRTY_DAYS_MS;
    
    if (canChange) {
      return { canChange: true, daysRemaining: 0 };
    }

    const timeRemaining = THIRTY_DAYS_MS - timeSinceLastChange;
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
    
    return { canChange: false, daysRemaining };
  };

  const cooldownInfo = getCooldownInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          Your basic account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed at this time
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="username">Username</Label>
            <ChangeUsernameDialog currentUsername={username} />
          </div>
          <Input
            id="username"
            value={username || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            @{username || "Not set"}
          </p>
          {myProfile?.lastUsernameChange && (
            <div className="flex items-start gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
              {cooldownInfo.canChange ? (
                <p className="text-green-600 dark:text-green-400">
                  You can change your username now!
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Username can be changed in{" "}
                  <span className="font-medium text-foreground">
                    {cooldownInfo.daysRemaining} day{cooldownInfo.daysRemaining > 1 ? "s" : ""}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={displayName || ""}
            disabled
            className="bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  );
}
