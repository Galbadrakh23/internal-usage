"use client";
import { useContext, useEffect } from "react";
import { MealCountContext } from "@/context/MealCountProvider";
import PageHeader from "@/components/layout_components/PageHeader";
import MealCountTable from "@/components/data-table/meals/MealsTable";
import Pagination from "@/components/features/pagination/Pagination";

export default function MealCountsPage() {
  const { mealCounts, fetchMealCounts, pagination } =
    useContext(MealCountContext);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchMealCounts(newPage);
    }
  };

  useEffect(() => {
    fetchMealCounts();
  }, [fetchMealCounts]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Хоолны тоо" />
      </div>
      <MealCountTable
        mealCounts={mealCounts}
        onPageChange={handlePageChange}
        fetchMealCounts={fetchMealCounts}
      />
      <div className="flex items-center justify-center">
        {pagination.totalPages > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
