"use client";

import { useContext } from "react";
import { DailyReportList } from "@/components/features/daily-report/DailyReportList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout_components/Header";
import { ReportContext } from "@/context/ReportProvider";

export default function DailyReportPage() {
  const { dailyReports } = useContext(ReportContext);
  return (
    <div className="mt-8">
      <Header />
      <div className="p-8 rounded-lg mt-8 border border-blue-50">
        <div className="max-w-8xl mx-auto space-y-4">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Өдрийн тайлан</h1>
          </div>
          <DailyReportList dailyReports={dailyReports} />
        </div>
      </div>
    </div>
  );
}
