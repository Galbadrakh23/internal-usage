"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";
import { format } from "date-fns";
import { MealCountModal } from "../modals/NewMealCountModal";
interface MealCount {
  id: number;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

interface MealCountTableProps {
  mealCounts: MealCount[];
  onPageChange: (newPage: number) => void;
  fetchMealCounts: (page?: number, limit?: number) => Promise<void>;
}

export default function MealCountTable({
  mealCounts,
  fetchMealCounts,
}: MealCountTableProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    fetchMealCounts();
  }, [fetchMealCounts]);
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
      header: "Өглөөний цай",
      accessorFn: (mealCount) => mealCount.breakfast,
      cell: (value) => value.toLocaleString(),
      searchable: false,
    },
    {
      id: "lunch",
      header: "Өдрийн хоол",
      accessorFn: (mealCount) => mealCount.lunch,
      cell: (value) => value.toLocaleString(),
      searchable: false,
    },
    {
      id: "dinner",
      header: "Оройн хоол",
      accessorFn: (mealCount) => mealCount.dinner,
      cell: (value) => value.toLocaleString(),
      searchable: false,
    },
    {
      id: "total",
      header: "Нийт",
      accessorFn: (mealCount) => calculateTotal(mealCount),
      cell: (value) => value.toLocaleString(),
      searchable: false,
    },
  ];

  const actionComponents = (
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
        <PlusIcon className="mr-1 h-4 w-4" /> Хоолны тоо бүртгэх
      </Button>
    </div>
  );

  const dateFilterComponent = (
    <div className="flex items-center">
      <input
        type="date"
        className="py-2 px-2 border border-gray-200 rounded-md bg-white"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        aria-label="Filter by date"
      />
      {dateFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDateFilter("")}
          className="ml-2"
        >
          Цэвэрлэх
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <DynamicTable
        data={filteredMealCounts}
        columns={columns}
        idField="id"
        selectProperty={dateFilterComponent}
        pageSize={10}
        searchPlaceholder="Хайх..."
        noDataMessage="Хоолны тооны мэдээлэл олдсонгүй"
        loadingMessage="Ачааллаж байна..."
        actionComponents={actionComponents}
      />

      {/* Modals */}
      <MealCountModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchMealCounts();
        }}
      />
    </div>
  );
}
