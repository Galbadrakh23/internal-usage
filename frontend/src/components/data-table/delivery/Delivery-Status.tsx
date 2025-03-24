"use client";

import { useState, useContext } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { MoreVertical, Trash2Icon, CheckCircle2, Clock } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeliveryStatusUpdater = ({ delivery }: { delivery: any }) => {
  const { updateDelivery, deleteDelivery } = useContext(DeliveryContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (newStatus: "PENDING" | "DELIVERED") => {
    if (!delivery) return; // Ensure delivery is valid before updating

    try {
      await updateDelivery(delivery, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDelivery(delivery);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete delivery", error);
    }
  };

  const statusOptions = [
    { status: "PENDING", label: "Үлдээсэн", icon: Clock },
    { status: "DELIVERED", label: "Хүлээлгэж өгсөн", icon: CheckCircle2 },
  ] as const;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Status buttons */}
        {statusOptions.map(({ status, icon: Icon }) => (
          <Button
            key={status} // Одоо "status" тодорхой болсон тул алдаа гарахгүй
            variant={delivery.status === status ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(status)}
            className="flex items-center gap-1"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        {/* Delete option in a simple dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Цэс нээх</span>
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              <span>Устгах</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
