"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LogOut, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/context/UserProvider";

const Header = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };
  return (
    <header className="flex items-center justify-between mb-8 px-4 py-2">
      <div className="flex items-center gap-8">
        <Link href="/dashboard">
          <Image
            src="/Turelt-Logo.png"
            alt="Company logo"
            width={120}
            height={120}
            className="dark:invert"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="relative">
                <Image
                  src={user?.avatar || "/avatar.svg"}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-900" />
              </div>
              <span className="hidden md:inline-block font-medium">
                {user?.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            {/* Profile Header */}
            <div className="flex items-center gap-3 p-2 mb-1">
              <div className="relative shrink-0">
                <Image
                  src={user?.avatar || "/avatar.svg"}
                  alt={user?.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800 object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-900" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role || "User"}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer px-2 py-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
