"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Plus, Calendar, MapPin } from "lucide-react";
import { useUsers } from "@/context/UserProvider";
import type { User as UserType } from "@/interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
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

interface CreateJobRequestModalProps {
  buttonText?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  categories?: string[];
}

export function CreateJobRequestModal({
  buttonText = "Ажлын хүсэлт үүсгэх",
  buttonVariant = "default",
  buttonSize = "default",
  className,
}: CreateJobRequestModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { users, isLoading: isLoadingUsers, error: usersError } = useUsers();
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Just pass the form data, let the createJobRequest function handle formatting
      await createJobRequest({
        ...data,
        location: data.location || "",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
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
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Шинэ ажлын хүсэлт үүсгэх
          </DialogTitle>
          <DialogDescription>
            Шинэ ажлын хүсэлт үүсгэхийн тулд доорх маягтыг бөглөнө үү.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Гарчиг*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ажлын гарчиг оруулах" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тайлбар*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ажлын хүсэлтийн тайлбар оруулах"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Яаралтай эсэх*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Яаралтай эсэх" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">
                          <div className="flex items-center">Бага</div>
                        </SelectItem>
                        <SelectItem value="MEDIUM">
                          <div className="flex items-center">Дунд</div>
                        </SelectItem>
                        <SelectItem value="HIGH">
                          <div className="flex items-center">Яаралтай</div>
                        </SelectItem>
                        <SelectItem value="URGENT">
                          <div className="flex items-center">Маш яаралтай</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Хийгдэх ажлын талаарх </FormLabel>
                    <FormControl>
                      <Input placeholder="Ангилал оруулах" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Байршил</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Байршил оруулах"
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription> Хаана ажил хийгдэх вэ? </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Шалгасан хүн</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingUsers
                                ? "Уншиж байна..."
                                : "Шалгасан хүнийг сонгох"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Уншиж байна...
                          </SelectItem>
                        ) : users && users.length > 0 ? (
                          users.map((user: UserType) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-users" disabled>
                            Хэрэглэгч олдсонгүй
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {usersError && (
                      <div className="text-sm text-red-500">
                        Хэрэглэгчийн мэдээлэл ачааллахад алдаа гарлаа
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дуусах огноо</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-8"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requestedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хүсэлт гаргагч*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingUsers}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingUsers
                                ? "Уншиж байна..."
                                : "Хүсэлт гаргагчийг сонгох"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Уншиж байна...
                          </SelectItem>
                        ) : users && users.length > 0 ? (
                          users.map((user: UserType) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-users" disabled>
                            Хэрэглэгч олдсонгүй
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {usersError && (
                      <div className="text-sm text-red-500">
                        Хэрэглэгчийн мэдээлэл ачааллахад алдаа гарлаа
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Цуцлах
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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
