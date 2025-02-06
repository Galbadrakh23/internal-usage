"use client";

import React, { createContext, useContext } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";

interface CreateReportHContextType {
  createHReport: (
    data: CreateHourlyReportData
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
}

interface CreateHourlyReportData {
  activity: string;
  userId: string;
  date: string;
}

const CreateHReportContext = createContext<
  CreateReportHContextType | undefined
>(undefined);

export const CreateReportHProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const createHReport = async (data: CreateHourlyReportData) => {
    console.log("Creating report with data:", data);
    try {
      const { data: newReport } = await axios.post(
        `${apiUrl}/api/hourly`,
        data
      );
      return { success: true, data: newReport };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create report",
      };
    }
  };

  return (
    <CreateHReportContext.Provider value={{ createHReport }}>
      {children}
    </CreateHReportContext.Provider>
  );
};

export const useCreateHReport = () => {
  const context = useContext(CreateHReportContext);
  if (!context)
    throw new Error(
      "useCreateHReport must be used within a CreateReportHProvider"
    );
  return context;
};
