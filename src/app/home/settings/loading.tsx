import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Trash2
} from "lucide-react";

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Account Settings Card */}
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
          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings Card */}
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
          {/* Private Account Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          <Separator />

          {/* Account Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings Card */}
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
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          <Separator />

          {/* Message Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - proceed with caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sign Out */}
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Account Info Footer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
