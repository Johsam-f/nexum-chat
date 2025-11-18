'use client";'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Dot, Users } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminActions() {
    const { data: session } = authClient.useSession();
    const defaultGroup = useQuery(api.groups.getDefaultGroup);
    const initializeDefaultGroup = useMutation(api.groups.initializeDefaultGroup);
    const [isInitializing, setIsInitializing] = useState(false);

    const handleInitializeGroup = async () => {
        if (!session?.user?.id) {
            toast.error("You must be logged in");
            return;
        }

        setIsInitializing(true);
        try {
            await initializeDefaultGroup({
                adminUserId: session.user.id,
            });
            toast.success("Nexum Chat group created! All users have been added.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create default group");
        } finally {
            setIsInitializing(false);
        }
    };

    return (
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Group Setup Card */}
            <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Default Community Group
                    </CardTitle>
                    <CardDescription>
                        Create the &quot;Nexum Chat&quot; group that all users will join automatically
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {defaultGroup ? (
                        <div className="space-y-2">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              <Check className="inline" /> Default group is set up and active!
                            </p>
                            <p className="text-sm text-muted-foreground">
                                All new users will automatically join the &quot;Nexum Chat&quot; group.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    <Dot className="inline" /> Creates a group called &quot;Nexum Chat&quot;
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <Dot className="inline" /> Makes you the admin
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <Dot className="inline" /> Adds all existing users as members
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <Dot className="inline" /> New users automatically join on signup
                                </p>
                            </div>
                            <Button 
                                onClick={handleInitializeGroup}
                                disabled={isInitializing}
                                className="w-full md:w-auto"
                            >
                                {isInitializing ? "Creating..." : "Initialize Default Group"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                    Manage user roles, permissions, and bans
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                    <Dot className="inline" /> Grant or revoke moderator roles
                    </p>
                    <p className="text-sm text-muted-foreground">
                    <Dot className="inline" /> Ban or unban users
                    </p>
                    <p className="text-sm text-muted-foreground">
                    <Dot className="inline" /> View user activity logs
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">
                    Implementation coming soon...
                    </p>
                </CardContent>
            </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>
              Review and manage reported content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Review reported posts and comments
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Delete inappropriate content
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Track moderation actions
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Implementation coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              View and resolve user reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Pending reports queue
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Report history
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Resolution actions
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Implementation coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Track all admin and moderator actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> All admin actions logged
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> User accountability
            </p>
            <p className="text-sm text-muted-foreground">
              <Dot className="inline" /> Searchable history
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Implementation coming soon...
            </p>
          </CardContent>
        </Card>
      </main>
    );
}