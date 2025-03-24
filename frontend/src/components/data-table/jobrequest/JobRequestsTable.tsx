import * as React from "react";
import { useState, useMemo } from "react";
import type { JobRequest } from "@/interfaces/interface";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";
import { CreateJobRequestModal } from "@/components/modals/NewJobRequest";
import { JobsRequestDetailModal } from "@/components/modals/JobRequestsModal";
import { JobRequestsDetailButton } from "@/components/buttons/JobsRequestDetailButton";
import JobRequestStatusUpdater from "@/components/data-table/jobrequest/JobRequestStatus";

const STATUS_CONFIG = {
  OPEN: {
    label: "Нээлттэй",
    className:
      "bg-yellow-500 text-white dark:bg-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  },
  IN_PROGRESS: {
    label: "Эхэлсэн",
    className:
      "bg-emerald-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  COMPLETED: {
    label: "Дууссан",
    className: "bg-emerald-500/90 hover:bg-emerald-500 text-white",
  },
  CANCELLED: {
    label: "Цуцлагдсан",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
} as const;

interface JobRequestTableProps {
  jobRequests: JobRequest[];
  isLoading?: boolean;
  onRowClick?: (jobRequest: JobRequest) => void;
  onDataChange?: (data: JobRequest[]) => void;
}

export default function JobRequestTable({
  jobRequests,
  isLoading = false,
  onDataChange,
}: JobRequestTableProps) {
  const [visibleColumns] = React.useState<string[]>([
    "createdAt",
    "title",
    "status",
    "priority",
    "user.name",
    "dueDate",
    "Detail",
    "actions",
  ]);

  const isColumnVisible = (column: string) => visibleColumns.includes(column);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobRequest] = useState<JobRequest | null>(null);

  // Sort job requests by creation date, newest first
  const sortedJobRequests = useMemo(() => {
    return [...jobRequests].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [jobRequests]);

  const columns: TableColumn<JobRequest>[] = [
    {
      id: "createdAt",
      header: "Огноо",
      accessorFn: (row) => new Date(row.createdAt).toLocaleDateString("en-CA"),
      searchable: true,
    },
    {
      id: "title",
      header: "Хүсэлтийн агуулга",
      accessorFn: (row) => row.title,
      cell: (value) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block max-w-[300px] truncate">{value}</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">{value}</TooltipContent>
        </Tooltip>
      ),
      searchable: true,
    },
    {
      id: "status",
      header: "Төлөв",
      accessorFn: (row) => row.status,
      cell: (value) => (
        <Badge
          variant="success"
          className={cn(
            "rounded-full text-xs font-medium",
            STATUS_CONFIG[value as keyof typeof STATUS_CONFIG].className
          )}
        >
          {STATUS_CONFIG[value as keyof typeof STATUS_CONFIG].label}
        </Badge>
      ),
      searchable: true,
    },
    {
      id: "dueDate",
      header: "Дуусах хугацаа",
      accessorFn: (row) =>
        row.dueDate ? format(new Date(row.dueDate), "yyyy-MM-dd") : "-",
      searchable: false,
    },
    {
      id: "Detail",
      header: "Дэлгэрэнгүй",
      accessorFn: (row) => row,
      cell: (row: JobRequest) => <JobRequestsDetailButton jobRequest={row} />,
      searchable: true,
    },
    {
      id: "actions",
      header: "Төлөв өөрчлөх",
      accessorFn: (row) => row,
      cell: (row: JobRequest) => <JobRequestStatusUpdater jobRequest={row} />,
      searchable: true,
    },
  ];

  const visibleTableColumns = columns.filter((column) =>
    isColumnVisible(column.id)
  );

  const actionComponents = (
    <div className="flex flex-wrap items-center gap-2">
      <CreateJobRequestModal />
    </div>
  );

  const handleModalClose = (updatedJobRequest?: JobRequest) => {
    if (updatedJobRequest && onDataChange) {
      const updatedData = jobRequests.map((jobRequest) =>
        jobRequest.id === updatedJobRequest.id ? updatedJobRequest : jobRequest
      );
      onDataChange(updatedData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <DynamicTable
        data={sortedJobRequests} // Use the sorted jobRequests data
        columns={visibleTableColumns}
        idField="id"
        isLoading={isLoading}
        pageSize={25}
        searchPlaceholder="Хайх..."
        noDataMessage="Мэдээлэл олдсонгүй"
        loadingMessage="Ачааллаж байна..."
        actionComponents={actionComponents}
      />
      {selectedJobRequest && (
        <JobsRequestDetailModal
          open={isModalOpen}
          onClose={handleModalClose}
          jobRequest={selectedJobRequest}
        />
      )}
    </>
  );
}
