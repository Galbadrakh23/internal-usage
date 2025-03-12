"use client";

import type React from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";

type MealCount = {
  id?: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
};

type MealCountContextType = {
  mealCounts: MealCount[];
  isLoading: boolean;
  error: string | null;
  fetchMealCounts: () => Promise<void>;
  createMealCount: (mealCountData: MealCount) => Promise<MealCount>;
  updateMealCount: (
    id: string,
    mealCountData: Partial<MealCount>
  ) => Promise<MealCount>;
  deleteMealCount: (id: string) => Promise<void>;
  incrementMealCount: (
    date: string,
    mealData: Partial<MealCount>
  ) => Promise<MealCount>;
  getMealCountByDate: (date: string) => MealCount | undefined;
};

export const MealCountContext = createContext<MealCountContextType>({
  mealCounts: [],
  isLoading: true,
  error: null,
  fetchMealCounts: async () => {},
  createMealCount: async () => ({} as MealCount),
  updateMealCount: async () => ({} as MealCount),
  deleteMealCount: async () => {},
  incrementMealCount: async () => ({} as MealCount),
  getMealCountByDate: () => undefined,
});

export const MealCountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mealCounts, setMealCounts] = useState<MealCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/meal-counts`, {
        withCredentials: true,
      });
      setMealCounts(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch meal counts";
      setError(errorMessage);
      console.error("Failed to fetch meal counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMealCount = async (mealCountData: MealCount) => {
    setError(null);
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/meal-counts`,
        mealCountData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMealCounts((prev) => [...prev, data]);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create meal count";
      setError(errorMessage);
      console.error("Failed to create meal count:", error);
      throw error;
    }
  };

  const updateMealCount = async (
    id: string,
    mealCountData: Partial<MealCount>
  ) => {
    if (!id) {
      console.error("Error: Meal Count ID is undefined or null.");
      throw new Error("Meal Count ID is required");
    }
    setError(null);
    try {
      const { data } = await axios.patch(
        `${apiUrl}/api/meal-counts/${id}`,
        mealCountData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the entire list to ensure consistency
      const refreshedData = await axios.get(`${apiUrl}/api/meal-counts`, {
        withCredentials: true,
      });

      setMealCounts(refreshedData.data);

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update meal count";
      setError(errorMessage);
      console.error("Failed to update meal count:", error);
      throw error;
    }
  };

  const deleteMealCount = async (id: string) => {
    if (!id) {
      console.error("Error: Meal Count ID is undefined or null.");
      return;
    }
    setError(null);
    try {
      await axios.delete(`${apiUrl}/api/meal-counts/${id}`, {
        withCredentials: true,
      });
      setMealCounts((prev) => prev.filter((mealCount) => mealCount.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete meal count";
      setError(errorMessage);
      console.error("Failed to delete meal count:", error);
      throw error;
    }
  };

  // Get meal count by date
  const getMealCountByDate = (date: string) => {
    return mealCounts.find((count) => count.date === date);
  };

  // Increment meal count for a specific date
  const incrementMealCount = async (
    date: string,
    mealData: Partial<MealCount>
  ) => {
    setError(null);
    try {
      const existingCount = getMealCountByDate(date);

      if (existingCount && existingCount.id) {
        // If entry exists, increment the counts
        const updatedData: Partial<MealCount> = {
          breakfast: (existingCount.breakfast || 0) + (mealData.breakfast || 0),
          lunch: (existingCount.lunch || 0) + (mealData.lunch || 0),
          dinner: (existingCount.dinner || 0) + (mealData.dinner || 0),
        };

        return await updateMealCount(existingCount.id, updatedData);
      } else {
        // Create new entry if none exists
        const newData: MealCount = {
          date,
          breakfast: mealData.breakfast || 0,
          lunch: mealData.lunch || 0,
          dinner: mealData.dinner || 0,
        };

        return await createMealCount(newData);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to increment meal count";
      setError(errorMessage);
      console.error("Failed to increment meal count:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMealCounts();
  }, []);

  return (
    <MealCountContext.Provider
      value={{
        mealCounts,
        isLoading,
        error,
        fetchMealCounts,
        createMealCount,
        updateMealCount,
        deleteMealCount,
        incrementMealCount,
        getMealCountByDate,
      }}
    >
      {children}
    </MealCountContext.Provider>
  );
};
