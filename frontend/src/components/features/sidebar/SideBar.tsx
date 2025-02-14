"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Utensils,
  Shield,
  ShoppingCart,
  Users,
  ChevronDown,
  Box,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const MENU_ITEMS = [
  { title: "Нийт тайлан", url: "/dashboard/time-report", icon: Clock },
  {
    title: "Хүргэлтийн мэдээлэл",
    url: "/dashboard/delivery-board",
    icon: Box,
  },
  { title: "Хоолны тоо", url: "/dashboard/meal-count", icon: Utensils },
  { title: "Патрол чек", url: "#", icon: Shield },
  { title: "Ажил бүртгэл", url: "#", icon: ShoppingCart },
  { title: "Ажилтны мэдээлэл", url: "/dashboard/employee-table", icon: Users },
];

const getItemStyles = (isActive: boolean) => ({
  link: `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
  }`,
  icon: `h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`,
});

export function SideBar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <Sidebar className="min-h-screen border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-4">
            <SidebarGroupLabel className="text-lg font-semibold text-gray-900">
              Дотоод систем
            </SidebarGroupLabel>
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <SidebarGroupContent
            className={`transition-all duration-200 ${
              isCollapsed ? "h-0 overflow-hidden" : ""
            }`}
          >
            <SidebarMenu className="flex flex-col gap-4">
              {MENU_ITEMS.map(({ title, url, icon: Icon }) => {
                const isActive = pathname?.includes(url);
                const styles = getItemStyles(isActive);

                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild className="group w-full">
                      <Link href={url} className={styles.link}>
                        <Icon className={styles.icon} />
                        <span className="font-medium">{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default SideBar;
