"use client";

import React, { createContext, useEffect, useState } from "react";
import { DailyReport } from "@/interface";
import { apiUrl } from "@/utils/utils";
import axios from "axios";

type ReportProviderProps = {
  children: React.ReactNode;
};

type ReportContext = {
  dailyReports: DailyReport[];
  fetchAllDailyReports: () => void;
};

export const ReportContext = createContext<ReportContext>({
  dailyReports: [],
  fetchAllDailyReports: () => {},
});

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);

  const fetchAllDailyReports = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/reports`);
      if (res.status === 200) {
        console.log("API Response:", res.data); // Log the full API response
        const reports = res.data; // Check if this matches the actual API response
        setDailyReports(reports);
      }
    } catch (error) {
      console.error("Failed to fetch daily reports:", error);
    }
  };

  useEffect(() => {
    fetchAllDailyReports();
  }, []);

  return (
    <ReportContext.Provider value={{ dailyReports, fetchAllDailyReports }}>
      {children}
    </ReportContext.Provider>
  );
};
