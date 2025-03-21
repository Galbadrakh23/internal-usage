import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import { useUsers } from "@/context/UserProvider";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default function NewUserModal() {
  const { createUser } = useUsers();
  const [showDialog, setShowDialog] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
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

    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Бүх талбарыг бөглөнө үү");
      return;
    }
    try {
      await createUser(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      setShowDialog(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Алдаа гарлаа");
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon className="mr-1 h-4 w-4" /> <span>Шинэ бүртгэл</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Шинэ хэрэглэгч үүсгэх</DialogTitle>
          <DialogDescription>
            Шинэ хэрэглэгчийн мэдээллийг оруулна уу
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
              <Label htmlFor="password" className="text-right">
                Нууц үг
              </Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="••••••••"
                type="password"
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
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="ADMIN">Админ</option>
                <option value="USER">Ажилтан</option>
                <option value="MANAGER">Менежер</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Цуцлах
            </Button>
            <Button type="submit">Үүсгэх</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
