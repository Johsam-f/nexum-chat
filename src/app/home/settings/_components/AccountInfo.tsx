"use client";

import { Card, CardContent } from "@/components/ui/card";

interface AccountInfoProps {
  createdAt?: number;
  userId?: string;
}

export function AccountInfo({ createdAt, userId }: AccountInfoProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            Account created:{" "}
            {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
          </p>
          <p>
            User ID:{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {userId || "Unknown"}
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
