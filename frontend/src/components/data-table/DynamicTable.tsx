/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface TableColumn<T> {
  id: string;
  header: string;
  accessorFn: (row: T) => any;
  cell?: (value: any, row: T) => ReactNode;
  searchable?: boolean;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  idField: keyof T;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  searchPlaceholder?: string;
  noDataMessage?: string;
  loadingMessage?: string;
  actionComponents?: ReactNode;
  selectCompany?: ReactNode;
  selectProperty?: ReactNode;
  showSearch?: boolean;
  showRowNumbers?: boolean;
  onSearchChange?: (term: string) => void;
}

export function DynamicTable<T>({
  data,
  columns,
  idField,
  isLoading = false,
  searchPlaceholder = "Хайх...",
  noDataMessage = "Мэдээлэл олдсонгүй",
  loadingMessage = "Ачааллаж байна...",
  actionComponents,
  selectCompany,
  selectProperty,
  showSearch = true,
  showRowNumbers = true,
  onRowClick,
  onSearchChange,
}: DynamicTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (onSearchChange) {
      onSearchChange(term);
    }
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return columns.some((column) => {
      if (!column.searchable && column.searchable !== undefined) return false;
      const value = column.accessorFn(item);
      return (
        value !== undefined &&
        value !== null &&
        String(value).toLowerCase().includes(searchTermLower)
      );
    });
  });

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto border rounded-md shadow-sm">
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 gap-4">
          {actionComponents}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {selectCompany} {selectProperty}
            </div>
            {showSearch && (
              <div className="relative w-full sm:w-auto max-w-sm ml-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-60 space-y-3 text-muted-foreground animate-in fade-in-50">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">{loadingMessage}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    {showRowNumbers && (
                      <TableHead className="font-semibold w-12 text-center">
                        №
                      </TableHead>
                    )}
                    {columns.map((column) => (
                      <TableHead key={column.id} className="font-semibold">
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          showRowNumbers ? columns.length + 1 : columns.length
                        }
                        className="h-40"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground animate-in fade-in-50">
                          <div className="rounded-full bg-muted p-3">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium">{noDataMessage}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                      <TableRow
                        key={String(item[idField])}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(item)}
                      >
                        {showRowNumbers && (
                          <TableCell className="text-center font-medium text-muted-foreground w-12">
                            {index + 1}
                          </TableCell>
                        )}
                        {columns.map((column) => {
                          const value = column.accessorFn(item);
                          return (
                            <TableCell
                              key={`${String(item[idField])}-${column.id}`}
                            >
                              {column.cell ? column.cell(value, item) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 p-4 border-t">
        <div className="flex items-center justify-end w-full">
          <p className="text-sm text-muted-foreground">
            Нийт {filteredData.length} мөр харуулж байна
          </p>
        </div>
      </CardFooter>
    </div>
  );
}
