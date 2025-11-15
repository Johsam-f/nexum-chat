"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { SearchBar } from "./_components/SearchBar";
import { Loader2, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Debounce search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const users = useQuery(api.userProfiles.searchUsersForDiscovery, {
    query: debouncedSearchTerm,
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-muted-foreground">
          Find and connect with amazing people in the community
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* Users List */}
      {users === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <p className="text-xl font-semibold">No users found</p>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search query"
              : "Be the first to create an account!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <Link
              key={user.userId}
              href={`/home/profile/${user.username}`}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image ?? undefined} alt={user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold truncate">
                    @{user.username}
                  </h3>
                  {user.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
