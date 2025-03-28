"use client";

import type React from "react";

import { useState, useContext, useCallback, memo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import * as z from "zod";
import { toast } from "sonner";
import { UserContext } from "@/context/UserProvider";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReportContext } from "@/context/ReportProvider";
import type { Report } from "@/interfaces/interface";

const reportFormSchema = z.object({
  title: z.string().min(1, "Гарчиг оруулна уу"),
  activity: z.string().min(1, "Дэлгэрэнгүй мэдээлэл оруулна уу"),
  content: z.string().min(1, "Агуулга оруулна уу"),
  date: z.date({
    required_error: "Огноо сонгоно уу",
  }),
  status: z.enum(["DAILY", "HOURLY", "IMPORTANT"], {
    errorMap: () => ({ message: "Төлөв сонгоно уу" }),
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

// Status options with visual indicators
const statusOptions = [
  { value: "DAILY", label: "Өдрийн", color: "bg-blue-500" },
  { value: "HOURLY", label: "Цагийн", color: "bg-green-500" },
  { value: "IMPORTANT", label: "Яаралтай", color: "bg-red-500" },
];

// Memoized form components for better performance
const FormFieldMemo = memo(
  ({ label, children }: { label: string; children: React.ReactNode }) => (
    <FormItem>
      <FormLabel className="font-medium text-sm">{label}</FormLabel>
      {children}
    </FormItem>
  )
);
FormFieldMemo.displayName = "FormFieldMemo";

interface EditReportModalProps {
  report: Report;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function EditReportModal({
  report,
  onOpenChange,
  open,
}: EditReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reportContext = useContext(ReportContext);
  if (!reportContext) {
    throw new Error("EditReportModal must be used within a ReportProvider");
  }
  const { updateReport } = reportContext;
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: report.title || "",
      activity: report.activity || "",
      content: report.content || "",
      status: report.status || "DAILY",
      date: report.date ? new Date(report.date) : new Date(),
    },
  });

  // Reset form when report prop changes
  useEffect(() => {
    if (report && open) {
      form.reset({
        title: report.title || "",
        activity: report.activity || "",
        content: report.content || "",
        status: report.status || "DAILY",
        date: report.date ? new Date(report.date) : new Date(),
      });
    }
  }, [report, form, open]);

  // Memoized submit handler to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (values: ReportFormValues) => {
      if (!user) {
        toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй");
        return;
      }

      setIsSubmitting(true);
      try {
        const reportData: Partial<Report> = {
          ...values,
          userId: user?.userId || "",
          updatedAt: new Date(),
        };

        await updateReport(report.id, reportData);
        toast.success("Тайлан амжилттай шинэчлэгдлээ");
        onOpenChange(false);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "isAxiosError" in err) {
          const axiosError = err as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          const errorMessage =
            axiosError.response?.data?.message || axiosError.message;
          console.error("Failed to update report:", axiosError.response?.data);
          toast.error(`Тайлан шинэчлэхэд алдаа гарлаа: ${errorMessage}`);
        } else {
          console.error("Failed to update report:", err);
          toast.error("Тайлан шинэчлэхэд алдаа гарлаа");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, updateReport, report.id, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 hover:bg-primary/10 transition-all duration-200 rounded-lg"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          <span>Засах</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-6 rounded-xl border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
        <DialogHeader className="mb-5 relative">
          <DialogTitle className="text-xl font-bold">Тайлан засах</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Тайлангийн мэдээллийг шинэчлэх
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormFieldMemo label="Гарчиг">
                    <FormControl>
                      <Input
                        placeholder="Тайлангийн гарчиг"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormFieldMemo>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormFieldMemo label="Төлөв сонгох">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg">
                          <SelectValue placeholder="Төлөв сонгох" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-lg">
                        {statusOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="focus:bg-primary/10 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${option.color}`}
                              ></span>
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormFieldMemo>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormFieldMemo label="Агуулга">
                  <FormControl>
                    <Input
                      placeholder="Үйл ажиллагааны талаар"
                      {...field}
                      className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormFieldMemo>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormFieldMemo label="Өдөр">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>Огноо сонгох</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-lg"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(selectedDate) =>
                            field.onChange(selectedDate ?? new Date())
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="rounded-lg border shadow-md"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormFieldMemo>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormFieldMemo label="Дэлгэрэнгүй">
                  <FormControl>
                    <Textarea
                      placeholder="Тайлангийн талаарх дэлгэрэнгүй мэдээлэл"
                      {...field}
                      rows={6}
                      className="resize-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormFieldMemo>
              )}
            />

            <DialogFooter className="mt-6 gap-2 flex flex-col sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto transition-colors duration-200 rounded-lg"
              >
                Цуцлах
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 rounded-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Түр хүлээнэ үү...
                  </>
                ) : (
                  "Тайлан шинэчлэх"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
