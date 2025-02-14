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
  trackingNo: z
    .string()
    .min(1, "Бүртгэлийн дугаар оруулна уу")
    .regex(/^[A-Z0-9]+$/, "Барааг дугаарлах утга оруулна уу"),
  itemName: z.string().min(1, "Тайлбар оруулна уу"),
  status: z.enum(["PENDING", "DELIVERED", "IN_TRANSIT"], {
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
  const { user } = useContext(UserContext);
  const { createDelivery, error } = useContext(DeliveryContext);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      trackingNo: "",
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

  const onSubmit = async (values: DeliveryFormValues) => {
    if (!user?.userId) {
      toast.error("Та нэвтэрч орно уу");
      return;
    }
    setIsSubmitting(true);
    try {
      await createDelivery({
        ...values,
        userId: user.userId,
        notes: values.notes || "",
        weight: values.weight || 0,
      });
      toast.success("Илгээмж амжилттай бүртгэгдлээ");
      setOpen(false);
      form.reset();
    } catch (err) {
      const errorMessage = error || "Илгээмж бүртгэхэд алдаа гарлаа";
      toast.error(errorMessage);
      console.error("Delivery creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trackingNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бүртгэлийн дугаар</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Жишээ: TRK01"
                        {...field}
                        className="uppercase"
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
                        <SelectItem value="PENDING">Хүлээгдэж буй</SelectItem>
                        <SelectItem value="IN_TRANSIT">Үлдээсэн</SelectItem>
                        <SelectItem value="DELIVERED">Хүргэгдсэн</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                          type="tel"
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
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                              : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
