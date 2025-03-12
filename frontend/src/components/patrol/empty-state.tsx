import { ClipboardX } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 space-y-2"
      role="status"
      aria-label="No patrol records"
    >
      <ClipboardX className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No patrol records found</p>
    </div>
  );
}
