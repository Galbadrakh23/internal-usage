"use client";

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <main className="container mx-auto px-2 sm:px-8 lg:px-2">
        <div className="mt-8 min-h-screen">
          <div className="max-w-8xl mx-auto space-y-4">
            <Header />
            <div className="p-4 mt-8 ">{children}</div>
            <footer className="text-center text-sm text-gray-500">
              <p>© Түрэлт LLC.</p>
            </footer>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
