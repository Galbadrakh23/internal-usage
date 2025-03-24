"use client";

import { useState, useContext } from "react";
import { JobRequestContext } from "@/context/JobRequestProvider";
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
import { MoreVertical, Trash2Icon, CheckCircle2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JobRequestStatusUpdater = ({ jobRequest }: { jobRequest: any }) => {
  const { updateJobStatus } = useContext(JobRequestContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusChange = async (
    newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED"
  ) => {
    if (!jobRequest) return; // Ensure job request is valid before updating

    try {
      await updateJobStatus(jobRequest, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const statusOptions = [{ status: "COMPLETED", icon: CheckCircle2 }] as const;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Status buttons */}
        {statusOptions.map(({ status, icon: Icon }) => (
          <Button
            key={status}
            variant={jobRequest.status === status ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(status)}
            className="flex items-center gap-1"
            disabled={jobRequest.status === "COMPLETED"}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        {/* Delete option in a dropdown */}
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
            <AlertDialogTitle>Ажлын хүсэлтийг устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Энэ нь ажлын хүсэлтийг бүрмөсөн
              устгах болно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JobRequestStatusUpdater;
