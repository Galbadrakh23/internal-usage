"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TrackingItem } from "@/interface";
import StatusBadge from "../layout_components/StatusBadge";
import DeliveryStatusUpdater from "@/components/data-table/Delivery-Status";
import { DeliveryDetailsButton } from "@/components/data-table/DeliveryDetailsButton";

export const columns: ColumnDef<TrackingItem>[] = [
  {
    accessorKey: "trackingNo",
    header: "Илгээмжийн дугаар",
  },
  {
    accessorKey: "itemName",
    header: "Тайлбар",
  },
  {
    accessorKey: "status",
    header: "Төлөв",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) ?? "UNKNOWN";
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "receiverName",
    header: "Хүлээн авагч",
  },
  {
    accessorKey: "location",
    header: "Байршил",
  },
  {
    accessorKey: "weight",
    header: "Хэмжээ (kg)",
    cell: ({ row }) => <div>{row.getValue("weight")} kg</div>,
  },
  {
    accessorKey: "Үйлдэл",
    id: "actions",
    cell: ({ row }) => <DeliveryStatusUpdater deliveryId={row.original.id} />,
  },
  {
    accessorKey: "Үйлдэл",
    header: "Дэлгэрэнгүй",
    cell: ({ row }) => {
      const trackingItem = row.original;
      return <DeliveryDetailsButton delivery={trackingItem} />;
    },
  },
];
