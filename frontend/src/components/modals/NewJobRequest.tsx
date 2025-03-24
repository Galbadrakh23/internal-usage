"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { JobRequestContext } from "@/context/JobRequestProvider";

const formSchema = z.object({
  title: z.string().min(1, "Гарчиг оруулах шаардлагатай"),
  description: z.string().min(1, "Тайлбар оруулах шаардлагатай"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  category: z.string().min(1, "Ангилал оруулах шаардлагатай"),
  location: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional().or(z.date().optional()),
  requestedBy: z.string().min(1, "Хүсэлт гаргагчийг сонгох шаардлагатай"),
});

type FormValues = z.infer<typeof formSchema>;

// Priority options with visual indicators
const priorityOptions = [
  { value: "LOW", label: "Бага", color: "bg-blue-500" },
  { value: "MEDIUM", label: "Дунд", color: "bg-green-500" },
  { value: "HIGH", label: "Яаралтай", color: "bg-amber-500" },
  { value: "URGENT", label: "Маш яаралтай", color: "bg-red-500" },
];

interface CreateJobRequestModalProps {
  className?: string;
  categories?: string[];
}

export function CreateJobRequestModal({
  className,
}: CreateJobRequestModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { createJobRequest } = useContext(JobRequestContext);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      category: "",
      location: "",
      assignedTo: "",
      dueDate: "",
      requestedBy: "",
    },
  });

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        form.reset();
      }
      setOpen(open);
    },
    [form]
  );

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsSubmitting(true);

      try {
        await createJobRequest({
          ...data,
          location: data.location || "",
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          status: "IN_PROGRESS",
        });
        toast({
          title: "Амжилттай!",
          description: "Ажлын хүсэлт амжилттай үүсгэгдлээ.",
        });

        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Алдаа",
          description:
            error instanceof Error
              ? error.message
              : "Ажлын хүсэлт үүсгэхэд алдаа гарлаа",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [createJobRequest, router]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 hover:bg-primary/10 transition-all duration-200 rounded-lg ${className}`}
        >
          <PlusIcon className="h-4 w-4" />
          Ажил бүртгэх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-4 rounded-xl border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
        <DialogHeader className="">
          <DialogTitle className="text-lg font-semibold">
            Шинэ ажлын хүсэлт үүсгэх
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Ажлын гарчиг
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Хийгдэх ажлын талаарх
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg">
                              <SelectValue placeholder="Ангилал сонгох" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Цахилгаан",
                                "Сантехник",
                                "Аж ахуй",
                                "Агааржуулалт",
                                "Бусад",
                              ].map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Яаралтай эсэх
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg">
                              <SelectValue placeholder="Яаралтай эсэх" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-lg">
                            {priorityOptions.map((option) => (
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
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Тайлбар
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ажлын хүсэлтийн тайлбар оруулах"
                          className="min-h-[80px] resize-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Байршил
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Байршил оруулах"
                            className="pl-9 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground mt-1">
                        Хаана ажил хийгдэх вэ?
                      </FormDescription>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Гүйцэтгэх ажилтан
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="Гүйцэтгэх ажилтан"
                          {...field}
                        />
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Хүсэлт гаргагч
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="Хүсэлт гаргагч"
                          {...field}
                        />
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Дуусах огноо
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-9 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                            value={
                              typeof field.value === "string"
                                ? field.value
                                : field.value?.toISOString().split("T")[0] || ""
                            }
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2 flex flex-col sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
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
                    Үүсгэж байна...
                  </>
                ) : (
                  "Ажлын хүсэлт үүсгэх"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
