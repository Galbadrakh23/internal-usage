"use client";
import { useContext } from "react";
import { ReportContext } from "@/context/ReportProvider";
import TimeReport from "@/components/features/time-report/TimeReport";

export default function TimeReportPage() {
  const { hourlyReports } = useContext(ReportContext);
  return (
    <main>
      <TimeReport hourlyReports={hourlyReports} />
    </main>
  );
}
