"use client";

import { useMemo } from "react";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";
import { Report } from "@/interfaces/interface";
import { Badge } from "@/components/ui/badge";
import { ReportModal } from "@/components/modals/NewReportModal";
import { ReportsDetailsButton } from "@/components/buttons/ReportsDetailsButton";
import { EditReportsButton } from "@/components/buttons/EditReportsButton";

interface ReportListProps {
  Reports: Report[];
  isLoading?: boolean;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
}

const statusTranslations: Record<string, string> = {
  daily: "Өдрийн",
  hourly: "Цагийн",
  important: "Яаралтай",
};

const getStatusBadge = (status: string) => {
  const displayStatus = statusTranslations[status.toLowerCase()] || status;

  switch (status.toLowerCase()) {
    case "daily":
      return <Badge variant="success">{displayStatus}</Badge>;
    case "hourly":
      return <Badge variant="warning">{displayStatus}</Badge>;
    case "important":
      return <Badge variant="destructive">{displayStatus}</Badge>;
    default:
      return <Badge variant="default">{displayStatus}</Badge>;
  }
};

export default function ReportsTable({
  Reports,
  isLoading = false,
}: ReportListProps) {
  const sortedReports = useMemo(() => {
    return [...Reports].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [Reports]);

  const columns: TableColumn<Report>[] = [
    {
      id: "createdAt",
      header: "Огноо",
      accessorFn: (row) => new Date(row.createdAt).toLocaleDateString("en-CA"),
      searchable: false,
    },
    {
      id: "title",
      header: "Тайлангийн гарчиг",
      accessorFn: (row) => row.title,
      cell: (value) => <div className="max-w-[300px] truncate">{value}</div>,
      searchable: true,
    },
    {
      id: "status",
      header: "Төлөв",
      accessorFn: (row) => row.status,
      cell: (value) => getStatusBadge(value),
      searchable: true,
    },
    {
      id: "user",
      header: "Үүсгэсэн ажилтан",
      accessorFn: (row) => row.user.name,
      searchable: true,
    },
    {
      id: "detail",
      header: "Дэлгэрэнгүй",
      accessorFn: (row) => row,
      cell: (row: Report) => <ReportsDetailsButton reports={row} />,
    },
    {
      id: "actions",
      header: "Төлөв өөрчлөх",
      accessorFn: (row) => row,
      cell: (row: Report) => <EditReportsButton reports={row} />,
    },
  ];

  return (
    <>
      <DynamicTable
        data={sortedReports}
        columns={columns}
        idField="id"
        isLoading={isLoading}
        actionComponents={<ReportModal />}
        searchPlaceholder="Хайх..."
      />
    </>
  );
}
