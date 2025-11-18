import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface InvalidGroupProps {
  onBack: () => void;
}

export function InvalidGroup({ onBack }: InvalidGroupProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Group Not Found</h3>
        <p className="text-muted-foreground mb-6">
          This group doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Button onClick={onBack}>Back to Groups</Button>
      </Card>
    </div>
  );
}
