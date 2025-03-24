import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Utensils,
  Shield,
  ShoppingCart,
  Users,
  ChevronDown,
  Box,
  Menu,
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
import { useUsers } from "@/context/UserProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardIcon } from "@radix-ui/react-icons";
interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuCategory[] = [
  {
    category: "Менежмент",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: DashboardIcon },
      {
        title: "Хүргэлтийн мэдээлэл",
        url: "/dashboard/delivery-board",
        icon: Box,
      },
      {
        title: "Ажил бүртгэл",
        url: "/dashboard/job-request",
        icon: ShoppingCart,
      },
      {
        title: "Ажилтны мэдээлэл",
        url: "/dashboard/employee-table",
        icon: Users,
      },
    ],
  },
  {
    category: "Тайлан",
    items: [
      {
        title: "Нийт тайлан",
        url: "/dashboard/report-board",
        icon: CalendarCheck,
      },
      { title: "Хоолны тоо", url: "/dashboard/meal-count", icon: Utensils },
      { title: "Патрол чек", url: "/dashboard/patrol-check", icon: Shield },
    ],
  },
];

const ADMIN_MENU_ITEMS: MenuCategory[] = [
  {
    category: "Admin",
    items: [
      { title: "Хэрэглэгчийн мэдээлэл", url: "/dashboard/admin", icon: Users },
    ],
  },
  ...MENU_ITEMS,
];

const getItemStyles = (isActive: boolean) => ({
  link: `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
  }`,
  icon: `${isActive ? "text-blue-600" : "text-gray-500"}`,
});

export function SideBar() {
  const pathname = usePathname();
  const { user } = useUsers();
  const [collapsed, setCollapsed] = useState(false);
  const [categoryCollapse, setCategoryCollapse] = useState<{
    [key: string]: boolean;
  }>({});

  const userRole = user?.role ?? "USER";
  const menuItems = userRole === "ADMIN" ? ADMIN_MENU_ITEMS : MENU_ITEMS;

  const toggleCategory = (category: string) => {
    setCategoryCollapse({
      ...categoryCollapse,
      [category]: !categoryCollapse[category],
    });
  };

  return (
    <TooltipProvider>
      <Sidebar
        className={`min-h-screen border-r bg-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent>
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <SidebarGroupLabel className="text-lg font-semibold text-gray-900">
                {userRole === "ADMIN"
                  ? "Админ"
                  : userRole === "MANAGER"
                  ? "Менежер"
                  : "Ажилтан"}
              </SidebarGroupLabel>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="py-4">
            {menuItems.map((category, idx) => (
              <SidebarGroup key={idx} className="mb-4">
                {!collapsed && (
                  <div className="flex items-center justify-between px-4 py-2">
                    <SidebarGroupLabel className="text-sm font-medium text-gray-500">
                      {category.category}
                    </SidebarGroupLabel>
                    <button
                      onClick={() => toggleCategory(category.category)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          categoryCollapse[category.category]
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                )}

                <SidebarGroupContent
                  className={`transition-all duration-200 ${
                    categoryCollapse[category.category]
                      ? "h-0 overflow-hidden"
                      : ""
                  }`}
                >
                  <SidebarMenu className="flex flex-col gap-1 px-2">
                    {category.items.map(({ title, url, icon: Icon }) => {
                      const isActive =
                        url === "/dashboard"
                          ? pathname === url
                          : pathname === url || pathname?.startsWith(`${url}/`);
                      const styles = getItemStyles(isActive);

                      return (
                        <SidebarMenuItem key={title}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className="group w-full"
                              >
                                <Link
                                  href={url}
                                  className={`${styles.link} ${
                                    collapsed ? "justify-center px-2" : ""
                                  }`}
                                >
                                  <Icon className={`h-5 w-5 ${styles.icon}`} />
                                  {!collapsed && (
                                    <span className="font-medium">{title}</span>
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {collapsed && (
                              <TooltipContent side="right">
                                <p>{title}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}

export default SideBar;
