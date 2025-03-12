"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { JobRequest } from "@/interface";

interface CreateJobRequestPayload {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string;
  location: string;
  dueDate?: Date;
  requestedBy: string;
}

type JobRequestContextType = {
  jobRequests: JobRequest[];
  isLoading: boolean;
  error: string | null;
  fetchJobRequests: () => Promise<void>;
  createJobRequest: (jobRequest: CreateJobRequestPayload) => Promise<void>;
};

export const JobRequestContext = createContext<JobRequestContextType>({
  jobRequests: [],
  isLoading: true,
  error: null,
  fetchJobRequests: async () => {},
  createJobRequest: async () => {},
});

export const JobRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/job-requests`, {
        withCredentials: true,
      });
      setJobRequests(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch job requests";
      setError(errorMessage);
      console.error("Failed to fetch job requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createJobRequest = async (jobRequest: CreateJobRequestPayload) => {
    setError(null);

    try {
      console.log("Creating job request with data:", jobRequest);

      const response = await axios.post(
        `${apiUrl}/api/job-requests`,
        jobRequest,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setJobRequests((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create job request";
        setError(errorMessage);
        console.error("Failed to create job request:", errorMessage);
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create job request";
        setError(errorMessage);
        console.error("Failed to create job request:", error);
      }
      throw error;
    }
  };

  // Fetch job requests when the component mounts
  useEffect(() => {
    fetchJobRequests();
  }, []);

  return (
    <JobRequestContext.Provider
      value={{
        jobRequests,
        isLoading,
        error,
        fetchJobRequests,
        createJobRequest,
      }}
    >
      {children}
    </JobRequestContext.Provider>
  );
};
