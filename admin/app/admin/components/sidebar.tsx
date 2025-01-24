"use client";
import Link from "next/link";
import { Home, Users, LogOut } from "lucide-react";

export function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };
  return (
    <div className="w-64 bg-white h-full shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav className="mt-8">
        <Link
          href="/admin"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <Home className="mr-2" size={20} />
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <Users className="mr-2" size={20} />
          Users
        </Link>
        <a
          href="/login"
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
          onClick={() => handleLogout()}
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </a>
      </nav>
    </div>
  );
}
