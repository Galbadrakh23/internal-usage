"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { JobRequest, JobRequestData } from "@/interfaces/interface";

interface CreateJobRequestPayload {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string;
  location: string;
  dueDate?: Date;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  assignedTo?: string;
}

type JobRequestContextType = {
  jobRequests: JobRequest[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchJobRequests: (page?: number, limit?: number) => Promise<void>;
  createJobRequest: (jobRequest: CreateJobRequestPayload) => Promise<void>;
  updateJobStatus: (
    id: string,
    jobRequest: Partial<JobRequestData>
  ) => Promise<JobRequest | void>;
  clearSuccessMessage: () => void;
};

export const JobRequestContext = createContext<JobRequestContextType>({
  jobRequests: [],
  isLoading: true,
  error: null,
  successMessage: null,
  fetchJobRequests: async () => {},
  createJobRequest: async () => {},
  updateJobStatus: async () => {},
  clearSuccessMessage: () => {},
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
});

export const JobRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const fetchJobRequests = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${apiUrl}/api/job-requests`, {
        params: { page, limit },
        withCredentials: true,
      });
      if (data?.data && Array.isArray(data.data)) {
        setJobRequests(data.data);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
        });
      } else {
        console.error("Invalid job request data format:", data);
        setJobRequests([]);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch job requests"
      );
      console.error("Error fetching job requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createJobRequest = async (jobRequest: CreateJobRequestPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${apiUrl}/api/job-requests`, jobRequest, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      await fetchJobRequests();
      setSuccessMessage("Job request created successfully");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
          ? error.message
          : "Failed to create job request";

      setError(errorMessage);
      console.error("Error creating job request:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobStatus = useCallback(
    async (
      id: string | { id: string },
      jobRequestData: Partial<JobRequestData>
    ) => {
      const jobId = typeof id === "string" ? id : id.id;
      if (!jobId) {
        console.error("Error: JobRequest ID is undefined or null.");
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const response = await axios.put(
          `${apiUrl}/api/job-requests/${jobId}`,
          { status: jobRequestData.status },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          await fetchJobRequests();
          setSuccessMessage("Job status updated successfully");

          setTimeout(() => setSuccessMessage(null), 3000);

          return response.data.data;
        } else {
          throw new Error(response.data.message || "Update failed on server");
        }
      } catch (error) {
        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to update JobRequest"
            : error instanceof Error
            ? error.message
            : "Failed to update JobRequest"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [fetchJobRequests]
  );

  useEffect(() => {
    fetchJobRequests();
  }, [fetchJobRequests]);

  return (
    <JobRequestContext.Provider
      value={{
        jobRequests,
        isLoading,
        error,
        successMessage,
        pagination,
        fetchJobRequests,
        createJobRequest,
        updateJobStatus,
        clearSuccessMessage,
      }}
    >
      {children}
    </JobRequestContext.Provider>
  );
};
