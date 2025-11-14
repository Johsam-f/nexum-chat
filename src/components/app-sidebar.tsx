"use client";
import { Home, MessageCircleMore, Settings, Users, UserSearch, Bell } from "lucide-react"
import Image from "next/image"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import ThemeToggle  from "@/components/ThemeToggle"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Notifications",
    url: "/home/notifications",
    icon: Bell,
  },
  {
    title: "Messages",
    url: "/home/messages",
    icon: MessageCircleMore,
  },
  {
    title: "Groups",
    url: "/home/groups",
    icon: Users,
  },
  {
    title: "Friends",
    url: "/home/friends",
    icon: Users,
  },
  {
    title: "Discover",
    url: "/home/discover", 
    icon: UserSearch,
  },
  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const currentUser = useQuery(api.auth.getCurrentUser);
  const myProfile = useQuery(api.userProfiles.getMyProfile);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-10 mb-4 flex justify-center">
            <Image src="/nexum_logo.svg" alt="Logo" width={140} height={140} />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-[17px]"
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="space-y-2">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-muted-foreground">Change Theme</span>
            <ThemeToggle />
          </div>
          
          {/* User Profile */}
          {currentUser === undefined ? (
            // Loading state
            <div className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ) : currentUser ? (
            <Link
              href={myProfile?.username ? `/home/profile/${myProfile.username}` : `/home/profile/${currentUser._id}`} 
              className="flex items-center gap-3 px-3 py-2 border-t hover:bg-accent transition-colors cursor-pointer rounded-md"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.image || undefined} alt={currentUser.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.name?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {currentUser.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}