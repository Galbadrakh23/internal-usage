"use client";

import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  Search,
} from "lucide-react";
import type { JobRequest } from "@/interface";

const STATUS_LABELS = {
  OPEN: "Хүлээгдэж буй",
  IN_PROGRESS: "Боловсруулж буй",
  COMPLETED: "Дууссан",
  CANCELLED: "Татгалзсан",
} as const;

const PRIORITY_LABELS = {
  URGENT: "Яаралтай",
  HIGH: "Өндөр",
  MEDIUM: "Дунд",
  LOW: "Бага",
} as const;

interface JobRequestTableProps {
  jobRequests: JobRequest[];
}

export default function JobRequestTable({ jobRequests }: JobRequestTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    keyof typeof STATUS_LABELS | ""
  >("");
  const [priorityFilter, setPriorityFilter] = useState<
    keyof typeof PRIORITY_LABELS | ""
  >("");

  const itemsPerPage = 10; // Increased from 5 to 10 for better data display

  const filterJobRequests = () =>
    jobRequests.filter((request) => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || request.status === statusFilter;
      const matchesPriority =
        !priorityFilter || request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

  const filteredItems = useMemo(filterJobRequests, [
    jobRequests,
    searchTerm,
    statusFilter,
    priorityFilter,
  ]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginateItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentItems = useMemo(paginateItems, [filteredItems, currentPage]);

  const handleDownload = () => {
    console.log("Downloading CSV...");
    // Implement CSV download logic here
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ажлын хүсэлтүүд</h2>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Татах
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as keyof typeof STATUS_LABELS | "")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Төлөв" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Бүгд</SelectItem>
              {Object.entries(STATUS_LABELS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(value) =>
              setPriorityFilter(value as keyof typeof PRIORITY_LABELS | "")
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Төрөл" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="URGENT">Бүгд</SelectItem>
              {Object.entries(PRIORITY_LABELS).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Огноо</TableHead>
              <TableHead>Хүсэлтийн агуулга</TableHead>
              <TableHead className="w-[120px]">Төлөв</TableHead>
              <TableHead className="w-[120px]">Төрөл</TableHead>
              <TableHead>Хүсэлт гаргагч</TableHead>
              <TableHead className="w-[120px]">Дуусах хугацаа</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <AlertCircle className="mx-auto h-6 w-6 text-gray-400" />
                  <p>Мэдээлэл олдсонгүй</p>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((request) => (
                <JobRequestRow key={request.id} request={request} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Нийт {filteredItems.length} хүсэлтээс{" "}
          {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredItems.length)} харуулж
          байна
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function JobRequestRow({ request }: { request: JobRequest }) {
  return (
    <TableRow>
      <TableCell>{format(new Date(request.createdAt), "yyyy-MM-dd")}</TableCell>
      <TableCell className="font-medium">{request.title}</TableCell>
      <TableCell>
        <span
          className={`px-6 py-1 rounded-full text-xs font-medium(
            request.status
          )}`}
        >
          {[request.status]}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium (
            request.priority
          )}`}
        >
          {[request.priority]}
        </span>
      </TableCell>
      <TableCell>{request.user.name}</TableCell>
      <TableCell>
        {request.dueDate
          ? format(new Date(request.dueDate), "yyyy-MM-dd")
          : "-"}
      </TableCell>
    </TableRow>
  );
}
