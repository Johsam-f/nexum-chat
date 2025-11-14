"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { ProfileHeader } from "../_components/ProfileHeader";
import { ProfileTabs } from "../_components/ProfileTabs";
import Loading from "../_components/Loading"

export default function ProfilePage() {
  const params = useParams();
  const slug = params.slug as string;

  const profile = useQuery(api.userProfiles.getProfileByUsername, { username: slug });
  const currentUser = useQuery(api.auth.getCurrentUser);

  // Loading state
  if (profile === undefined || currentUser === undefined) {
    return (
        <Loading />
    );
  }

  // Profile not found
  if (profile === null) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">
            The profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile.userId;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileTabs profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
