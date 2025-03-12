"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Download,
  Loader2,
  Search,
} from "lucide-react";
import type { Report } from "@/interface";
import Pagination from "../pagination/Pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ReportDetailModal } from "@/components/modals/ReportDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportListProps {
  Reports: Report[];
  isLoading?: boolean;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
}

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

type SortField = "createdAt" | "title" | "status" | "user.name";
type SortDirection = "asc" | "desc";

const statusTranslations: Record<string, string> = {
  daily: "Өдрийн",
  hourly: "Цагийн",
  important: "Яаралтай",
};

function usePagination<T>(
  items: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
  };
}

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

// Helper function to export data as CSV
const exportToCSV = (data: Report[]) => {
  const headers = [
    "Огноо",
    "Тайлангийн гарчиг",
    "Тайлангийн агуулга",
    "Үүсгэсэн ажилтан",
  ];

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const csvRows = [
    headers.join(";"), // Use semicolon for better compatibility
    ...data.map((report) => {
      const translatedStatus =
        statusTranslations[report.status.toLowerCase()] || report.status;

      return [
        formatDate(new Date(report.createdAt)), // Standardized date format
        `"${report.title.replace(/"/g, '""').replace(/\n/g, " ")}"`,
        `"${translatedStatus.replace(/"/g, '""').replace(/\n/g, " ")}"`,
        `"${report.user.name.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      ].join(";");
    }),
  ];

  const csvString = "\uFEFF" + csvRows.join("\n"); // Add BOM for UTF-8 support
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `reports-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Report({
  Reports,
  isLoading = false,
  updateReport,
}: ReportListProps) {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter reports based on search term
  const filteredReports = Reports.filter((report) => {
    if (!searchTerm) return true;

    // Get translated status for search
    const translatedStatus =
      statusTranslations[report.status.toLowerCase()] || report.status;

    return (
      report.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translatedStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort reports based on sort field and direction
  const sortedReports = [...filteredReports].sort((a, b) => {
    const aValue =
      sortField === "createdAt"
        ? new Date(a.createdAt).getTime()
        : sortField === "user.name"
        ? a.user.name
        : a[sortField as keyof Report];

    const bValue =
      sortField === "createdAt"
        ? new Date(b.createdAt).getTime()
        : sortField === "user.name"
        ? b.user.name
        : b[sortField as keyof Report];

    return sortDirection === "asc"
      ? aValue < bValue
        ? -1
        : 1
      : aValue > bValue
      ? -1
      : 1;
  });

  const {
    currentItems: currentReports,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
  } = usePagination(sortedReports, itemsPerPage);

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
          <div className="relative w-full sm:w-auto max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Хайх..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Мөрийн тоо" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 мөр</SelectItem>
                <SelectItem value="15">15 мөр</SelectItem>
                <SelectItem value="25">25 мөр</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToCSV(filteredReports)}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV-р татах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-60 space-y-3 text-muted-foreground animate-in fade-in-50">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Ачааллаж байна...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead
                      className="w-[150px] font-semibold cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Огноо
                        {renderSortIcon("createdAt")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Тайлангийн гарчиг
                        {renderSortIcon("title")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[200px] font-semibold cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Төлөв
                        {renderSortIcon("status")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[180px] font-semibold cursor-pointer"
                      onClick={() => handleSort("user.name")}
                    >
                      <div className="flex items-center">
                        Үүсгэсэн ажилтан
                        {renderSortIcon("user.name")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] font-semibold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40">
                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground animate-in fade-in-50">
                          <div className="rounded-full bg-muted p-3">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium">
                            Мэдээлэл олдсонгүй
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentReports.map((report) => (
                      <TableRow
                        key={report.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(report)}
                      >
                        <TableCell className="font-medium">
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-CA"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {report.title}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.user.name}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Дэлгэрэнгүй
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 p-4 border-t bg-muted/50">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground">
            Нийт {filteredReports.length} мөрнөөс{" "}
            <span className="font-medium text-foreground">
              {filteredReports.length > 0 ? startIndex + 1 : 0}-
              {Math.min(endIndex, filteredReports.length)}
            </span>{" "}
            харуулж байна
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CardFooter>
      <ReportDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        updateReport={updateReport}
      />
    </Card>
  );
}
