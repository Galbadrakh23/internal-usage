"use client";
import { JobRequestProvider } from "@/context/JobRequestProvider";
export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <JobRequestProvider>{children}</JobRequestProvider>;
}
