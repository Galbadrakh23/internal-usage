import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBar } from "@/components/features/sidebar/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarTrigger className="my-8 ml-4" />
      <main className="container mx-auto px-10 sm:px-8 lg:px-10">
        {children}
      </main>
    </SidebarProvider>
  );
}
