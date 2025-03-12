"use client";

import { useState } from "react";
import { useUsers } from "@/context/UserProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Search,
  Pencil,
  Trash,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/interface";
import NewUserModal from "@/components/modals/NewUserModal";
import { Separator } from "@/components/ui/separator";

export default function AdminUserDashboard() {
  const { users, isLoading, error, deleteUser, toggleUserStatus } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    await toggleUserStatus(userId, currentStatus);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-medium">Бүртгэлтэй хэрэглэгч</h1>
        </div>
        <NewUserModal />
      </div>

      <Separator className="mb-6" />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="bg-background border">
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Бүх хэрэглэгч</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Active</span>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-1.5">
              <UserX className="h-3.5 w-3.5" />
              <span>Inactive</span>
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-background border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all">
          <UserTable
            users={filteredUsers}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="active">
          <UserTable
            users={filteredUsers.filter((user) => user.status === "active")}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <UserTable
            users={filteredUsers.filter((user) => user.status === "inactive")}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onStatusToggle: (id: string, status: string) => void;
  isLoading: boolean;
  error: string;
}

const UserTable = ({
  users,
  onDelete,
  onStatusToggle,
  isLoading,
  error,
}: UserTableProps) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="h-5 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-0 shadow-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-8 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-10 w-10 opacity-20" />
            <p>No users found</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-b border-muted/30">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "success"}
                    className="font-normal"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStatusToggle(user.id, user.status)}
                      title={
                        user.status === "active"
                          ? "Deactivate user"
                          : "Activate user"
                      }
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      {user.status === "active" ? (
                        <XCircle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit user"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user.id)}
                      title="Delete user"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:text-red-500"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
