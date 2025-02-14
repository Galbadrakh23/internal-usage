"use client";

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
