import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReportProvider } from "@/context/ReportProvider";
import { CreateReportProvider } from "@/context/CreateReportProvider";

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
        <ReportProvider>
          <CreateReportProvider>{children}</CreateReportProvider>
        </ReportProvider>
      </body>
    </html>
  );
}
