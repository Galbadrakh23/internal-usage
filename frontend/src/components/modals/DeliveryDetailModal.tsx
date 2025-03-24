"use client";

import type * as React from "react";
import {
  ArchiveIcon,
  PinTopIcon,
  PersonIcon,
  MobileIcon,
  CalendarIcon,
  IdCardIcon,
} from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { TrackingItem } from "@/interfaces/interface";
import { useMemo } from "react";
import { format } from "date-fns";

interface DeliveryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  delivery: TrackingItem | null;
}

export function DeliveryDetailsModal({
  open,
  onClose,
  delivery,
}: DeliveryDetailsModalProps) {
  const statusTranslations = useMemo(
    () => ({
      DELIVERED: "Хүргэгдсэн",
      PENDING: "Хүлээгдэж буй",
    }),
    []
  );
  if (!delivery) return null;

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-500";
      case "PENDING":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">
            Дэлгэрэнгүй мэдээлэл
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="default"
              className="text-md font-semibold px-3 py-1.5"
              aria-label="Tracking number"
            >
              {delivery.trackingNo}
            </Badge>
            <div className="flex items-center">
              <Badge
                className={`${getStatusColor(
                  delivery.status
                )} text-white px-3 py-1.5`}
                aria-label={`Status: ${delivery.status}`}
              >
                {statusTranslations[delivery.status]}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-5">
            <InfoRow
              icon={ArchiveIcon}
              label="Тайлбар"
              value={delivery.itemName}
            />
            <InfoRow
              icon={PinTopIcon}
              label="Өгөх байршил"
              value={delivery.location}
            />
            <InfoRow
              icon={PersonIcon}
              label="Хүлээн авагч"
              value={delivery.receiverName}
            />
            <InfoRow
              icon={MobileIcon}
              label="Илгээгчийн мэдээлэл"
              value={
                <>
                  <span className="font-semibold">{delivery.senderName}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <span>{delivery.senderPhone}</span>
                </>
              }
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              icon={IdCardIcon}
              label="Бүртгэсэн ажилтан"
              value={delivery.user?.name}
              className="md:col-span-1"
            />
            <InfoRow
              icon={CalendarIcon}
              label="Бүртгэсэн огноо"
              value={format(new Date(delivery.createdAt), "M/d/yyyy, hh:mm a")}
              className="md:col-span-1 md:justify-self-end"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="mt-0.5">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <div className="text-base font-semibold">{value}</div>
      </div>
    </div>
  );
}
