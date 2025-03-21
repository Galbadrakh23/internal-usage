"use client";

import React, { createContext, useEffect, useState, useCallback } from "react";
import { Report } from "@/interface";
import { apiUrl } from "@/utils/utils";
import axios from "axios";

type ReportProviderProps = {
  children: React.ReactNode;
};

type CreateReportData = Omit<Report, "id">;

type ReportContext = {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchReports: (page?: number, limit?: number) => Promise<void>;
  deleteReport: (id: number) => void;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
  refetchReports: () => void;
  createReport: (data: CreateReportData) => Promise<void>;
};

export const ReportContext = createContext<ReportContext>({
  reports: [],
  isLoading: true,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  fetchReports: async () => {},
  deleteReport: () => {},
  updateReport: () => {},
  refetchReports: () => {},
  createReport: async () => {},
});

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchReports = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/reports`, {
        params: { page, limit },
        withCredentials: true,
      });

      if (data?.data && Array.isArray(data.data)) {
        setReports(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
        });
      } else {
        console.error("Invalid patrol data format:", data);
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching Reports data:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteReport = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/api/reports/${id}`);
      if (res.status === 200) {
        fetchReports();
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      setError("Failed to delete report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateReport = async (id: number, updatedReport: Partial<Report>) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/api/reports/${id}`, updatedReport);
      if (res.status === 200) {
        fetchReports();
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      setError("Failed to update report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createReport = async (reportData: CreateReportData) => {
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/api/reports`, reportData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setReports((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);

        console.error("Failed to create report:", {
          error: error.response?.data,
          statusCode: error.response?.status,
          requestData: {
            ...reportData,
            password: undefined,
            credentials: undefined,
          },
        });

        if (error.response?.data?.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create Reports";
        setError(errorMessage);
        console.error("Failed to create report:", error);
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        isLoading,
        error,
        pagination,
        fetchReports,
        createReport,
        deleteReport,
        updateReport,
        refetchReports: fetchReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
