"use client";
import { useContext, useEffect } from "react";
import PageHeader from "@/components/layout_components/PageHeader";
import MealCountTable from "@/components/meals/MealsTable";
import { MealCountContext } from "@/context/MealCountProvider";
import Pagination from "@/components/features/pagination/Pagination";

export default function MealCountPage() {
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
        <PageHeader title="Хоолны талон" />
        <MealCountTable
          mealCounts={mealCounts}
          onPageChange={handlePageChange}
          fetchMealCounts={fetchMealCounts}
        />
      </div>
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
