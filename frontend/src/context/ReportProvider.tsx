"use client";

import React, { createContext, useEffect, useState } from "react";
import { Report } from "@/interface";
import { apiUrl } from "@/utils/utils";
import axios from "axios";

type ReportProviderProps = {
  children: React.ReactNode;
};

type CreateReportData = Omit<Report, "id">;

type ReportContext = {
  Reports: Report[];
  loading: boolean;
  error: string | null;
  fetchAllReports: () => void;
  deleteReport: (id: number) => void;
  updateReport: (id: number, updatedReport: Partial<Report>) => void;
  refetchReports: () => void;
  createReport: (data: CreateReportData) => Promise<void>;
};

export const ReportContext = createContext<ReportContext>({
  Reports: [],
  loading: false,
  error: null,
  fetchAllReports: () => {},
  deleteReport: () => {},
  updateReport: () => {},
  refetchReports: () => {},
  createReport: async () => {},
});

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [Reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiUrl}/api/reports`);
      if (res.status === 200) {
        setReports(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch daily reports:", error);
      setError("Failed to fetch daily reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: number) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/api/reports/${id}`);
      if (res.status === 200) {
        fetchAllReports();
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      setError("Failed to delete report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (id: number, updatedReport: Partial<Report>) => {
    setLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/api/reports/${id}`, updatedReport);
      if (res.status === 200) {
        fetchAllReports();
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      setError("Failed to update report. Please try again.");
    } finally {
      setLoading(false);
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
    fetchAllReports();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        Reports,
        loading,
        error,
        fetchAllReports,
        createReport,
        deleteReport,
        updateReport,
        refetchReports: fetchAllReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
