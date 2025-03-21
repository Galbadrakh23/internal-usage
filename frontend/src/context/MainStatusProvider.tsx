"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";

type DashboardStats = {
  employees: number;
  reports: number;
  deliveries: number;
  patrols: number;
  mealCounts: number;
  jobRequests: number;
};

type DashboardContextType = {
  dashboardStats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    employees: 0,
    reports: 0,
    deliveries: 0,
    patrols: 0,
    mealCounts: 0,
    jobRequests: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/dashboard`);
      setDashboardStats(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data"
      );
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const contextValue = useMemo(
    () => ({ dashboardStats, isLoading, error, fetchDashboardData }),
    [dashboardStats, isLoading, error, fetchDashboardData]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
