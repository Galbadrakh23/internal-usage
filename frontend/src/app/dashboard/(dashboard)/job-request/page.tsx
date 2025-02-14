"use client";
import { useContext } from "react";
import { JobRequestContext } from "@/context/JobRequestProvider";
import JobRequestTable from "@/components/job-request/job-request";

export default function JobRequestPage() {
  const { jobRequests } = useContext(JobRequestContext);
  console.log("jobRequests", jobRequests);

  return (
    <div className="p-8 rounded-lg mt-8 border border-blue-50">
      <div className="max-w-8xl mx-auto space-y-4">
        <JobRequestTable jobRequests={jobRequests} />
      </div>
    </div>
  );
}
