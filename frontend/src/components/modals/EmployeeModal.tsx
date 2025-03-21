"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

// Form validation schema
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Нэр 2-оос дээш тэмдэгт байх ёстой" }),
  position: z
    .string()
    .min(2, { message: "Албан тушаал 2-оос дээш тэмдэгт байх ёстой" }),
  phone: z
    .string()
    .min(8, { message: "Утасны дугаар 8-аас дээш тэмдэгт байх ёстой" }),
  companyId: z.string().min(1, { message: "Компани сонгоно уу" }),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface Company {
  id: string;
  name: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyId?: string;
  companies: Company[];
  onSuccess: () => void;
  addEmployee: (employeeData: EmployeeFormValues) => Promise<void>;
}

export function EmployeeModal({
  isOpen,
  onClose,
  selectedCompanyId,
  companies,
  onSuccess,
  addEmployee,
}: EmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      position: "",
      phone: "",
      companyId: selectedCompanyId || "",
    },
  });

  useEffect(() => {
    if (selectedCompanyId) {
      console.log("Selected company ID:", selectedCompanyId);
      form.setValue("companyId", selectedCompanyId);
    }
  }, [selectedCompanyId, form]);

  async function onSubmit(data: EmployeeFormValues) {
    console.log("Submitting employee data:", data);
    setIsSubmitting(true);
    try {
      await addEmployee(data);
      toast({
        title: "Амжилттай",
        description: "Шинэ ажилтан амжилттай нэмэгдлээ",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Алдаа",
        description: "Ажилтан нэмэх үед алдаа гарлаа",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Шинэ ажилтан нэмэх</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нэр</FormLabel>
                  <FormControl>
                    <Input placeholder="Ажилтны нэр" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Албан тушаал</FormLabel>
                  <FormControl>
                    <Input placeholder="Албан тушаал" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Утас</FormLabel>
                  <FormControl>
                    <Input placeholder="Утасны дугаар" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компани</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="" disabled>
                        Компани сонгох
                      </option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
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

export default EmployeeModal;
