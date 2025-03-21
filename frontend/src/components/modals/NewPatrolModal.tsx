"use client";

import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatrolContext } from "@/context/PatrolProvider";
import { useUsers } from "@/context/UserProvider";
import { User } from "@/interface";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const formSchema = z.object({
  checkPoint: z.string().min(1, "Checkpoint is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
  imagePath: z.string().optional(),
  checkedBy: z.string().min(1, "Checked by is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  totalCheckPoint: z.number().min(0, "Must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

const properties = [
  { id: "6b7955f1-e7af-49dd-9481-ac657edb2d51", name: "БльюМон" },
  { id: "7b5f9ebf-e6b7-4d41-b647-19e60d7a023a", name: "Архив" },
];

const statuses = [
  { value: "PENDING", label: "Хүлээгдэж буй" },
  { value: "ACTIVE", label: "Хийгдэж байгаа" },
  { value: "COMPLETED", label: "Дууссан" },
];

interface CreatePatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePatrolModal({
  isOpen,
  onClose,
}: CreatePatrolModalProps) {
  const { createPatrol } = useContext(PatrolContext);
  const { users } = useUsers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkPoint: "",
      status: "PENDING",
      notes: "",
      imagePath: "",
      checkedBy: "",
      propertyId: "",
      totalCheckPoint: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const userId = localStorage.getItem("userId") || "guest-user";

      await createPatrol({
        ...data,
        userId,
        totalCheckPoint: data.totalCheckPoint,
        propertyId: data.propertyId,
        status: data.status,
        notes: data.notes || "",
        imagePath: "imagePath",
      });

      toast.success("Патрол амжилттай бүртгэгдлээ");
      form.reset();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Патрол бүртгэхэд алдаа гарлаа"
        );
      } else {
        toast.error("Патрол бүртгэхэд алдаа гарлаа");
      }
      console.error("Create patrol error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Патрол бүртгэх</DialogTitle>
          <DialogDescription>
            Та патрол бүртгэх мэдээллийг оруулна уу.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="checkPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Шалгах цэгийн нэр</FormLabel>
                  <FormControl>
                    <Input placeholder="Шалгах цэг оруулах" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Шалгасан байршил</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Байршил Сонгох" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Төлөв</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Төлөв сонгох" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тэмдэглэл</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Тэмдэглэл бичих"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Шалгасан хүн</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Шалгасан хүнийг сонгох" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user: User) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalCheckPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нийт шалгасан байршил</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min=""
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Цуцлах
              </Button>
              <Button type="submit">Хадгалах</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
