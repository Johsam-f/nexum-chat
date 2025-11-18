"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminSetupPage() {
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);

  const initializeAdmin = useMutation(api.admin.initializeAdmin);

  const handleSetup = async () => {
    if (!secretKey.trim()) {
      toast.error("Please enter the secret key");
      return;
    }

    setLoading(true);

    try {
      const response = await initializeAdmin({ secretKey });
      toast.success(`Success! ${response.message}`, {
        description: response.email,
      });
      setSecretKey("");
    } catch (error) {
      toast.error("Failed to initialize admin", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Initialize your admin account for production deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="secretKey" className="text-sm font-medium">
              Secret Key
            </label>
            <Input
              id="secretKey"
              type="password"
              placeholder="Enter your ADMIN_SETUP_SECRET"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetup()}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              This is the ADMIN_SETUP_SECRET from your Convex environment variables
            </p>
          </div>

          <Button
            onClick={handleSetup}
            disabled={loading || !secretKey.trim()}
            className="w-full"
          >
            {loading ? "Setting up..." : "Initialize Admin"}
          </Button>

          <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sign in to your account first</li>
              <li>Set ADMIN_SETUP_SECRET in Convex Dashboard</li>
              <li>Enter the secret key above</li>
              <li>Click &quot;Initialize Admin&quot;</li>
              <li>Delete this page after setup for security</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
