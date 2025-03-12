"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import type { JobRequest } from "@/interface";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Pagination from "../features/pagination/Pagination";
import { CreateJobRequestModal } from "@/components/modals/CreateJobRequest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const STATUS_CONFIG = {
  OPEN: {
    label: "Нээлттэй",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  },
  IN_PROGRESS: {
    label: "Эхэлсэн",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  COMPLETED: {
    label: "Дууссан",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  CANCELLED: {
    label: "Цуцлагдсан",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
} as const;

const PRIORITY_CONFIG = {
  URGENT: {
    label: "Яаралтай",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
  HIGH: {
    label: "Яаралтай",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  },
  MEDIUM: {
    label: "Дунд",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  LOW: {
    label: "Бага",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
} as const;

interface JobRequestTableProps {
  jobRequests: JobRequest[];
  isLoading?: boolean;
  onRowClick?: (jobRequest: JobRequest) => void;
}

type SortField = keyof JobRequest | "user.name";
type SortDirection = "asc" | "desc";

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
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset to first page when items change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items]);

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

export default function JobRequestTable({
  jobRequests,
  isLoading = false,
  onRowClick,
}: JobRequestTableProps) {
  const [itemsPerPage, setItemsPerPage] = React.useState(15);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    keyof typeof STATUS_CONFIG | "all"
  >("all");
  const [priorityFilter, setPriorityFilter] = React.useState<
    keyof typeof PRIORITY_CONFIG | "all"
  >("all");
  const [sortField, setSortField] = React.useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("desc");
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
    "createdAt",
    "title",
    "status",
    "priority",
    "user.name",
    "dueDate",
  ]);

  const filteredItems = React.useMemo(() => {
    return jobRequests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        (request.title &&
          request.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.user &&
          request.user.name &&
          request.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        !statusFilter ||
        statusFilter === "all" ||
        request.status === statusFilter;
      const matchesPriority =
        !priorityFilter ||
        priorityFilter === "all" ||
        request.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [jobRequests, searchTerm, statusFilter, priorityFilter]);

  // Sort job requests based on sort field and direction
  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aValue = sortField === "user.name" ? a.user.name : a[sortField];
      const bValue = sortField === "user.name" ? b.user.name : b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle date objects or strings
      if (
        (aValue instanceof Date && bValue instanceof Date) ||
        (typeof aValue === "string" &&
          typeof bValue === "string" &&
          !isNaN(Date.parse(aValue)) &&
          !isNaN(Date.parse(bValue)))
      ) {
        const dateA = aValue instanceof Date ? aValue : new Date(aValue);
        const dateB = bValue instanceof Date ? bValue : new Date(bValue);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      return 0;
    });
  }, [filteredItems, sortField, sortDirection]);

  const {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
  } = usePagination(sortedItems, itemsPerPage);

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

  const handleDownload = async () => {
    try {
      const csvContent = [
        [
          "Огноо",
          "Агуулга",
          "Төлөв",
          "Төрөл",
          "Хүсэлт гаргагч",
          "Дуусах хугацаа",
        ],
        ...filteredItems.map((item) => [
          format(new Date(item.createdAt), "yyyy-MM-dd"),
          item.title,
          STATUS_CONFIG[item.status].label,
          PRIORITY_CONFIG[item.priority].label,
          item.user.name,
          item.dueDate ? format(new Date(item.dueDate), "yyyy-MM-dd") : "-",
        ]),
      ]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `job-requests-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || priorityFilter !== "all";

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const isColumnVisible = (column: string) => visibleColumns.includes(column);

  return (
    <TooltipProvider>
      <Card className="overflow-hidden shadow-sm border-muted">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Хайх..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Хайлт"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setSearchTerm("")}
                    aria-label="Хайлт цэвэрлэх"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <CreateJobRequestModal
                  buttonText="Ажил бүртгэх"
                  buttonVariant="default"
                  buttonSize="sm"
                />

                {/* Mobile filter sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="sm:hidden">
                      <Filter className="h-4 w-4 mr-1" />
                      Шүүх
                      {hasActiveFilters && (
                        <Badge variant="success" className="ml-1 h-5 px-1">
                          {Object.values([
                            searchTerm !== "" ? 1 : 0,
                            statusFilter !== "all" ? 1 : 0,
                            priorityFilter !== "all" ? 1 : 0,
                          ]).reduce((a, b) => a + b, 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Шүүлтүүр</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Төлөв</h3>
                        <Select
                          value={statusFilter}
                          onValueChange={(value) =>
                            setStatusFilter(
                              value as keyof typeof STATUS_CONFIG | "all"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Бүх төлөв" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Бүх төлөв</SelectItem>
                            {Object.entries(STATUS_CONFIG).map(
                              ([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Төрөл</h3>
                        <Select
                          value={priorityFilter}
                          onValueChange={(value) =>
                            setPriorityFilter(
                              value as keyof typeof PRIORITY_CONFIG | "all"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Бүх төрөл" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Бүх төрөл</SelectItem>
                            {Object.entries(PRIORITY_CONFIG).map(
                              ([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          onClick={resetFilters}
                          className="mt-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Шүүлтүүр цэвэрлэх
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop filters */}
                <div className="hidden sm:flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Шүүх
                        {hasActiveFilters && (
                          <Badge variant="success" className="ml-1 h-5 px-1">
                            {Object.values([
                              searchTerm !== "" ? 1 : 0,
                              statusFilter !== "all" ? 1 : 0,
                              priorityFilter !== "all" ? 1 : 0,
                            ]).reduce((a, b) => a + b, 0)}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <h3 className="mb-2 text-sm font-medium">Төлөв</h3>
                        <Select
                          value={statusFilter}
                          onValueChange={(value) =>
                            setStatusFilter(
                              value as keyof typeof STATUS_CONFIG | "all"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Бүх төлөв" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Бүх төлөв</SelectItem>
                            {Object.entries(STATUS_CONFIG).map(
                              ([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <h3 className="mb-2 text-sm font-medium">Төрөл</h3>
                        <Select
                          value={priorityFilter}
                          onValueChange={(value) =>
                            setPriorityFilter(
                              value as keyof typeof PRIORITY_CONFIG | "all"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Бүх төрөл" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Бүх төрөл</SelectItem>
                            {Object.entries(PRIORITY_CONFIG).map(
                              ([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {hasActiveFilters && (
                        <div className="p-2">
                          <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="w-full"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Шүүлтүүр цэвэрлэх
                          </Button>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Татах
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV-р татах
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Багана
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("createdAt")}
                        onCheckedChange={() =>
                          toggleColumnVisibility("createdAt")
                        }
                      >
                        Огноо
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("title")}
                        onCheckedChange={() => toggleColumnVisibility("title")}
                      >
                        Хүсэлтийн агуулга
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("status")}
                        onCheckedChange={() => toggleColumnVisibility("status")}
                      >
                        Төлөв
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("priority")}
                        onCheckedChange={() =>
                          toggleColumnVisibility("priority")
                        }
                      >
                        Төрөл
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("user.name")}
                        onCheckedChange={() =>
                          toggleColumnVisibility("user.name")
                        }
                      >
                        Хүсэлт гаргагч
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isColumnVisible("dueDate")}
                        onCheckedChange={() =>
                          toggleColumnVisibility("dueDate")
                        }
                      >
                        Дуусах хугацаа
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                {statusFilter !== "all" && (
                  <Badge variant="success" className="flex items-center gap-1">
                    Төлөв: {STATUS_CONFIG[statusFilter].label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setStatusFilter("all")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Цэвэрлэх</span>
                    </Button>
                  </Badge>
                )}
                {priorityFilter !== "all" && (
                  <Badge variant="success" className="flex items-center gap-1">
                    Төрөл: {PRIORITY_CONFIG[priorityFilter].label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setPriorityFilter("all")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Цэвэрлэх</span>
                    </Button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="success" className="flex items-center gap-1">
                    Хайлт: {searchTerm}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Цэвэрлэх</span>
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-7"
                  onClick={resetFilters}
                >
                  Бүгдийг цэвэрлэх
                </Button>
              </div>
            )}
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
                    <TableRow className="bg-muted/50 hover:bg-muted">
                      {isColumnVisible("createdAt") && (
                        <TableHead
                          className="w-[120px] font-semibold cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            Огноо
                            {renderSortIcon("createdAt")}
                          </div>
                        </TableHead>
                      )}
                      {isColumnVisible("title") && (
                        <TableHead
                          className="font-semibold cursor-pointer"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center">
                            Хүсэлтийн агуулга
                            {renderSortIcon("title")}
                          </div>
                        </TableHead>
                      )}
                      {isColumnVisible("status") && (
                        <TableHead
                          className="w-[120px] font-semibold cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            Төлөв
                            {renderSortIcon("status")}
                          </div>
                        </TableHead>
                      )}
                      {isColumnVisible("priority") && (
                        <TableHead
                          className="w-[120px] font-semibold cursor-pointer"
                          onClick={() => handleSort("priority")}
                        >
                          <div className="flex items-center">
                            Төрөл
                            {renderSortIcon("priority")}
                          </div>
                        </TableHead>
                      )}
                      {isColumnVisible("user.name") && (
                        <TableHead
                          className="font-semibold cursor-pointer"
                          onClick={() => handleSort("user.name")}
                        >
                          <div className="flex items-center">
                            Хүсэлт гаргагч
                            {renderSortIcon("user.name")}
                          </div>
                        </TableHead>
                      )}
                      {isColumnVisible("dueDate") && (
                        <TableHead
                          className="w-[120px] font-semibold cursor-pointer"
                          onClick={() => handleSort("dueDate")}
                        >
                          <div className="flex items-center">
                            Дуусах хугацаа
                            {renderSortIcon("dueDate")}
                          </div>
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={visibleColumns.length}
                          className="h-40"
                        >
                          <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground animate-in fade-in-50">
                            <div className="rounded-full bg-muted p-3">
                              <AlertCircle className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium">
                              Мэдээлэл олдсонгүй
                            </p>
                            {hasActiveFilters && (
                              <Button
                                variant="link"
                                onClick={resetFilters}
                                className="mt-2"
                              >
                                Шүүлтүүр цэвэрлэх
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((request) => (
                        <TableRow
                          key={request.id}
                          className={cn(
                            "hover:bg-muted/50 transition-colors",
                            onRowClick && "cursor-pointer"
                          )}
                          onClick={
                            onRowClick ? () => onRowClick(request) : undefined
                          }
                        >
                          {isColumnVisible("createdAt") && (
                            <TableCell className="font-medium">
                              {format(
                                new Date(request.createdAt),
                                "yyyy-MM-dd"
                              )}
                            </TableCell>
                          )}
                          {isColumnVisible("title") && (
                            <TableCell className="max-w-[300px] truncate">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="block truncate">
                                    {request.title}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  {request.title}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          )}
                          {isColumnVisible("status") && (
                            <TableCell>
                              <Badge
                                variant="success"
                                className={cn(
                                  "rounded-full text-xs font-medium",
                                  STATUS_CONFIG[request.status].className
                                )}
                              >
                                {STATUS_CONFIG[request.status].label}
                              </Badge>
                            </TableCell>
                          )}
                          {isColumnVisible("priority") && (
                            <TableCell>
                              <Badge
                                variant="success"
                                className={cn(
                                  "rounded-full text-xs font-medium",
                                  PRIORITY_CONFIG[request.priority].className
                                )}
                              >
                                {PRIORITY_CONFIG[request.priority].label}
                              </Badge>
                            </TableCell>
                          )}
                          {isColumnVisible("user.name") && (
                            <TableCell className="max-w-[150px] truncate">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="block truncate">
                                    {request.user.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {request.user.name}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          )}
                          {isColumnVisible("dueDate") && (
                            <TableCell>
                              {request.dueDate
                                ? format(
                                    new Date(request.dueDate),
                                    "yyyy-MM-dd"
                                  )
                                : "-"}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/30">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <p className="text-sm text-muted-foreground">
              Нийт {filteredItems.length} хүсэлтээс{" "}
              <span className="font-medium text-foreground">
                {filteredItems.length > 0 ? startIndex + 1 : 0}-
                {Math.min(endIndex, filteredItems.length)}
              </span>{" "}
              харуулж байна
            </p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder="15" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
