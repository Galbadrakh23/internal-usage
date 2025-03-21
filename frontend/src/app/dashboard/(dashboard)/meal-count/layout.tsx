"use client";
import { EmployeeProvider } from "@/context/EmployeeProvider";
import { MealCountProvider } from "@/context/MealCountProvider";
export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MealCountProvider>
      <EmployeeProvider>{children}</EmployeeProvider>
    </MealCountProvider>
  );
}
