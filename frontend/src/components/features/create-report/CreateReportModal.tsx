import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateReport } from "@/context/CreateReportProvider";
import { UserContext } from "@/context/UserProvider";
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
import { PlusCircle } from "lucide-react";

type ReportStatus = "ИЛГЭЭМЖ" | "ТЭМДЭГЛЭЛ" | "МЭДЭЭЛЭЛ";

interface FormData {
  title: string;
  content: string;
  date: string;
  status: ReportStatus;
}
export function CreateReportModal() {
  const { createReport } = useCreateReport();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    date: "",
    status: "ИЛГЭЭМЖ",
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

    // Double-check user existence before submission
    if (!user?.userId) {
      setError("Та системд нэвтэрсэн байх шаардлагатай.");
      setOpen(false);
      return;
    }

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    setIsLoading(true);

    try {
      const reportData = {
        ...formData,
        userId: user.userId,
      };

      const result = await createReport(reportData);

      if (result?.success) {
        setOpen(false);
        setFormData({ title: "", content: "", date: "", status: "ИЛГЭЭМЖ" });
        router.refresh();
      } else {
        setError(result?.error || "Тайлан үүсгэх үед алдаа гарлаа.");
      }
    } catch (err) {
      console.error("Error creating report:", err);
      setError("Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  // Disable the trigger button if user is not logged in
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
            { id: "title", label: "Гарчиг", type: "input" },
            { id: "content", label: "Агуулга", type: "textarea" },
            { id: "date", label: "Огноо", type: "date" },
            { id: "status", label: "Төрөл", type: "select" },
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
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="status" disabled={isLoading}>
                    <SelectValue placeholder="Төлөв сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ИЛГЭЭМЖ">Илгээмж</SelectItem>
                    <SelectItem value="ТЭМДЭГЛЭЛ">Тэмдэглэл</SelectItem>
                    <SelectItem value="МЭДЭЭЛЭЛ">Мэдээлэл</SelectItem>
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
            {isLoading ? "Үүсгэж байна..." : "Тайлан үүсгэх"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
