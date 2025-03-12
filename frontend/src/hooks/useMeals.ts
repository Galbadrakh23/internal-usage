"use client";

import { useContext } from "react";
import { MealCountContext } from "@/context/MealCountProvider";

export const useMeals = () => {
  const context = useContext(MealCountContext);
  if (!context) {
    throw new Error("useMeals must be used within a MealProvider");
  }
  return context;
};
