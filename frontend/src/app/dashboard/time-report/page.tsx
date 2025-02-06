"use client";

import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout_components/Header";
import { ReportContext } from "@/context/ReportProvider";
import CreateTimeReport from "@/components/features/time-report/TimeReport";

export default function TimeReportPage() {
  const { hourlyReports } = useContext(ReportContext);
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
            <h1 className="text-2xl font-bold">Цагийн тайлан</h1>
          </div>
          <CreateTimeReport hourlyReports={hourlyReports} />
        </div>
      </div>
    </div>
  );
}
