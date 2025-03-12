import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          label: "Амжилттай",
          className: "bg-emerald-500 hover:bg-emerald-600 transition-colors",
        };
      case "in progress":
        return {
          label: "Явж байна",
          className: "bg-blue-500 hover:bg-blue-600 transition-colors",
        };
      case "pending":
        return {
          label: "Шалгаагүй",
          className: "bg-yellow-500 hover:bg-yellow-600 transition-colors",
        };
      default:
        return {
          label: status,
          className: "bg-gray-500 hover:bg-gray-600 transition-colors",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className} role="status">
      {config.label}
    </Badge>
  );
}
