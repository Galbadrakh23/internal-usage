"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Delivery, TrackingItemData } from "@/interface";

type DeliveryContextType = {
  deliveries: Delivery[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchDeliveries: (page?: number, limit?: number) => Promise<void>;
  createDelivery: (deliveryData: TrackingItemData) => Promise<Delivery>;
  updateDelivery: (
    id: string,
    deliveryData: Partial<TrackingItemData>
  ) => Promise<Delivery | void>;
  deleteDelivery: (id: string) => Promise<void>;
  error: string | null;
};

export const DeliveryContext = createContext<DeliveryContextType>({
  deliveries: [],
  isLoading: true,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  fetchDeliveries: async () => {},
  createDelivery: async () => {
    throw new Error("Not implemented");
  },
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchDeliveries = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/deliveries`, {
        params: { page, limit },
        withCredentials: true,
      });

      if (Array.isArray(data.data)) {
        setDeliveries(data.data); // ✅ Fix: Set only deliveries
        setPagination(data.pagination);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch deliveries"
      );
      console.error("Failed to fetch deliveries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDelivery = useCallback(
    async (deliveryData: TrackingItemData): Promise<Delivery> => {
      setError(null);
      try {
        const { data } = await axios.post(
          `${apiUrl}/api/deliveries`,
          deliveryData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        await fetchDeliveries();
        return data;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create delivery"
        );
        console.error("Failed to create delivery:", error);
        throw error;
      }
    },
    [fetchDeliveries]
  );

  const updateDelivery = useCallback(
    async (id: string, deliveryData: Partial<TrackingItemData>) => {
      if (!id) {
        console.error("Error: Delivery ID is undefined or null.");
        return;
      }

      setError(null);
      try {
        await axios.patch(
          `${apiUrl}/api/deliveries/${id}/status`,
          deliveryData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        await fetchDeliveries(); // ✅ Fetch fresh data
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to update delivery"
        );
        console.error("Failed to update delivery:", error);
        throw error;
      }
    },
    [fetchDeliveries]
  );

  const deleteDelivery = useCallback(
    async (id: string) => {
      if (!id) {
        console.error("Error: Delivery ID is undefined or null.");
        return;
      }
      setError(null);
      try {
        await axios.delete(`${apiUrl}/api/deliveries/${id}`, {
          withCredentials: true,
        });
        await fetchDeliveries(); // ✅ Ensure latest list is fetched
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to delete delivery"
        );
        console.error("Failed to delete delivery:", error);
        throw error;
      }
    },
    [fetchDeliveries]
  );

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <DeliveryContext.Provider
      value={{
        deliveries,
        isLoading,
        error,
        pagination,
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
