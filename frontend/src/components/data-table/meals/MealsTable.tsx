"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  DynamicTable,
  type TableColumn,
} from "@/components/data-table/DynamicTable";
import { format } from "date-fns";
import { MealCountModal } from "../../modals/NewMealCountModal";
import { MealCountsDetailButton } from "@/components/buttons/MealCountsDetailsButton";
import { EditMealsCountButton } from "@/components/buttons/EditMealsCountButton";

import type { MealCount, MealCountTableProps } from "@/interfaces/interface";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function MealCountTable({
  mealCounts,
  fetchMealCounts,
}: MealCountTableProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [visibleColumns] = React.useState<string[]>([
    "date",
    "breakfast",
    "lunch",
    "dinner",
    "total",
    "detail",
    "action",
  ]);

  const isColumnVisible = (column: string) => visibleColumns.includes(column);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const calculateTotal = (mealCount: MealCount) => {
    return mealCount.breakfast + mealCount.lunch + mealCount.dinner;
  };

  const sortedMealCounts = useMemo(() => {
    return [...mealCounts].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [mealCounts]);

  const filteredMealCounts = useMemo(() => {
    if (!dateFilter) return sortedMealCounts;

    return sortedMealCounts.filter((meal) => {
      const mealDate = formatDate(meal.date);
      return mealDate.includes(dateFilter);
    });
  }, [sortedMealCounts, dateFilter]);

  const getMealCountStatus = (total: number) => {
    if (total > 30) {
      return {
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      };
    } else if (total > 20) {
      return {
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      };
    } else {
      return {
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      };
    }
  };

  const columns: TableColumn<MealCount>[] = [
    {
      id: "date",
      header: "Огноо",
      accessorFn: (mealCount) => mealCount.date,
      cell: (value) => formatDate(value),
      searchable: true,
    },
    {
      id: "breakfast",
      header: "Өглөөний хоол",
      accessorFn: (mealCount) => mealCount.breakfast,
      cell: (value) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium">{value.toLocaleString()}</span>
            </TooltipTrigger>
            <TooltipContent>
              Өглөөний хоол: {value.toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      searchable: false,
    },
    {
      id: "lunch",
      header: "Өдрийн хоол",
      accessorFn: (mealCount) => mealCount.lunch,
      cell: (value) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium">{value.toLocaleString()}</span>
            </TooltipTrigger>
            <TooltipContent>
              Өдрийн хоол: {value.toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      searchable: false,
    },
    {
      id: "dinner",
      header: "Оройн хоол",
      accessorFn: (mealCount) => mealCount.dinner,
      cell: (value) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium">{value.toLocaleString()}</span>
            </TooltipTrigger>
            <TooltipContent>
              Оройн хоол: {value.toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      searchable: false,
    },
    {
      id: "total",
      header: "Нийт",
      accessorFn: (mealCount) => calculateTotal(mealCount),
      cell: (value) => {
        const status = getMealCountStatus(value);
        return (
          <Badge
            variant="success"
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              status.className
            )}
          >
            {value.toLocaleString()}
          </Badge>
        );
      },
      searchable: false,
    },
    {
      id: "detail",
      header: "Дэлгэрэнгүй",
      accessorFn: (row) => row,
      cell: (row: MealCount) => <MealCountsDetailButton mealCounts={row} />,
    },
    {
      id: "action",
      header: "Засах",
      accessorFn: (row) => row,
      cell: (row: MealCount) => <EditMealsCountButton mealCounts={row} />,
    },
  ];

  const visibleTableColumns = columns.filter((column) =>
    isColumnVisible(column.id)
  );

  const actionComponents = (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Хоолны тоо бүртгэх</span>
      </Button>
    </div>
  );

  const dateFilterComponent = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="date"
          className="py-2 px-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
        />
      </div>
      {dateFilter && (
        <Button variant="outline" size="sm" onClick={() => setDateFilter("")}>
          Цэвэрлэх
        </Button>
      )}
    </div>
  );

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    fetchMealCounts();
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-auto rounded-lg border border-muted bg-background shadow-sm">
      <DynamicTable
        data={filteredMealCounts}
        columns={visibleTableColumns}
        idField="id"
        selectProperty={dateFilterComponent}
        pageSize={10}
        searchPlaceholder="Хайх..."
        noDataMessage="Хоолны тооны мэдээлэл олдсонгүй"
        loadingMessage="Ачааллаж байна..."
        actionComponents={actionComponents}
      />

      {/* Modals */}
      <MealCountModal isOpen={isCreateModalOpen} onClose={handleModalClose} />
    </div>
  );
}
