"use client";

import React, { createContext, useContext } from "react";
import { revalidatePath } from "next/cache";
import { apiUrl } from "@/utils/utils";

// Define the shape of the context
interface CreateReportContextType {
  createReport: (
    data: CreateReportData
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
}

// Define the data structure for creating a report
interface CreateReportData {
  content: string;
  userId: string;
  date: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED";
}

// Create the context
const CreateReportContext = createContext<CreateReportContextType | undefined>(
  undefined
);

// Create a provider component
export const CreateReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const createReport = async (data: CreateReportData) => {
    try {
      const response = await fetch(`${apiUrl}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create report");
      }

      const newReport = await response.json();
      revalidatePath("/reports");
      return { success: true, data: newReport };
    } catch (error) {
      console.error("Error creating report:", error);
      return { success: false, error: "Failed to create report" };
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
  if (!context) {
    throw new Error(
      "useCreateReport must be used within a CreateReportProvider"
    );
  }
  return context;
};
