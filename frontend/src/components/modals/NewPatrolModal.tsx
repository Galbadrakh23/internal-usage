"use client";

import { useContext, useState } from "react";
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
import { Loader2, Upload } from "lucide-react";
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

// Move these to constants or fetch from an API
const properties = [
  { id: "6b7955f1-e7af-49dd-9481-ac657edb2d51", name: "BlueMon" },
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
  const { createPatrol, isLoading } = useContext(PatrolContext);
  const { users } = useUsers();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // For now, we're just storing the file name as a placeholder
      form.setValue("imagePath", e.target.files[0].name);
    }
  };

  // This function would be implemented to actually upload the file to your server
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);

    // Mock upload process with a timeout
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            resolve(`/uploads/${file.name}`); // Return a mock path
          }
          return newProgress;
        });
      }, 300);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      let imagePath = data.imagePath || "";

      if (selectedFile) {
        imagePath = await uploadImage(selectedFile);
      }

      const userId = localStorage.getItem("userId") || "guest-user";

      await createPatrol({
        ...data,
        userId,
        totalCheckPoint: data.totalCheckPoint,
        propertyId: data.propertyId,
        status: data.status,
        notes: data.notes || "",
        imagePath: imagePath,
      });

      toast.success("Патрол амжилттай бүртгэгдлээ");
      form.reset();
      setSelectedFile(null);
      setUploadProgress(0);
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
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagePath"
              render={({}) => (
                <FormItem>
                  <FormLabel>Зураг</FormLabel>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          id="image-upload"
                          className="hidden"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                          className="w-full flex items-center justify-center"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {selectedFile ? selectedFile.name : "Зураг оруулах"}
                        </Button>
                      </div>
                    </FormControl>
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Цуцлах
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {(isLoading || isUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading || isUploading ? "Түр хүлээнэ үү..." : "Хадгалах"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
