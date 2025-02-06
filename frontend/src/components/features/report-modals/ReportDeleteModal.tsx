import React, { useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReportContext } from "@/context/ReportProvider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ReportDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle: string;
}

export function ReportDeleteModal({
  onClose,
  reportId,
}: ReportDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const reportContext = useContext(ReportContext);

  // Early return if context is not available
  if (!reportContext) {
    console.error("ReportContext is not available.");
    return null;
  }

  const { deleteReport } = reportContext;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteReport(reportId ? parseInt(reportId) : 0);
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Failed to delete report:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 hover:bg-slate-100"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Тайланг устгах уу?</AlertDialogTitle>
          <AlertDialogDescription>
            Та тайланг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах
            боломжгүй.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Цуцлах</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-500 text-white"
          >
            {isDeleting ? "Устгаж байна..." : "Устгах"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
