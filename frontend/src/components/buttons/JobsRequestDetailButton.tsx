"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { JobsRequestDetailModal } from "@/components/modals/JobRequestsModal";
import type { JobRequest } from "@/interface";
import { Eye } from "lucide-react";

interface JobRequestsDetailsButtonProps {
  jobRequest: JobRequest;
}

export function JobRequestsDetailButton({
  jobRequest,
}: JobRequestsDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="h-5 w-5 text-gray-500" />
        Харах
      </Button>
      <JobsRequestDetailModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        jobRequest={jobRequest}
      />
    </>
  );
}
