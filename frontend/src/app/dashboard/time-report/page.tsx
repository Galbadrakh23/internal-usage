import TimeReport from "@/components/features/time-report/TimeReport";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout_components/Header";

export default function TimeReportPage() {
  return (
    <div className="mt-8">
      <Header />
      <div className="flex flex-col min-h-screen p-8 rounded-lg mt-8 border border-blue-50">
        <div className="px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Цагийн тайлан</h1>
            </div>
            <TimeReport />
          </div>
        </div>
      </div>
    </div>
  );
}
