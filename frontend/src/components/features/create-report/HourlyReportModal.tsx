"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateHReport } from "@/context/CreateReportHProvider";
import { UserContext } from "@/context/UserProvider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";

interface FormData {
  title: string;
  activity: string;
  date: string;
}

export function HourlyReportModal() {
  const { createHReport } = useCreateHReport();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    activity: "",
    date: "",
  });

  useEffect(() => {
    if (open && !user?.userId) {
      setError("Та системд нэвтэрсэн байх шаардлагатай.");
      setOpen(false);
    }
  }, [open, user]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user?.userId) {
      setError("Та системд нэвтэрсэн байх шаардлагатай.");
      setOpen(false);
      return;
    }

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Тайлан үүсгэж байна...");
    setIsLoading(true);

    try {
      const reportData = {
        ...formData,
        userId: user.userId,
      };
      const result = await createHReport(reportData);
      if (result?.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Тайлан амжилттай үүслээ");

        setOpen(false);
        setFormData({
          title: "",
          activity: "",
          date: "",
        });
        router.refresh();
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        toast.error(result?.error || "Тайлан үүсгэх үед алдаа гарлаа.");
        setError(result?.error || "Тайлан үүсгэх үед алдаа гарлаа.");
      }
    } catch (err) {
      console.error("Error creating report:", err);
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.");
      setError("Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerButton = (
    <Button variant="outline" disabled={!user?.userId}>
      <PlusCircle className="h-4 w-4 mr-2" />
      <span>{user?.userId ? "Шинэ тайлан" : "Нэвтрэх шаардлагатай"}</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Шинэ тайлан үүсгэх</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm" role="alert">
              {error}
            </p>
          )}
          {[
            { id: "title", label: " Оруулах тайлангийн цаг", type: "select" },
            { id: "activity", label: "Агуулга", type: "textarea" },
            { id: "date", label: "Огноо", type: "date" },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  value={formData[field.id as keyof FormData]}
                  onChange={(e) =>
                    handleChange(field.id as keyof FormData, e.target.value)
                  }
                  disabled={isLoading}
                  required
                  rows={4}
                />
              ) : field.type === "select" ? (
                <Select onValueChange={(value) => handleChange("title", value)}>
                  <SelectTrigger id="status" disabled={isLoading}>
                    <SelectValue placeholder="Төлөвлөгөөт тайлангийн цагийг сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:40">07:40</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id as keyof FormData]}
                  onChange={(e) =>
                    handleChange(field.id as keyof FormData, e.target.value)
                  }
                  disabled={isLoading}
                  required
                  max={
                    field.type === "date"
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                />
              )}
            </div>
          ))}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Үүсгэж байна...
              </>
            ) : (
              "Тайлан үүсгэх"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
