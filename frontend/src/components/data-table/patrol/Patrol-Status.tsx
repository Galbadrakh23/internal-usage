"use client";

import { useState, useContext } from "react";
import { PatrolContext } from "@/context/PatrolProvider";
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
const PatrolStatusUpdater = ({ patrol }: { patrol: any }) => {
  const { updatePatrolStatus, deletePatrol } = useContext(PatrolContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (
    newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    if (!patrol) return;

    try {
      await updatePatrolStatus(patrol, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePatrol(patrol);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete patrol", error);
    }
  };

  const statusOptions = [
    { status: "PENDING", label: "Хүлээгдэж буй", icon: Clock },
    { status: "COMPLETED", label: "Дууссан", icon: CheckCircle2 },
  ] as const;

  return (
    <>
      <div className="flex items-center gap-2">
        {statusOptions.map(({ status, icon: Icon }) => (
          <Button
            key={status}
            variant={patrol.status === status ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(status)}
            className="flex items-center gap-1"
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

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
            <AlertDialogTitle>Эргүүлийг устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Энэ нь эргүүлийг бүрмөсөн устгах
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

export default PatrolStatusUpdater;
