import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 space-y-2"
      role="status"
      aria-label="Loading patrols"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading patrol data...</p>
    </div>
  );
}
