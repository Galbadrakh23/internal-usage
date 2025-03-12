import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReportProvider } from "@/context/ReportProvider";
import { UserProvider } from "@/context/UserProvider";
import { EmployeeProvider } from "@/context/EmployeeProvider";
import { DeliveryProvider } from "@/context/DeliveryProvider";
import { JobRequestProvider } from "@/context/JobRequestProvider";
import { PatrolProvider } from "@/context/PatrolProvider";
import { MealCountProvider } from "@/context/MealCountProvider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Turelt",
  description: "Internal-Usage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Toaster position="top-right" richColors />
        <UserProvider>
          <JobRequestProvider>
            <ReportProvider>
              <DeliveryProvider>
                <PatrolProvider>
                  <MealCountProvider>
                    <EmployeeProvider>{children}</EmployeeProvider>
                  </MealCountProvider>
                </PatrolProvider>
              </DeliveryProvider>
            </ReportProvider>
          </JobRequestProvider>
        </UserProvider>
      </body>
    </html>
  );
}
