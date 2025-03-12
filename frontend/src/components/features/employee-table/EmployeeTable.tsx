"use client";

import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import type { Employee, PaginationProps } from "@/interface";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show limited page numbers with ellipsis for better UX
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return [...pages.slice(0, 5), "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", ...pages.slice(totalPages - 5)];

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TableStatic: React.FC<{ data: Employee[] }> = ({ data }) => {
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get unique companies for filter
  const companies = Array.from(
    new Set(data.map((employee) => employee.company.name))
  );

  // Filter data based on company and search term
  const filteredData = data.filter((employee) => {
    const matchesCompany = selectedCompany
      ? employee.company.name === selectedCompany
      : true;

    const matchesSearch = searchTerm
      ? employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm)
      : true;

    return matchesCompany && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value || null);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export functionality would go here");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={selectedCompany || ""}
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Бүх алба хэлтэс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх алба хэлтэс</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Хайх..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={handleExport}
                className="whitespace-nowrap"
              >
                <Download className="mr-2 h-4 w-4" />
                Хэвлэх
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Хүснэгтийг татаж авах</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "№",
                  "Ажилтны нэр",
                  "Албан тушаал",
                  "Алба хэлтэс",
                  "Утасны дугаар",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-xs font-semibold text-muted-foreground text-left border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <td
                        key={`cell-${index}-${cellIndex}`}
                        className="px-4 py-3"
                      >
                        <div className="h-4 bg-muted rounded w-full sm:w-24"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : currentData.length > 0 ? (
                currentData.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-center">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {employee.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{employee.position}</td>
                    <td className="px-4 py-3 text-sm">
                      {employee.company.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{employee.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Өгөгдөл олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {filteredData.length > 0
            ? `${startIndex + 1}-${endIndex} ажилтан харуулж байна (Нийт: ${
                filteredData.length
              })`
            : "Өгөгдөл олдсонгүй"}
        </div>
        <div className=" flex justify-center order-1 sm:order-2">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableStatic;
