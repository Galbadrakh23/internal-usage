"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Patrol } from "@/interface";

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
  fetchPatrols: () => Promise<void>;
  createPatrol: (data: CreatePatrolData) => Promise<void>;
  updatePatrolStatus: (patrolId: string, status: string) => Promise<void>;
};

export const PatrolContext = createContext<PatrolContextType>({
  patrols: [],
  isLoading: true,
  fetchPatrols: async () => {},
  createPatrol: async () => {},
  updatePatrolStatus: async () => {},
});

export const PatrolProvider = ({ children }: { children: React.ReactNode }) => {
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatrols = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/patrols`, {
        withCredentials: true,
      });

      if (Array.isArray(data)) {
        setPatrols(data);
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

  const createPatrol = async (patrolData: CreatePatrolData) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/patrols`, patrolData, {
        withCredentials: true,
      });

      setPatrols((prevPatrols: Patrol[]) => [...prevPatrols, response.data]);
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

      setPatrols((prevPatrols) =>
        prevPatrols.map((patrol) =>
          patrol.id === patrolId
            ? { ...patrol, status: response.data.status }
            : patrol
        )
      );
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

  useEffect(() => {
    fetchPatrols();
  }, [fetchPatrols]);

  return (
    <PatrolContext.Provider
      value={{
        patrols,
        createPatrol,
        isLoading,
        fetchPatrols,
        updatePatrolStatus,
      }}
    >
      {children}
    </PatrolContext.Provider>
  );
};
