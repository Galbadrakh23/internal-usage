"use client";
import { useContext, useEffect } from "react";
import PageHeader from "@/components/layout_components/PageHeader";
import PatrolTable from "@/components/data-table/patrol/PatrolsTable";
import { PatrolContext } from "@/context/PatrolProvider";
import Pagination from "@/components/features/pagination/Pagination";

export default function PatrolCheckPage() {
  const { patrols, isLoading, fetchPatrols, pagination } =
    useContext(PatrolContext);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchPatrols(newPage);
    }
  };

  useEffect(() => {
    fetchPatrols();
  }, [fetchPatrols]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Патрол чек" />
      </div>
      <PatrolTable
        patrols={patrols}
        isLoading={isLoading}
        fetchPatrols={fetchPatrols}
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
