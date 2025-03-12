"use client";
import { useState, useMemo } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import type { Delivery } from "@/interface";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "../features/pagination/Pagination";
import { DeliveryDetailsModal } from "@/components/modals/DeliveryDetailModal";

interface DeliveryTableProps {
  data: Delivery[];
  onDataChange?: (data: Delivery[]) => void;
  fetchData?: () => void;
}

export function DeliveryTable({ data, onDataChange }: DeliveryTableProps) {
  const [sorting, setSorting] = useState<{
    id: string;
    direction: "asc" | "desc" | null;
  }>({
    id: "trackingNo",
    direction: "asc",
  });
  const [filterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const pageSize = 20;

  // Status translations
  const statusTranslations = useMemo(
    () => ({
      DELIVERED: "Хүргэгдсэн",
      IN_TRANSIT: "Үлдээсэн",
      PENDING: "Үлдээсэн",
    }),
    []
  );

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: "trackingNo",
        header: "ID",
        accessorFn: (row: Delivery) => row.trackingNo,
        sortable: true,
      },
      {
        id: "itemName",
        header: "Item",
        accessorFn: (row: Delivery) => row.itemName,
        sortable: true,
      },
      {
        id: "status",
        header: "Төлөв",
        accessorFn: (row: Delivery) => row.status,
        cell: (value: keyof typeof statusTranslations) => {
          const colorMap: Record<string, string> = {
            DELIVERED: "bg-emerald-500 text-white",
            IN_TRANSIT: "bg-amber-500 text-white",
            PENDING: "bg-amber-500 text-white",
          };

          return (
            <span
              className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${
                colorMap[value] || "bg-gray-100 text-gray-800"
              }`}
            >
              {statusTranslations[value as keyof typeof statusTranslations] ||
                "Тодорхойгүй"}
            </span>
          );
        },
      },
      {
        id: "receiverName",
        header: "Хүлээн авагч",
        accessorFn: (row: Delivery) => row.receiverName,
      },
      {
        id: "senderName",
        header: "Илгээгч",
        accessorFn: (row: Delivery) => row.senderName,
      },
      {
        id: "createdAt",
        header: "Огноо",
        accessorFn: (row: Delivery) =>
          new Date(row.createdAt).toLocaleDateString("en-CA"),
      },
    ],
    [statusTranslations]
  );

  // Handle column sort
  const handleSort = (columnId: string) => {
    setSorting((prev) => {
      if (prev.id === columnId) {
        // Toggle sort direction
        if (prev.direction === "asc") {
          return { id: columnId, direction: "desc" };
        } else if (prev.direction === "desc") {
          return { id: columnId, direction: null };
        } else {
          return { id: columnId, direction: "asc" };
        }
      } else {
        return { id: columnId, direction: "asc" };
      }
    });
  };

  // Process data (filter and sort)
  const processedData = useMemo(() => {
    // First filter the data
    let result = [...data];

    if (filterValue) {
      const lowerCaseFilter = filterValue.toLowerCase();
      result = result.filter((row) => {
        return columns.some((column) => {
          const value = column.accessorFn(row);
          return value && String(value).toLowerCase().includes(lowerCaseFilter);
        });
      });
    }

    // Then sort the data
    if (sorting.id && sorting.direction) {
      const column = columns.find((col) => col.id === sorting.id);
      if (column) {
        result.sort((a, b) => {
          const valueA = column.accessorFn(a);
          const valueB = column.accessorFn(b);

          if (valueA === valueB) return 0;

          const comparison = valueA < valueB ? -1 : 1;
          return sorting.direction === "asc" ? comparison : -comparison;
        });
      }
    }

    return result;
  }, [data, columns, filterValue, sorting]);

  // Calculate pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pageSize]);

  // Row click handler
  const handleRowClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  // Update delivery handler
  const updateDelivery = (updatedDelivery: Delivery) => {
    if (onDataChange) {
      const updatedData = data.map((delivery) =>
        delivery.trackingNo === updatedDelivery.trackingNo
          ? updatedDelivery
          : delivery
      );
      onDataChange(updatedData);
    }
  };

  // Modal close handler
  const handleModalClose = (updatedDelivery?: Delivery) => {
    if (updatedDelivery) {
      updateDelivery(updatedDelivery);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-8xl mx-auto">
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="py-2">
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.id)}
                      className="px-2"
                    >
                      <span className="text-sm font-medium">
                        {column.header}
                      </span>
                      <CaretSortIcon className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-sm font-medium px-2">
                      {column.header}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.trackingNo || `delivery-${index}`} // Ensure uniqueness
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((column) => {
                    const value = column.accessorFn(row);
                    return (
                      <TableCell key={column.id} className="py-2">
                        {column.cell ? (
                          column.cell(value as keyof typeof statusTranslations)
                        ) : (
                          <div
                            className={
                              column.id === "trackingNo"
                                ? "font-medium text-sm"
                                : "text-sm"
                            }
                          >
                            {value}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {selectedDelivery && (
        <DeliveryDetailsModal
          open={isModalOpen}
          onClose={handleModalClose}
          delivery={selectedDelivery}
        />
      )}
    </div>
  );
}
