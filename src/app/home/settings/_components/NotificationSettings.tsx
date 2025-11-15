"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications" className="text-base">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <Switch id="email-notifications" />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified about new messages and activity
            </p>
          </div>
          <Switch id="push-notifications" defaultChecked />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="message-notifications" className="text-base">
              Message Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified when someone messages you
            </p>
          </div>
          <Switch id="message-notifications" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
