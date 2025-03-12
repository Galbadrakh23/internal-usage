"use client";

import { useContext, useState } from "react";
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
import { DeliveryContext } from "@/context/DeliveryProvider";
import { UserContext } from "@/context/UserProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const deliveryFormSchema = z.object({
  trackingNo: z.string().min(1, "Бүртгэлийн дугаар оруулна уу"),
  itemName: z.string().min(1, "Тайлбар оруулна уу"),
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED"], {
    errorMap: () => ({ message: "Төлөв сонгоно уу" }),
  }),
  receiverName: z.string().min(2, "Хүлээн авагчийн нэр оруулна уу"),
  receiverPhone: z
    .string()
    .min(8, "Утасны дугаар оруулна уу")
    .regex(/^[0-9]+$/, "Зөвхөн тоо оруулна уу"),
  senderName: z.string().min(2, "Илгээгчийн нэр оруулна уу"),
  senderPhone: z
    .string()
    .min(8, "Утасны дугаар оруулна уу")
    .regex(/^[0-9]+$/, "Зөвхөн тоо оруулна уу"),
  location: z.string().min(1, "Байршил оруулна уу"),
  notes: z.string().optional(),
  weight: z
    .number()
    .min(0, "Жин 0-ээс их байх ёстой")
    .max(1000, "Жин хэт их байна")
    .nullable()
    .optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

const DeliveryModal = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createDelivery, error } = useContext(DeliveryContext);
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const generateTrackingNumber = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear().toString().slice(2)}${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
    return `TRK${formattedDate}${randomNum}`;
  };

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      trackingNo: generateTrackingNumber(),
      itemName: "",
      status: "PENDING",
      receiverName: "",
      receiverPhone: "",
      senderName: "",
      senderPhone: "",
      location: "",
      notes: "",
      weight: 0,
    },
  });

  // Reset form with new tracking number when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset form with a new tracking number when opening
      form.reset({
        trackingNo: generateTrackingNumber(),
        itemName: "",
        status: "PENDING",
        receiverName: "",
        receiverPhone: "",
        senderName: "",
        senderPhone: "",
        location: "",
        notes: "",
        weight: 0,
      });
    }
    setOpen(newOpen);
  };

  // Form submission handler
  const onSubmit = async (values: DeliveryFormValues) => {
    if (!user) {
      toast.error("Та нэвтэрч орно уу");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data with proper structure for API
      const deliveryData = {
        ...values,
        userId: user?.userId || "",
        notes: values.notes || "",
        weight: values.weight || 0,
      };

      // Log the data being sent to help debug API issues
      console.log("Sending delivery data:", deliveryData);

      await createDelivery(deliveryData);
      toast.success("Илгээмж амжилттай бүртгэгдлээ");
      setOpen(false);
    } catch (err) {
      // Enhanced error handling
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        const serverMessage =
          axiosError.response?.data?.message ||
          "Илгээмж бүртгэхэд алдаа гарлаа";
        toast.error(serverMessage);
        console.error("Server error details:", axiosError.response?.data);
      } else {
        const errorMessage = error || "Илгээмж бүртгэхэд алдаа гарлаа";
        toast.error(errorMessage);
        console.error("Delivery creation error:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="text-lg">+</span>
          <span>Илгээмж бүртгэх</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Илгээмж бүртгэл хийх</DialogTitle>
          <DialogDescription>
            Шинэ илгээмжийн бүртгэл үүсгэхийн тулд доорх мэдээллийг оруулна уу.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tracking Number and Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trackingNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бүртгэлийн дугаар</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="uppercase bg-gray-100"
                      />
                    </FormControl>
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
                        <SelectItem value="PENDING">Үлдээсэн</SelectItem>
                        <SelectItem value="DELIVERED">Хүргэгдсэн</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Item Description */}
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тайлбар</FormLabel>
                  <FormControl>
                    <Input placeholder="Илгээмжийн тайлбар" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sender and Receiver Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Илгээгчийн мэдээлэл</h3>
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Нэр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Утас</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаар"
                          {...field}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Хүлээн авагчийн мэдээлэл
                </h3>
                <FormField
                  control={form.control}
                  name="receiverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэр</FormLabel>
                      <FormControl>
                        <Input placeholder="Нэр" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Утас</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаар"
                          {...field}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хаяг байршил, тоот</FormLabel>
                    <FormControl>
                      <Input placeholder="Жишээ нь: 12 давхарт" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Жин (кг)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.0"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нэмэлт тэмдэглэл</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Нэмэлт тэмдэглэл" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Түр хүлээнэ үү..." : "Бүртгэл үүсгэх"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryModal;
