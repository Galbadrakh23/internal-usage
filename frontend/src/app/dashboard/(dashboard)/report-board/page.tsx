"use client";
import { useContext } from "react";
import { ReportContext } from "@/context/ReportProvider";
import TimeReport from "@/components/features/time-report/TimeReport";
import { ReportModal } from "@/components/modals/NewReportModal";
import PageHeader from "@/components/buttons/PageHeader";

export default function TimeReportPage() {
  const reportContext = useContext(ReportContext);

  if (!reportContext) {
    throw new Error("TimeReportPage must be wrapped in ReportProvider");
  }

  const { Reports, updateReport } = reportContext;

  return (
    <main className="flex-1 space-y-4">
      <div className="flex flex-col gap-4">
        <PageHeader title="Нийт тайлан" />
        <span className="flex gap-4">
          <ReportModal />
        </span>
        {Reports ? (
          <TimeReport Reports={Reports} updateReport={updateReport} />
        ) : (
          <p>Loading reports...</p>
        )}
      </div>
    </main>
  );
}
