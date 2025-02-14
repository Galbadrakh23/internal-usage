"use client";

import { useContext } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";

export const useDeliveries = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider");
  }
  return context;
};
