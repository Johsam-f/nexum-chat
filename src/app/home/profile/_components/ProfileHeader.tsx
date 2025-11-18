"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Link as LinkIcon, Lock, LockOpen, MapPin, Settings } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { EditProfileDialog } from "./EditProfileDialog";

interface ProfileHeaderProps {
  profile: {
    userId: string;
    username: string;
    bio?: string;
    website?: string;
    location?: string;
    birthday?: number;
    isVerified?: boolean;
    createdAt: number;
  };
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const profileDetails = useQuery(api.userProfiles.getProfileByUsername, { username: profile.username });
  
  // Get user stats
  const userStats = useQuery(api.userProfiles.getUserStats, { userId: profile.userId });
  
  // get profile owner details
  const profileOwner = useQuery(api.auth.getUserById, { userId: profile.userId });
  const displayName = profileOwner?.name || profile.username;
  const userImage = profileOwner?.image || undefined;

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={userImage || undefined} alt={displayName || profile.username} />
          <AvatarFallback className="text-4xl">
            {(displayName || profile.username).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          {/* Name and Username */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{displayName || profile.username}</h1>
            </div>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>

          {profileDetails?.bio && (
            <p className="text-sm whitespace-pre-wrap">{profileDetails.bio}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {/* Isprivate */}
            {profileDetails?.isPrivate !== undefined && (
              <div className="flex items-center gap-1">
                {profileDetails.isPrivate ? (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Private Account</span>
                  </>
                ) : (
                  <>
                    <LockOpen className="h-4 w-4" />
                    <span>Public Account</span>
                  </>
                )}
              </div>
            )}


            {profileDetails?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profileDetails.location}</span>
              </div>
            )}
            {profileDetails?.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={profileDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profileDetails.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {profileDetails?.birthday && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Born {new Date(profileDetails.birthday).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <EditProfileDialog />
                <Button variant="outline" size="sm" asChild>
                  <Link href="/home/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="sm">Follow</Button>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mt-6 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold">{userStats?.postsCount ?? 0}</div>
          <div className="text-sm text-muted-foreground">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{userStats?.followersCount ?? 0}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{userStats?.followingCount ?? 0}</div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
      </div>
    </Card>
  );
}
