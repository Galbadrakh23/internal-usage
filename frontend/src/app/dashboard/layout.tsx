"use client";

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBar } from "@/components/features/sidebar/SideBar";
import Header from "@/components/layout_components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login"); // prevent going back
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarTrigger className="my-7 ml-4" />
      <main className="container mx-auto px-2 sm:px-8 lg:px-2">
        <div className="mt-8">
          <div className="max-w-8xl mx-auto space-y-4">
            <Header />
            <div className="p-8 rounded-lg mt-8 border border-blue-50">
              {children}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
