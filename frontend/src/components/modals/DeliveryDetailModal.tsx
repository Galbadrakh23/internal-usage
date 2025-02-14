"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Weight, User, PhoneCallIcon } from "lucide-react";
import type { TrackingItem } from "@/interface";
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
  if (!delivery) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-500";
      case "IN_TRANSIT":
        return "bg-blue-500";
      case "PENDING":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Дэлгэрэнгүй мэдээлэл
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-md font-semibold">
              {delivery.trackingNo}
            </Badge>
            <Badge className={`${getStatusColor(delivery.status)} text-white`}>
              {delivery.status}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Package className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Тайлбар</p>
                <p className="text-lg font-semibold">{delivery.itemName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Өгөх байршил
                </p>
                <p className="text-lg font-semibold">{delivery.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Хүлээн авагч
                </p>
                <p className="text-lg font-semibold">{delivery.receiverName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Weight className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Жин</p>
                <p className="text-lg font-semibold">{delivery.weight} kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PhoneCallIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Илгээгчийн мэдээлэл
                </p>
                <p className="text-lg font-semibold">
                  {delivery.senderName}
                  <span className="mx-1"> </span>
                  {delivery.senderPhone}
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Үүсгэсэн ажилтан
                </p>
                <p className="font-semibold">{delivery.user?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                Бүртгэсэн огноо
              </p>
              <p className="font-semibold">
                {new Date(delivery.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
