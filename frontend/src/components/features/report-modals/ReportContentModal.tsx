import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Calendar, User } from "lucide-react";
import type { HourlyReport } from "@/interface";

interface ReportContentModalProps {
  report: HourlyReport;
}

export function ReportContentModal({ report }: ReportContentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 hover:bg-slate-100"
          onClick={() => setIsOpen(true)}
        >
          <Eye className="h-4 w-4" />
          Харах
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold">
              {report.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            ></Button>
          </div>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(report.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{report.user.name}</span>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Тайлангийн агуулга
            </h4>
            <div className="prose prose-sm max-w-none">
              {report.activity.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 text-slate-900">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
