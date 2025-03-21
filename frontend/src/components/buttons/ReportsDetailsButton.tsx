"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { ReportDetailModal } from "@/components/modals/ReportDetailModal";
import type { Report } from "@/interface";
import { Eye } from "lucide-react";

interface ReportsDetailsButtonProps {
  reports: Report;
}

export function ReportsDetailsButton({ reports }: ReportsDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="h-5 w-5 text-gray-500" />
        Харах
      </Button>
      <ReportDetailModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        reports={reports}
        updateReport={() => {}}
      />
    </>
  );
}
