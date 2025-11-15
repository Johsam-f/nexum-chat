"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { redirect } from "next/navigation";
import QuickStats from "./_components/QuickStats";
import AdminActions from "./_components/AdminActions";

export default function AdminDashboardPage() {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const myRole = useQuery(api.admin.getMyRole);

  if (myRole !== undefined && myRole !== "admin" && myRole !== "moderator") {
    redirect("/home");
  }

  if (!currentUser || myRole === undefined) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold">
                    {myRole === "admin" ? "Admin Dashboard" : "Moderator Dashboard"}
                </h1>
                <p className="text-muted-foreground">
                    Manage your community and keep it safe
                </p>
            </div>
        </header>

        <QuickStats />
        <AdminActions />

      {/* Role Info */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Role: {myRole === "admin" ? "Administrator" : "Moderator"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Logged in as:</p>
            <p className="text-muted-foreground">{currentUser.email}</p>
            <p className="text-muted-foreground">User ID: {currentUser._id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
