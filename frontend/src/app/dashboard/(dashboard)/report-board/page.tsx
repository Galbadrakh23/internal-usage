"use client";
import { useContext, useEffect } from "react";
import { ReportContext } from "@/context/ReportProvider";
import ReportsTable from "@/components/data-table/reports/ReportsTable";
import PageHeader from "@/components/layout_components/PageHeader";
import Pagination from "@/components/features/pagination/Pagination";

export default function ReportPage() {
  const { reports, pagination, updateReport, fetchReports } =
    useContext(ReportContext);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchReports(newPage);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Нийт тайлан" />
        <ReportsTable Reports={reports} updateReport={updateReport} />
        <div className="flex items-center justify-center">
          {pagination.totalPages > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
