"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { HourlyReportListProps } from "@/interface";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  AlertCircle,
  Search,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { HourlyReportModal } from "../create-report/HourlyReportModal";
import { Input } from "@/components/ui/input";
import { ReportContentModal } from "@/components/features/report-modals/ReportContentModal";

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

function usePagination<T>(
  items: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

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

export default function TimeReport({ hourlyReports }: HourlyReportListProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("", setItemsPerPage);
  const filteredReports = hourlyReports.filter(
    (report) =>
      (date
        ? new Date(report.createdAt).toDateString() === date.toDateString()
        : true) &&
      (searchTerm
        ? report.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.user.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );
  const {
    currentItems: currentReports,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
  } = usePagination(filteredReports, itemsPerPage);

  const handleExport = () => {
    const csvData = filteredReports.map((report) => ({
      date: new Date(report.createdAt).toLocaleDateString(),
      activity: report.activity,
      title: report.title,
      user: report.user.name,
    }));
    console.log("Exporting data...", csvData);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="hover:bg-gray-100 transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Татах
            </Button>
          </div>
          <HourlyReportModal />
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-1 items-center space-x-3 justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[200px] justify-start text-left font-normal hover:bg-gray-200 transition-colors ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Огноо сонгох"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-md" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  weekStartsOn={1}
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Хайх..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9 focus-visible:ring-1 focus-visible:ring-gray-300"
              />
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 hover:bg-gray-50">
                <TableHead className="w-[150px] font-semibold text-gray-700">
                  Огноо
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Тайлангийн агуулга
                </TableHead>
                <TableHead className="w-[200px] font-semibold text-gray-700">
                  Оруулсан цаг
                </TableHead>
                <TableHead className="w-[180px] font-semibold text-gray-700">
                  Үүсгэсэн ажилтан
                </TableHead>
                <TableHead className="w-[180px] font-semibold text-gray-700">
                  Үйлдэл
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>Мэдээлэл олдсонгүй</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.user.name}</TableCell>

                    <TableCell>
                      <ReportContentModal report={report} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Нийт {filteredReports.length} мөрнөөс {startIndex + 1}-
            {Math.min(endIndex, filteredReports.length)} харуулж байна
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`transition-colors ${
                  currentPage === page
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
