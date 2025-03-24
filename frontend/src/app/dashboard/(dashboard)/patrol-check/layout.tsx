"use client";
import { EmployeeProvider } from "@/context/EmployeeProvider";
import { PatrolProvider } from "@/context/PatrolProvider";

export default function PatrolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatrolProvider>
      <EmployeeProvider>{children}</EmployeeProvider>
    </PatrolProvider>
  );
}
