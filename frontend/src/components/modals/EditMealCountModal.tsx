"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { MealCount } from "@/interfaces/interface";
import { toast } from "sonner";
import { MealCountContext } from "@/context/MealCountProvider";

// Define form schema for validation
const formSchema = z.object({
  breakfast: z.coerce
    .number()
    .min(0, "Өглөөний хоолны тоо 0-ээс их байх ёстой"),
  lunch: z.coerce.number().min(0, "Өдрийн хоолны тоо 0-ээс их байх ёстой"),
  dinner: z.coerce.number().min(0, "Оройн хоолны тоо 0-ээс их байх ёстой"),
});

interface EditMealCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealCount: MealCount;
}

export function EditMealCountModal({
  isOpen,
  onClose,
  mealCount,
}: EditMealCountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateMealCount, fetchMealCounts } = useContext(MealCountContext);

  // Initialize form with existing meal count data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breakfast: mealCount.breakfast,
      lunch: mealCount.lunch,
      dinner: mealCount.dinner,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      await updateMealCount(mealCount.id, {
        breakfast: values.breakfast,
        lunch: values.lunch,
        dinner: values.dinner,
      });

      await fetchMealCounts();

      toast.success("Амжилттай", {
        description: "Хоолны тоо амжилттай шинэчлэгдлээ",
      });

      onClose();
    } catch (error) {
      console.error("Error updating meal count:", error);
      toast.error("Алдаа", {
        description: "Хоолны тоог шинэчлэхэд алдаа гарлаа",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Хоолны тоо засах</DialogTitle>
          <DialogDescription>
            {mealCount.date
              ? format(new Date(mealCount.date), "yyyy-MM-dd")
              : ""}{" "}
            өдрийн хоолны тоог шинэчлэх
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="breakfast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Өглөөний хоол</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Өглөөний хоолны тоо оруулах"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lunch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Өдрийн хоол</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Өдрийн хоолны тоо оруулах"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dinner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Оройн хоол</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Оройн хоолны тоо оруулах"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Цуцлах
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
