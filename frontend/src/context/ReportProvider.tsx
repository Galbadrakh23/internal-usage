"use client";

import React, { createContext, useEffect, useState } from "react";
import { DailyReport, HourlyReport } from "@/interface";
import { apiUrl } from "@/utils/utils";
import axios from "axios";

type ReportProviderProps = {
  children: React.ReactNode;
};

type ReportContext = {
  dailyReports: DailyReport[];
  hourlyReports: HourlyReport[];
  loading: boolean;
  error: string | null;
  fetchAllDailyReports: () => void;
  fetchAllHourlyReports: () => void;
  deleteReport: (id: number) => void;
  updateReport: (id: number, updatedReport: Partial<DailyReport>) => void;
  refetchDailyReports: () => void;
  refetchHourlyReports: () => void;
};

export const ReportContext = createContext<ReportContext>({
  dailyReports: [],
  hourlyReports: [],
  loading: false,
  error: null,
  fetchAllDailyReports: () => {},
  fetchAllHourlyReports: () => {},
  deleteReport: () => {},
  updateReport: () => {},
  refetchDailyReports: () => {},
  refetchHourlyReports: () => {},
});

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [hourlyReports, setHourlyReports] = useState<HourlyReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllHourlyReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiUrl}/api/hourly`);
      if (res.status === 200) {
        setHourlyReports(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch hourly reports", error);
      setError("Failed to fetch hourly reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDailyReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiUrl}/api/reports`);
      if (res.status === 200) {
        setDailyReports(res.data);
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
        fetchAllDailyReports();
      }
    } catch (error) {
      console.error("Failed to delete report:", error);
      setError("Failed to delete report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (
    id: number,
    updatedReport: Partial<DailyReport>
  ) => {
    setLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/api/reports/${id}`, updatedReport);
      if (res.status === 200) {
        fetchAllDailyReports();
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      setError("Failed to update report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDailyReports();
    fetchAllHourlyReports();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        dailyReports,
        hourlyReports,
        loading,
        error,
        fetchAllDailyReports,
        fetchAllHourlyReports,
        deleteReport,
        updateReport,
        refetchDailyReports: fetchAllDailyReports,
        refetchHourlyReports: fetchAllHourlyReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
