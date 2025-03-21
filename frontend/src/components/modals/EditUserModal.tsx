import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/interface";
import { toast } from "sonner";

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, user: Partial<User>) => void;
}

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onEdit,
}: EditUserModalProps) {
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email) {
      setFormError("Бүх талбарыг бөглөнө үү");
      return;
    }

    try {
      onEdit(user.id, formData);
      toast.success("Хэрэглэгчийн мэдээллийг шинэчиллээ");
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Алдаа гарлаа");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Хэрэглэгч засах</DialogTitle>
          <DialogDescription>
            Хэрэглэгчийн мэдээллийг шинэчилнэ үү
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Нэр
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Ажилтны нэр"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Имэйл
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="email@example.com"
                type="email"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Роль
              </Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="ADMIN">Админ</option>
                <option value="USER">Ажилтан</option>
                <option value="MANAGER">Менежер</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Цуцлах
            </Button>
            <Button type="submit">Хадгалах</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
