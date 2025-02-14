"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Delivery, TrackingItemData } from "@/interface";

type DeliveryContextType = {
  deliveries: Delivery[];
  isLoading: boolean;
  fetchDeliveries: () => Promise<void>;
  createDelivery: (deliveryData: TrackingItemData) => Promise<void>;
  updateDelivery: (
    id: string,
    deliveryData: Partial<TrackingItemData>
  ) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  error: string | null;
};

export const DeliveryContext = createContext<DeliveryContextType>({
  deliveries: [],
  isLoading: true,
  error: null,
  fetchDeliveries: async () => {},
  createDelivery: async () => {},
  updateDelivery: async () => {},
  deleteDelivery: async () => {},
});

export const DeliveryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/deliveries`, {
        withCredentials: true,
      });
      setDeliveries(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch deliveries";
      setError(errorMessage);
      console.error("Failed to fetch deliveries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDelivery = async (deliveryData: TrackingItemData) => {
    setError(null);
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/deliveries`,
        deliveryData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDeliveries((prev) => [...prev, data]);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create delivery";
      setError(errorMessage);
      console.error("Failed to create delivery:", error);
      throw error;
    }
  };

  const updateDelivery = async (
    id: string,
    deliveryData: Partial<TrackingItemData>
  ) => {
    if (!id) {
      console.error("Error: Delivery ID is undefined or null.");
      return;
    }
    console.log("Updating delivery with ID:", id); // Debugging log
    setError(null);
    try {
      const { data } = await axios.patch(
        `${apiUrl}/api/deliveries/${id}/status`,
        deliveryData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const refreshedData = await axios.get(`${apiUrl}/api/deliveries`, {
        withCredentials: true,
      });

      setDeliveries(refreshedData.data);

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update delivery";
      setError(errorMessage);
      console.error("Failed to update delivery:", error);
      throw error;
    }
  };

  const deleteDelivery = async (id: string) => {
    if (!id) {
      console.error("Error: Delivery ID is undefined or null.");
      return;
    }
    setError(null);
    try {
      await axios.delete(`${apiUrl}/api/deliveries/${id}`, {
        withCredentials: true,
      });
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete delivery";
      setError(errorMessage);
      console.error("Failed to delete delivery:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        isLoading,
        error,
        fetchDeliveries,
        createDelivery,
        updateDelivery,
        deleteDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};
