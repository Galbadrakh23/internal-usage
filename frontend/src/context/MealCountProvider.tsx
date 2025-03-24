"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { MealCount } from "@/interfaces/interface";

type MealCountContextType = {
  mealCounts: MealCount[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchMealCounts: (page?: number, limit?: number) => Promise<void>;
  createMealCount: (mealCountData: MealCount) => Promise<MealCount>;
  updateMealCount: (
    id: string,
    mealCountData: Partial<MealCount>
  ) => Promise<MealCount | void>;
  deleteMealCount: (id: string) => Promise<void>;
  error: string | null;
};

// Create the context with default values
export const MealCountContext = createContext<MealCountContextType>({
  mealCounts: [],
  isLoading: true,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  fetchMealCounts: async () => {},
  createMealCount: async () => {
    throw new Error("Not implemented");
  },
  updateMealCount: async () => {},
  deleteMealCount: async () => {},
});

export const MealCountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mealCounts, setMealCounts] = useState<MealCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchMealCounts = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/meal-counts`, {
        params: { page, limit },
        withCredentials: true,
      });

      if (Array.isArray(data.data)) {
        setMealCounts(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch meal counts"
      );
      console.error("Failed to fetch meal counts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMealCount = useCallback(
    async (mealCountData: MealCount): Promise<MealCount> => {
      setError(null);
      try {
        const { data } = await axios.post(
          `${apiUrl}/api/meal-counts`,
          mealCountData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        await fetchMealCounts(); // Refresh the list after creation
        return data;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create meal count"
        );
        console.error("Failed to create meal count:", error);
        throw error;
      }
    },
    [fetchMealCounts]
  );

  // Function to update an existing meal count
  const updateMealCount = useCallback(
    async (id: string, mealCountData: Partial<MealCount>) => {
      if (!id) {
        console.error("Error: Meal Count ID is undefined or null.");
        return;
      }

      setError(null);
      try {
        const { data } = await axios.patch(
          `${apiUrl}/api/meal-counts/${id}`,
          mealCountData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        await fetchMealCounts(); // Refresh the list after update
        return data;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to update meal count"
        );
        console.error("Failed to update meal count:", error);
        throw error;
      }
    },
    [fetchMealCounts]
  );

  // Function to delete a meal count
  const deleteMealCount = useCallback(
    async (id: string) => {
      if (!id) {
        console.error("Error: Meal Count ID is undefined or null.");
        return;
      }
      setError(null);
      try {
        await axios.delete(`${apiUrl}/api/meal-counts/${id}`, {
          withCredentials: true,
        });
        await fetchMealCounts(); // Refresh the list after deletion
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to delete meal count"
        );
        console.error("Failed to delete meal count:", error);
        throw error;
      }
    },
    [fetchMealCounts]
  );

  useEffect(() => {
    fetchMealCounts();
  }, [fetchMealCounts]);

  return (
    <MealCountContext.Provider
      value={{
        mealCounts,
        isLoading,
        error,
        pagination,
        fetchMealCounts,
        createMealCount,
        updateMealCount,
        deleteMealCount,
      }}
    >
      {children}
    </MealCountContext.Provider>
  );
};
