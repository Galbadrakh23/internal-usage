"use client";
import { useContext, useEffect } from "react";
import { JobRequestContext } from "@/context/JobRequestProvider";
import JobRequestTable from "@/components/data-table/jobrequest/JobRequestsTable";
import PageHeader from "@/components/layout_components/PageHeader";
import Pagination from "@/components/features/pagination/Pagination";

export default function JobRequestPage() {
  const { jobRequests, fetchJobRequests, pagination, isLoading } =
    useContext(JobRequestContext);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchJobRequests(newPage);
    }
  };

  useEffect(() => {
    fetchJobRequests();
  }, [fetchJobRequests]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Ажлын хуудас" />
      </div>
      <JobRequestTable jobRequests={jobRequests} isLoading={isLoading} />
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
