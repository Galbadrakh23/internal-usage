"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Edit2Icon, Trash, Users } from "lucide-react";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";
import type { User } from "@/interface";
import NewUserModal from "../modals/NewUserModal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DeleteUserAlert from "@/components/alerts/delete-user-alert";
import EditUserModal from "../modals/EditUserModal";

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (id: string, user: Partial<User>) => void;
  isLoading: boolean;
  error: string;
  success?: string;
}

const UserTable = ({
  users,
  onDelete,
  onEdit,
  isLoading,
  error,
  success,
}: UserTableProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [shownError, setShownError] = useState<string | null>(null);
  const [shownSuccess, setShownSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (error && error !== shownError) {
      toast.error("Алдаа гарлаа", {
        description: error,
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
        id: `error-${Date.now()}`,
      });
      setShownError(error);
    }

    if (success && success !== shownSuccess) {
      toast.success("Амжилттай", {
        description: success,
        duration: 3000,
        id: `success-${Date.now()}`,
      });
      setShownSuccess(success);
    }
  }, [error, success, shownError, shownSuccess]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            onDelete(userToDelete);
            setTimeout(resolve, 500);
          } catch (error) {
            reject(error);
          }
        }),
        {
          loading: "Хэрэглэгчийг устгаж байна...",
          success: "Хэрэглэгч амжилттай устгагдлаа",
          error: "Хэрэглэгчийг устгахад алдаа гарлаа",
        }
      );

      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns: TableColumn<User>[] = [
    {
      id: "name",
      header: "Нэр",
      accessorFn: (user) => user.name,
      searchable: true,
      sortable: true,
    },
    {
      id: "email",
      header: "И-мэйл",
      accessorFn: (user) => user.email,
      searchable: true,
      sortable: true,
    },
    {
      id: "role",
      header: "Роль",
      accessorFn: (user) => user.role,
      cell: (value) => (
        <Badge variant={value === "admin" ? "default" : "success"}>
          {value}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Бүртгэсэн огноо",
      accessorFn: (user) =>
        new Date(user.createdAt).toLocaleDateString("en-CA"),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      accessorFn: () => null,
      cell: (_, user) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(user)}
          >
            <Edit2Icon size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(user.id)}
          >
            <Trash size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Card className="shadow-sm p-8 text-center">Loading...</Card>;
  }

  if (users.length === 0) {
    return (
      <Card className="border-0 shadow-sm p-8 text-center text-muted-foreground">
        <Users className="h-10 w-10 opacity-20" />
        <p>No users found</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <DynamicTable
          data={users}
          columns={columns}
          idField="id"
          isLoading={isLoading}
          noDataMessage="Хэрэглэгч олдсонгүй"
          actionComponents={<NewUserModal />}
          pageSize={10}
        />
      </Card>

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={onEdit}
        />
      )}
      <DeleteUserAlert
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UserTable;
