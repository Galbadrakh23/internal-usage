"use client";

import * as React from "react";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  User,
  HammerIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { JobRequest, JobStatus, Priority } from "@/interfaces/interface";

interface JobsRequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  jobRequest: JobRequest | null;
}

export function JobsRequestDetailModal({
  open,
  onClose,
  jobRequest,
}: JobsRequestDetailModalProps) {
  const statusTranslations = React.useMemo(
    () => ({
      OPEN: "Нээлттэй",
      IN_PROGRESS: "Эхэлсэн",
      COMPLETED: "Дууссан",
      CANCELLED: "Цуцлагдсан",
    }),
    []
  );

  const priorityTranslations = React.useMemo(
    () => ({
      LOW: "Бага",
      MEDIUM: "Дунд",
      HIGH: "Яаралтай",
      URGENT: "Маш Яаралтай",
    }),
    []
  );

  if (!jobRequest) return null;

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.OPEN:
        return "bg-amber-500/90 hover:bg-amber-500";
      case JobStatus.IN_PROGRESS:
        return "bg-blue-500/90 hover:bg-blue-500";
      case JobStatus.COMPLETED:
        return "bg-emerald-500/90 hover:bg-emerald-500";
      case JobStatus.CANCELLED:
        return "bg-destructive/90 hover:bg-destructive";
      default:
        return "bg-muted hover:bg-muted/80";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return "bg-blue-500 text-white";
      case Priority.MEDIUM:
        return "bg-green-500 text-white";
      case Priority.HIGH:
        return "bg-amber-500 text-white";
      case Priority.URGENT:
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isCompleted = jobRequest.status === JobStatus.COMPLETED;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-4 rounded-xl border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">
            Ажлын дэлгэрэнгүй
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Ажлын хүсэлтийн дэлгэрэнгүй мэдээлэл
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Badge
              className={`${getPriorityColor(
                jobRequest.priority
              )} px-2.5 py-1 text-xs font-medium rounded-full`}
              aria-label={`Priority: ${jobRequest.priority}`}
            >
              {priorityTranslations[jobRequest.priority]}
            </Badge>
            <Badge
              className={`${getStatusColor(
                jobRequest.status
              )} text-white px-3 py-1 text-xs font-medium rounded-full transition-colors`}
              aria-label={`Status: ${jobRequest.status}`}
            >
              {statusTranslations[jobRequest.status]}
            </Badge>
          </div>
        </div>

        {/* Basic job information */}
        <div className="space-y-3 mb-4">
          <InfoRow
            icon={BriefcaseIcon}
            label="Ажлын нэр"
            value={jobRequest.title}
          />
          <InfoRow
            icon={MapPinIcon}
            label="Байршил"
            value={jobRequest.location || "Байршил оруулаагүй"}
          />
          <InfoRow
            icon={FileTextIcon}
            label="Ажлын төрөл"
            value={jobRequest.category}
          />
          <InfoRow
            icon={FileTextIcon}
            label="Тайлбар"
            value={jobRequest.description}
            multiline
          />
        </div>

        {/* People information */}
        <div className="space-y-3 mb-4">
          <InfoRow
            icon={HammerIcon}
            label="Гүйцэтгэх ажилтан"
            value={jobRequest.assignedTo || "Хариуцагч томилогдоогүй"}
          />
          <InfoRow
            icon={User}
            label="Хүсэлт гаргагч"
            value={jobRequest.requestedBy}
          />
        </div>

        {/* Timeline information */}
        <div className="space-y-2 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Хугацааны мэдээлэл
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TimelineItem
              icon={CalendarIcon}
              label="Үүсгэсэн"
              date={jobRequest.createdAt}
            />

            <TimelineItem
              icon={ClockIcon}
              label="Шинэчилсэн"
              date={jobRequest.updatedAt}
            />

            {jobRequest.dueDate && (
              <TimelineItem
                icon={AlertTriangleIcon}
                label="Дуусах хугацаа"
                date={jobRequest.dueDate}
                highlight={!isCompleted}
              />
            )}

            {jobRequest.completedAt && (
              <TimelineItem
                icon={CheckCircleIcon}
                label="Дууссан"
                date={jobRequest.completedAt}
                highlight={false}
                completed
              />
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 flex flex-col sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto transition-colors duration-200 rounded-lg"
          >
            Хаах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  multiline = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <div
          className={`text-sm font-medium text-foreground ${
            multiline ? "whitespace-pre-wrap" : ""
          }`}
        >
          {value || "-"}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  label,
  date,
  highlight = false,
  completed = false,
}: {
  icon: React.ElementType;
  label: string;
  date: string;
  highlight?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
        p-1.5 rounded-full 
        ${
          completed
            ? "bg-emerald-100 text-emerald-600"
            : highlight
            ? "bg-amber-100 text-amber-600"
            : "bg-muted text-muted-foreground"
        }
      `}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium ${
            highlight ? "text-amber-600" : completed ? "text-emerald-600" : ""
          }`}
        >
          {formatDate(new Date(date))}
        </p>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  try {
    return date.toLocaleString("mn-MN");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return "Invalid date";
  }
}
