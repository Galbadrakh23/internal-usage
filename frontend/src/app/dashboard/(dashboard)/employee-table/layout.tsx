"use client";
import { EmployeeProvider } from "@/context/EmployeeProvider";
export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <EmployeeProvider>{children}</EmployeeProvider>;
}
