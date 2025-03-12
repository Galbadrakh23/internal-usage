"use client";

import { useContext } from "react";
import { PatrolContext } from "@/context/PatrolProvider";

export const usePatrols = () => {
  const context = useContext(PatrolContext);
  if (context === undefined) {
    throw new Error("usePatrols must be used within a PatrolsProvider");
  }
  return context;
};
