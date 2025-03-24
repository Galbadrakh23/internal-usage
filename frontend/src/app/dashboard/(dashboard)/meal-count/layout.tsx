"use client";
import { MealCountProvider } from "@/context/MealCountProvider";

export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MealCountProvider>{children}</MealCountProvider>;
}
