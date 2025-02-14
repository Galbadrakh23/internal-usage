"use client";

import { useState } from "react";
import { useContext } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CircleEllipsis,
  Trash2Icon,
  CheckCircle2,
  Truck,
  Clock,
} from "lucide-react";

const DeliveryStatusUpdater = ({ deliveryId }: { deliveryId: string }) => {
  const { updateDelivery, deleteDelivery } = useContext(DeliveryContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (
    newStatus: "PENDING" | "DELIVERED" | "IN_TRANSIT"
  ) => {
    try {
      await updateDelivery(deliveryId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDelivery(deliveryId);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete delivery", error);
    }
  };

  const statusOptions = [
    { status: "PENDING", label: "Үлдээсэн", icon: Clock },
    { status: "IN_TRANSIT", label: "Хүлээгдэж байна", icon: Truck },
    { status: "DELIVERED", label: "Хүлээлгэж өгсөн", icon: CheckCircle2 },
  ] as const;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="sr-only">Цэс нээх</span>
            <CircleEllipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Төлөв шинэчлэх</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map(({ status, label, icon: Icon }) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              className="flex items-center"
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            <span>Устгах</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хүргэлтийг устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Энэ нь хүргэлтийг бүрмөсөн устгах
              болно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeliveryStatusUpdater;
