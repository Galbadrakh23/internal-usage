"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from "lucide-react";
import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";

const Header = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };
  return (
    <header className="flex items-center justify-between mb-8 px-4 py-2">
      <div className="flex items-center gap-8">
        <Link href="/">
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
              <Image
                src="/avatar.svg"
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuLabel className="font-normal"></DropdownMenuLabel>
            <DropdownMenuItem>
              <span>{user?.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/#" className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
