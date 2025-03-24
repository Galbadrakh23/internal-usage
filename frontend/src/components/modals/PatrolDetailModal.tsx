"use client";

import type * as React from "react";
import {
  CalendarIcon,
  IdCardIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
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
import { Patrol } from "@/interfaces/interface";
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
  if (!patrols) return null;

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
                value={patrols.checkedBy || "N/A"}
                valueClassName={
                  !patrols.checkedBy ? "text-muted-foreground italic" : ""
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
