"use client";
import { ReportProvider } from "@/context/ReportProvider";

export default function PatrolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReportProvider>{children}</ReportProvider>;
}
