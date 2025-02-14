import React from "react";
import { Check, Clock, AlertTriangle, Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          icon: <Check className="h-4 w-4" />,
          color: "text-green-500",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Хүлээлгэж өгсөн",
        };
      case "in_transit":
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          color: "text-purple-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
          label: "Хүлээгдэж буй",
        };
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-red-500",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "Үлдээсэн",
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-gray-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          label: status || "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full border ${config.border} ${config.bg}`}
    >
      <span className={`mr-2 ${config.color}`}>{config.icon}</span>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;
