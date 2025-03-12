"use client";

import { useContext } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";

export const useDeliveries = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error("useDeliveries must be used within a DeliveryProvider");
  }
  return context;
};
