"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Patrol } from "@/interfaces/interface";

type CreatePatrolData = {
  notes: string;
  imagePath: string;
  status: string;
  totalCheckPoint: number;
  userId: string;
  propertyId: string;
};

type PatrolContextType = {
  patrols: Patrol[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchPatrols: (page?: number, limit?: number) => Promise<void>;
  createPatrol: (data: CreatePatrolData) => Promise<void>;
  updatePatrolStatus: (patrolId: string, status: string) => Promise<void>;
  deletePatrol: (patrolId: string) => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (intervalSeconds: number) => void;
};

export const PatrolContext = createContext<PatrolContextType>({
  patrols: [],
  isLoading: true,
  fetchPatrols: async () => {},
  createPatrol: async () => {},
  updatePatrolStatus: async () => {},
  deletePatrol: async () => {},
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  setAutoRefresh: () => {},
  setRefreshInterval: () => {},
});

export const PatrolProvider = ({ children }: { children: React.ReactNode }) => {
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPatrols = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/patrols`, {
        params: { page, limit },
        withCredentials: true,
      });

      if (data?.data && Array.isArray(data.data)) {
        setPatrols(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
        });
        setCurrentPage(page);
        setItemsPerPage(limit);
      } else {
        console.error("Invalid patrol data format:", data);
        setPatrols([]);
      }
    } catch (error) {
      console.error("Error fetching patrol data:", error);
      setPatrols([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for updates without changing the loading state
  const checkForUpdates = useCallback(async () => {
    if (!autoRefresh) return;

    try {
      const { data } = await axios.get(`${apiUrl}/api/patrols`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          // Optional: Add a timestamp parameter to avoid caching
          _t: Date.now(),
        },
        withCredentials: true,
      });

      if (data?.data && Array.isArray(data.data)) {
        // Check if data has changed by comparing with current patrols
        const hasChanged =
          JSON.stringify(data.data) !== JSON.stringify(patrols);

        if (hasChanged) {
          setPatrols(data.data);
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalItems: data.pagination.totalItems,
            hasNextPage: data.pagination.hasNextPage,
            hasPrevPage: data.pagination.hasPrevPage,
          });
        }
      }
    } catch (error) {
      console.error("Error checking for patrol updates:", error);
    }
  }, [autoRefresh, currentPage, itemsPerPage, patrols]);

  const createPatrol = async (patrolData: CreatePatrolData) => {
    setIsLoading(true);

    try {
      await axios.post(`${apiUrl}/api/patrols`, patrolData, {
        withCredentials: true,
      });

      // Refresh the entire list to ensure correct ordering
      await fetchPatrols(currentPage, itemsPerPage);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
        alert(error.response?.data?.message || "Failed to create patrol");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatrolStatus = async (patrolId: string, status: string) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${apiUrl}/api/patrols/${patrolId}`,
        { status },
        { withCredentials: true }
      );

      // Update the local state immediately
      setPatrols((prevPatrols) =>
        prevPatrols.map((patrol) =>
          patrol.id === patrolId
            ? { ...patrol, status: response.data.status }
            : patrol
        )
      );

      // Optional: Refresh all data to ensure consistency
      await fetchPatrols(currentPage, itemsPerPage);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating patrol status:", error.response?.data);
        throw new Error(
          error.response?.data?.message || "Failed to update patrol status"
        );
      } else {
        console.error("Unknown error:", error);
        throw new Error(
          "An unknown error occurred while updating patrol status"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatrol = useCallback(
    async (patrolId: string) => {
      if (!patrolId) {
        console.error("Error: Patrol ID is undefined or null.");
        return;
      }
      setIsLoading(true);
      try {
        await axios.delete(`${apiUrl}/api/patrols/${patrolId}`, {
          withCredentials: true,
        });

        // Update local state
        setPatrols((prevPatrols) =>
          prevPatrols.filter((patrol) => patrol.id !== patrolId)
        );

        // Refresh to update pagination
        await fetchPatrols(currentPage, itemsPerPage);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error deleting patrol:", error.response?.data);
          alert(error.response?.data?.message || "Failed to delete patrol");
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, fetchPatrols, itemsPerPage]
  );

  // Initial data load
  useEffect(() => {
    fetchPatrols();
  }, [fetchPatrols]);

  // Set up polling for updates
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      checkForUpdates();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, checkForUpdates]);

  return (
    <PatrolContext.Provider
      value={{
        patrols,
        createPatrol,
        isLoading,
        pagination,
        fetchPatrols,
        updatePatrolStatus,
        deletePatrol,
        setAutoRefresh,
        setRefreshInterval,
      }}
    >
      {children}
    </PatrolContext.Provider>
  );
};
