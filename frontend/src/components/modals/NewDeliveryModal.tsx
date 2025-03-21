"use client";

import { useContext, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

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
import { TrackingItemData } from "@/interface";

const deliveryFormSchema = z.object({
  trackingNo: z.string().min(1, "Бүртгэлийн дугаар оруулна уу"),
  itemName: z.string().default("Илгээмж"), // Changed to default value instead of optional
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED"], {
    errorMap: () => ({ message: "Төлөв сонгоно уу" }),
  }),
  receiverName: z.string().optional(),
  senderName: z.string().optional(),
  senderPhone: z
    .string()
    .regex(/^[0-9]+$/, "Зөвхөн тоо оруулна уу")
    .optional()
    .or(z.literal("")),
  receiverPhone: z
    .string()
    .regex(/^[0-9]+$/, "Зөвхөн тоо оруулна уу")
    .optional(),
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

// Status options with visual indicators
const statusOptions = [
  { value: "PENDING", label: "Үлдээсэн", color: "bg-amber-500" },
  { value: "DELIVERED", label: "Хүргэгдсэн", color: "bg-green-500" },
];

const NewDeliveryModal = () => {
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
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `TR${formattedDate}${randomNum}`;
  };

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      trackingNo: generateTrackingNumber(),
      itemName: "", // Set default value
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

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        form.reset({
          trackingNo: generateTrackingNumber(),
          itemName: "Илгээмж", // Set default value
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
    },
    [form]
  );

  const onSubmit = useCallback(
    async (values: DeliveryFormValues) => {
      if (!user) {
        toast.error("Та нэвтэрч орно уу");
        return;
      }

      setIsSubmitting(true);
      try {
        const deliveryData: TrackingItemData = {
          userId: user?.userId || "",
          trackingNo: values.trackingNo,
          itemName: values.itemName || "Илгээмж",
          status: values.status,
          receiverName: values.receiverName ?? "",
          receiverPhone: values.receiverPhone,
          senderName: values.senderName,
          senderPhone: values.senderPhone || "",
          location: values.location,
          notes: values.notes || "",
          weight: values.weight || 0,
        };

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
    },
    [user, createDelivery, error]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover:bg-primary/10 transition-all duration-200 rounded-lg"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          <span>Илгээмж бүртгэх</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-4 rounded-xl border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold">
            Илгээмж бүртгэл хийх
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm">
            Шинэ илгээмжийн бүртгэл үүсгэхийн тулд доорх мэдээллийг оруулна уу.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Hidden Fields - These will still be submitted but not shown in the UI */}
            <input type="hidden" {...form.register("trackingNo")} />
            <input type="hidden" {...form.register("weight")} />

            {/* Sender and Receiver Information */}
            <div className="space-y-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-primary/80">
                  Хүлээн авагчийн мэдээлэл
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="receiverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Нэр{" "}
                          <span className="text-muted-foreground font-normal">
                            (заавал биш)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Нэр"
                            {...field}
                            className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiverPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-sm">
                          Утас
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Утасны дугаар"
                            {...field}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm">
                    Хаяг байршил, тоот
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Жишээ нь: 12 давхарт"
                      {...field}
                      className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Item Name */}
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm">Тайлбар</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Энд тайлбараа оруулна уу"
                      className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-primary/80">
                Илгээгчийн мэдээлэл
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">Нэр</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Нэр"
                          {...field}
                          className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm">
                        Утас
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаар"
                          {...field}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status selection */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm">Төлөв</FormLabel>
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
                          className="focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
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

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-sm">
                    Нэмэлт тэмдэглэл
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Нэмэлт тэмдэглэл"
                      {...field}
                      className="resize-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 rounded-lg"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <DialogFooter className="mt-4 gap-2 flex flex-col sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
                  "Бүртгэл үүсгэх"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDeliveryModal;
