"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Utensils,
  Shield,
  ShoppingCart,
  Users,
  ChevronDown,
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

const items = [
  {
    title: "Өдрийн тайлан",
    url: "daily-report",
    icon: ClipboardList,
  },
  {
    title: "Цагийн тайлан",
    url: "time-report",
    icon: Clock,
  },
  {
    title: "Хоолны тоо",
    url: "meal-count",
    icon: Utensils,
  },
  {
    title: "Патрол чек",
    url: "#",
    icon: Shield,
  },
  {
    title: "Ажил бүртгэл",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Ажилтны мэдээлэл",
    url: "employee-table",
    icon: Users,
  },
];

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
              onClick={() => setIsCollapsed(!isCollapsed)}
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
              {items.map((item) => {
                const isActive = pathname?.includes(item.url);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`group w-full`}>
                      <Link
                        href={item.url}
                        className={`
                          flex items-center gap-3 px-4 py-2 rounded-lg
                          transition-colors duration-200
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{item.title}</span>
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
