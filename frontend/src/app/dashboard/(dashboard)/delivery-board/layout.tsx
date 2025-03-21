"use client";
import { DeliveryProvider } from "@/context/DeliveryProvider";

export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DeliveryProvider>{children}</DeliveryProvider>;
}
