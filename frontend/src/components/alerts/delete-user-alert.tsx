"use client";

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
import { Trash } from "lucide-react";

interface DeleteUserAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteUserAlert({
  isOpen,
  onOpenChange,
  onConfirm,
}: DeleteUserAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Trash className="h-5 w-5" />
            <AlertDialogTitle>Хэрэглэгч устгах</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Та энэ үйлдлийг хийхдээ итгэлтэй байна уу. Хэрэглэгч сэргээх
            боломжгүй тул та дахин сайн нягтална уу!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Буцах</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Устгах
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
