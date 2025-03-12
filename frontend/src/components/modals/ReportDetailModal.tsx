"use client";

import { useState, useEffect } from "react";
import type * as React from "react";
import { ClipboardIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Report } from "@/interface";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Clock, Archive, Tag, X, Save, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportDetailModalProps {
  open: boolean;
  onClose: () => void;
  report: Report | null;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
}

export function ReportDetailModal({
  open,
  onClose,
  report,
  updateReport,
}: ReportDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<Partial<Report>>({});

  // Reset edited report when the report changes or modal opens/closes
  useEffect(() => {
    if (report) {
      setEditedReport({
        title: report.title,
        status: report.status,
        activity: report.activity,
      });
    }
  }, [report, open]);

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

  const statusTranslations: Record<string, string> = {
    daily: "Өдрийн",
    hourly: "Цагийн",
    important: "Яаралтай",
  };

  const statusOptions = ["DAILY", "HOURLY", "IMPORTANT"];

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const displayStatus = statusTranslations[normalizedStatus] || status;

    switch (normalizedStatus) {
      case "daily":
        return (
          <Badge variant="success" className="px-3 py-1 text-sm font-medium">
            {displayStatus}
          </Badge>
        );
      case "hourly":
        return (
          <Badge variant="warning" className="px-3 py-1 text-sm font-medium">
            {displayStatus}
          </Badge>
        );
      case "important":
        return (
          <Badge
            variant="destructive"
            className="px-3 py-1 text-sm font-medium"
          >
            {displayStatus}
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="px-3 py-1 text-sm font-medium">
            {displayStatus}
          </Badge>
        );
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      // Reset to original values
      setEditedReport({
        title: report.title,
        status: report.status,
        activity: report.activity,
      });
    } else {
      // Start editing - initialize with current values
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (report && report.id) {
      updateReport(report.id, editedReport);
      setIsEditing(false);
    }
  };

  const handleChange = (
    field: keyof Report,
    value: string | number | boolean
  ) => {
    setEditedReport((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    field,
    className = "",
    editable = false,
    inputType = "text",
  }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
    field?: keyof Report;
    className?: string;
    editable?: boolean;
    inputType?: "text" | "textarea" | "select";
  }) => (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        {isEditing && editable && field ? (
          <>
            {inputType === "textarea" ? (
              <Textarea
                value={(editedReport[field] as string) || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full resize-none"
                rows={5}
                autoComplete="off"
                spellCheck="false"
              />
            ) : inputType === "select" ? (
              <Select
                value={(editedReport[field] as string) || ""}
                onValueChange={(value) => handleChange(field, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ангилал сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {statusTranslations[option] || option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={(editedReport[field] as string) || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full"
                autoComplete="off"
                spellCheck="false"
              />
            )}
          </>
        ) : (
          <div className="text-base break-words">{value}</div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Тайлангийн дэлгэрэнгүй
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          className="w-full flex-1 overflow-hidden flex flex-col"
        >
          <div className="px-6">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="details" className="flex-1">
                Дэлгэрэнгүй
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="details"
            className="flex-1 overflow-auto px-0 m-0"
          >
            <ScrollArea className="h-full">
              <div className="px-6 pb-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow
                      icon={Archive}
                      label="Гарчиг"
                      value={report.title}
                      field="title"
                      editable={true}
                    />
                    <InfoRow
                      icon={Tag}
                      label="Ангилал"
                      value={getStatusBadge(report.status)}
                      field="status"
                      editable={true}
                      inputType="select"
                    />
                  </div>

                  <InfoRow
                    icon={ClipboardIcon}
                    label="Дэлгэрэнгүй"
                    value={report.activity}
                    field="activity"
                    editable={true}
                    inputType="textarea"
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-4 border-t">
          {isEditing ? (
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="outline"
                onClick={handleEditToggle}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Цуцлах
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Хадгалах
              </Button>
            </div>
          ) : (
            <div className="flex w-full gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Хаах
              </Button>
              <Button
                variant="default"
                onClick={handleEditToggle}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Засах
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
