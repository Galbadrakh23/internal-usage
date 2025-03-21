"use client";

import { useState } from "react";
import axios from "axios";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Define the MealCount type based on your table structure
interface MealCount {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

// Create a schema for form validation
const formSchema = z.object({
  date: z.string().min(1, { message: "Огноо оруулна уу" }),
  breakfast: z.coerce
    .number()
    .min(0, { message: "Өглөөний цай 0-с их байх ёстой" }),
  lunch: z.coerce.number().min(0, { message: "Өдрийн хоол 0-с их байх ёстой" }),
  dinner: z.coerce.number().min(0, { message: "Оройн хоол 0-с их байх ёстой" }),
});

interface MealCountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealCountModal({ isOpen, onClose }: MealCountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    },
  });

  const saveMealCount = async (
    mealCountData: MealCount
  ): Promise<MealCount> => {
    setError(null);
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/meal-counts`,
        mealCountData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Хоолны тоо хадгалахад алдаа гарлаа";
      setError(errorMessage);
      console.error("Failed to save meal count:", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await saveMealCount(values as MealCount);
      toast({
        title: "Амжилттай",
        description: "Хоолны тоо амжилттай хадгалагдлаа",
      });
      form.reset({
        date: new Date().toISOString().split("T")[0],
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is already set in saveMealCount
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Хоолны тоо бүртгэх</DialogTitle>
          <DialogDescription>
            Хоолны тооны мэдээллийг оруулна уу. Дууссаны дараа хадгалах товчийг
            дарна уу.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Огноо</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakfast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Өглөөний цай</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>Өглөөний цайны тоо</FormDescription>
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
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>Өдрийн хоолны тоо</FormDescription>
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
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>Оройн хоолны тоо</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
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
