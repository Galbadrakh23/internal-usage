"use client";
import { useState } from "react";
import { EditReportModal } from "@/components/data-table/reports/ReportsEdit";
import type { Report } from "@/interfaces/interface";

interface EditReportsButtonProps {
  reports: Report;
}

export function EditReportsButton({ reports }: EditReportsButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <EditReportModal
        onOpenChange={setIsEditOpen}
        report={reports}
        open={isEditOpen}
      />
    </div>
  );
}
