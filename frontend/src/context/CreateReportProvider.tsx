"use client";

import React, { createContext, useContext } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";

interface CreateReportContextType {
  createReport: (
    data: CreateReportData
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
}

interface CreateReportData {
  title: string;
  content: string;
  userId: string;
  date: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED";
}

const CreateReportContext = createContext<CreateReportContextType | undefined>(
  undefined
);

export const CreateReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const createReport = async (data: CreateReportData) => {
    console.log("Creating report with data:", data);
    try {
      const { data: newReport } = await axios.post(
        `${apiUrl}/api/reports`,
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
    <CreateReportContext.Provider value={{ createReport }}>
      {children}
    </CreateReportContext.Provider>
  );
};

export const useCreateReport = () => {
  const context = useContext(CreateReportContext);
  if (!context)
    throw new Error(
      "useCreateReport must be used within a CreateReportProvider"
    );
  return context;
};
