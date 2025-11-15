import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ban, FileText, Flag, Users } from "lucide-react"

import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"

export default function QuickStats() {
  const usersCount = useQuery(api.users.getUsersCount)
  const postsCount = useQuery(api.users.getPostsCount)
  const pendingReportsCount = useQuery(api.users.getPendingReportsCount)
  const bannedUsersCount = useQuery(api.users.getBannedUsersCount)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usersCount !== undefined ? usersCount.toLocaleString() : "---"}
          </div>
          <p className="text-xs text-muted-foreground">
            Registered accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Total Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {postsCount !== undefined ? postsCount.toLocaleString() : "---"}
          </div>
          <p className="text-xs text-muted-foreground">
            Published content
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Pending Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pendingReportsCount !== undefined ? pendingReportsCount.toLocaleString() : "---"}
          </div>
          <p className="text-xs text-muted-foreground">
            {pendingReportsCount === 0 ? "All clear!" : "Needs attention"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Banned Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {bannedUsersCount !== undefined ? bannedUsersCount.toLocaleString() : "---"}
          </div>
          <p className="text-xs text-muted-foreground">
            Active bans
          </p>
        </CardContent>
      </Card>
    </div>
  )
}