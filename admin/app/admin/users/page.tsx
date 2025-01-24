import { CreateUserForm } from "../components/create-user-form";
import { UserList } from "../components/user-list";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Шинэ бүртгэл үүсгэх</h2>
          <CreateUserForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Бүртгэлтэй байгаа хэрэглэгчид
          </h2>
          <UserList />
        </div>
      </div>
    </div>
  );
}
