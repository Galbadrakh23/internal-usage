"use client";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserProvider";
import UserTable from "@/components/data-table/user/UserTable";
import PageHeader from "@/components/layout_components/PageHeader";

export default function UsersPage() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UsersPage must be wrapped in a UserProvider.");
  }

  const { users, fetchUsers, deleteUser, updateUser, isLoading, error } =
    userContext;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Хэрэглэгчийн мэдээлэл" />
      </div>
      <UserTable
        users={users}
        onDelete={deleteUser}
        onEdit={(id, userData) => updateUser(id, userData)}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
}
