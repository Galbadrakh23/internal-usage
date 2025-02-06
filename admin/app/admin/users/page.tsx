import { CreateUserForm } from "../components/create-user-form";
import { UserList } from "../components/user-list";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Create User Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Шинэ бүртгэл үүсгэх
            </CardTitle>
            <CardDescription>
              Шинэ хэрэглэгчийн мэдээллийг оруулна уу.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>
        {/* User List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Бүртгэлтэй байгаа хэрэглэгчид
            </CardTitle>
            <CardDescription>
              Бүртгэлтэй хэрэглэгчдийн жагсаалт.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent>
            <UserList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
