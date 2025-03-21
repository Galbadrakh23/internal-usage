"use client";
import { PatrolProvider } from "@/context/PatrolProvider";

export default function PatrolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatrolProvider>{children}</PatrolProvider>;
}
