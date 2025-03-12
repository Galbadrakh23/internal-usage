"use client";
import { useContext, useEffect } from "react";
import { JobRequestContext } from "@/context/JobRequestProvider";
import JobRequestTable from "@/components/job-request/job-request";
import PageHeader from "@/components/buttons/PageHeader";

export default function JobRequestPage() {
  const { jobRequests, fetchJobRequests } = useContext(JobRequestContext);

  useEffect(() => {
    fetchJobRequests();
  }, [fetchJobRequests]);

  return (
    <main className="flex-1 space-y-4">
      <div className="flex flex-col gap-4">
        <PageHeader title="Ажлын хуудас" />
      </div>
      <div className="items-center gap-4">
        <JobRequestTable jobRequests={jobRequests} />
      </div>
    </main>
  );
}
