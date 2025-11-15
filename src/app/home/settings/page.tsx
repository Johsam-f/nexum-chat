"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Settings } from "lucide-react";
import { AccountInformation } from "./_components/AccountInformation";
import { PrivacySettings } from "./_components/PrivacySettings";
import { NotificationSettings } from "./_components/NotificationSettings";
import { DangerZone } from "./_components/dangerzone/DangerZone";
import { AccountInfo } from "./_components/AccountInfo";
import { AboutDev } from "./_components/AboutDev";

export default function SettingsPage() {
  const currentUser = useQuery(api.auth.getCurrentUser);
  const myProfile = useQuery(api.userProfiles.getMyProfile);

  if (!currentUser) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </header>

      <AccountInformation
        email={currentUser.email}
        username={myProfile?.username}
        displayName={currentUser.name}
      />

      <PrivacySettings initialIsPrivate={myProfile?.isPrivate} />
      <NotificationSettings />
      <AboutDev />
      <DangerZone />
      <AccountInfo
        createdAt={currentUser.createdAt}
        userId={currentUser._id}
      />
    </section>
  );
}
