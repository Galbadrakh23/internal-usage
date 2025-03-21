"use client";

import type * as React from "react";
import { useContext } from "react";
import {
  CalendarIcon,
  IdCardIcon,
  CrossCircledIcon,
  CheckCircledIcon,
  UpdateIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
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
import { PatrolContext } from "@/context/PatrolProvider";
import { Patrol } from "@/interface";

type PatrolStatus = "COMPLETED" | "PENDING" | "IN_PROGRESS";

interface PatrolDetailsModalProps {
  open: boolean;
  onClose: () => void;
  patrols: Patrol | null;
  onPrint?: () => void;
}

export function PatrolDetailsModal({
  open,
  onClose,
  patrols,
  onPrint,
}: PatrolDetailsModalProps) {
  const { updatePatrolStatus } = useContext(PatrolContext);

  if (!patrols) return null;

  const statusTranslations = {
    COMPLETED: "Дууссан",
    PENDING: "Хүлээгдэж буй",
    IN_PROGRESS: "Явж байна",
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircledIcon className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <UpdateIcon className="h-4 w-4" />;
      case "PENDING":
        return <QuestionMarkCircledIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-600";
      case "PENDING":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const handleStatusChange = async (newStatus: PatrolStatus) => {
    try {
      await updatePatrolStatus(patrols.id, newStatus);
      onClose(); // Close the modal after updating the status
    } catch (error) {
      console.error("Failed to update patrol status:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            Эргүүлийн дэлгэрэнгүй
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="grid gap-6 p-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Төлөв:</div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getStatusColor(
                    patrols.status
                  )} text-white px-3 py-1.5 flex items-center gap-1.5 transition-colors`}
                  aria-label={`Status: ${patrols.status}`}
                >
                  {getStatusIcon(patrols.status)}
                  {statusTranslations[patrols.status as PatrolStatus]}
                </Badge>
                <div className="flex gap-1">
                  {patrols.status !== "COMPLETED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange("COMPLETED")}
                      className="px-2"
                    >
                      <CheckCircledIcon className="h-4 w-4 text-emerald-500" />
                    </Button>
                  )}
                  {patrols.status !== "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange("IN_PROGRESS")}
                      className="px-2"
                    >
                      <UpdateIcon className="h-4 w-4 text-blue-500" />
                    </Button>
                  )}
                  {patrols.status !== "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange("PENDING")}
                      className="px-2"
                    >
                      <QuestionMarkCircledIcon className="h-4 w-4 text-amber-500" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <InfoRow
                icon={CrossCircledIcon}
                label="Тэмдэглэл"
                value={patrols.notes || "Тэмдэглэл байхгүй"}
                valueClassName={
                  !patrols.notes ? "text-muted-foreground italic" : ""
                }
              />
            </div>

            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow
                icon={IdCardIcon}
                label="Үүсгэсэн ажилтан"
                value={patrols.user?.name || "N/A"}
                valueClassName={
                  !patrols.user?.name ? "text-muted-foreground italic" : ""
                }
                className="md:col-span-1"
              />
              <InfoRow
                icon={CalendarIcon}
                label="Бүртгэсэн огноо"
                value={formatDate(new Date(patrols.createdAt))}
                className="md:col-span-1 md:justify-self-end"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 bg-muted/30 border-t">
          <Button variant="outline" onClick={onClose}>
            Хаах
          </Button>
          {onPrint && (
            <Button variant="secondary" onClick={onPrint}>
              Хэвлэх
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className = "",
  valueClassName = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="mt-0.5 bg-muted/50 p-1.5 rounded-md">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <div className={`text-base font-medium ${valueClassName}`}>{value}</div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
