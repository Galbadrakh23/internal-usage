"use client";

import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Clipboard, User, Clock, Archive, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  content: string;
  activity: string;
  status: string;
  createdAt: Date | string | number;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface ReportDetailModalProps {
  open: boolean;
  onClose: () => void;
  report: Report | null;
  className?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  additionalTabs?: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function ReportDetailModal({
  open,
  onClose,
  report,
  className,
  showFooter = true,
  footerContent,
  title = "Тайлангийн дэлгэрэнгүй",
  additionalTabs = [],
}: ReportDetailModalProps) {
  if (!report) return null;

  const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = {
    daily: "bg-blue-500",
    hourly: "bg-green-500",
    important: "bg-red-500",
  };

  const statusTranslations: Record<string, string> = {
    daily: "Өдрийн",
    hourly: "Цагийн",
    important: "Яаралтай",
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const displayStatus = statusTranslations[normalizedStatus] || status;
    const color =
      statusColors[normalizedStatus as keyof typeof statusColors] ||
      "bg-gray-500";

    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span>{displayStatus}</span>
      </div>
    );
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    className = "",
  }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className="font-medium text-sm">{label}</div>
      <div className="flex items-start gap-2">
        <Icon
          className="h-4 w-4 mt-0.5 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="text-sm break-words">{value}</div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[450px] p-6 rounded-xl border shadow-lg",
          "animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200",
          className
        )}
      >
        <DialogHeader className="mb-5 relative">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Тайлангийн дэлгэрэнгүй мэдээлэл
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsContent
            value="details"
            className="space-y-5 data-[state=active]:animate-in data-[state=active]:fade-in-0"
          >
            <ScrollArea className="pr-4 -mr-4 max-h-[60vh]">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoRow
                    icon={User}
                    label="Үүсгэсэн"
                    value={report.user?.name || ""}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Үүсгэсэн огноо"
                    value={formatDate(report.createdAt)}
                  />
                </div>

                <Separator className="my-1" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoRow icon={Archive} label="Гарчиг" value={report.title} />
                  <InfoRow
                    icon={Tag}
                    label="Төлөв"
                    value={getStatusBadge(report.status)}
                  />
                </div>

                <InfoRow
                  icon={Clipboard}
                  label="Дэлгэрэнгүй"
                  value={report.content}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          {additionalTabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="space-y-5 data-[state=active]:animate-in data-[state=active]:fade-in-0"
            >
              <ScrollArea className="pr-4 -mr-4 max-h-[60vh]">
                <div className="space-y-5">{tab.content}</div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        {showFooter && (
          <DialogFooter className="mt-6 gap-2 flex flex-col sm:flex-row sm:justify-end">
            {footerContent || (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto transition-colors duration-200 rounded-lg"
                >
                  Хаах
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
