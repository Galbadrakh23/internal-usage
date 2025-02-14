"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { JobRequest, User } from "@/interface";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
}
interface JobRequestData {
  title: string;
  description: string;
  priority: JobRequest["priority"];
  category: string;
  location: string;
  assignedTo?: string;
  dueDate?: Date;
  requestedBy: string;
}

// Define the context type with all available operations
type JobRequestContextType = {
  jobRequests: JobRequest[];
  isLoading: boolean;
  error: string | null;
  fetchJobRequests: () => Promise<void>;
  createJobRequest: (jobRequestData: JobRequestData) => Promise<JobRequest>;
  updateJobRequest: (
    id: string,
    jobRequestData: Partial<JobRequestData>
  ) => Promise<JobRequest>;
  updateStatus: (
    id: string,
    status: JobRequest["status"]
  ) => Promise<JobRequest>;
  addComment: (
    jobRequestId: string,
    content: string,
    userId: string
  ) => Promise<Comment>;
};

// Create the context with default values
export const JobRequestContext = createContext<JobRequestContextType>({
  jobRequests: [],
  isLoading: true,
  error: null,
  fetchJobRequests: async () => {},
  createJobRequest: async () => {
    throw new Error("Not implemented");
  },
  updateJobRequest: async () => {
    throw new Error("Not implemented");
  },
  updateStatus: async () => {
    throw new Error("Not implemented");
  },
  addComment: async () => {
    throw new Error("Not implemented");
  },
});

export const JobRequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State management for job requests and UI state
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all job requests from the API
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

  // Create a new job request
  const createJobRequest = async (jobRequestData: JobRequestData) => {
    setError(null);
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/job-requests`,
        jobRequestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Add the new job request to our local state
      setJobRequests((prev) => [...prev, data]);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create job request";
      setError(errorMessage);
      console.error("Failed to create job request:", error);
      throw error;
    }
  };

  // Update an existing job request
  const updateJobRequest = async (
    id: string,
    jobRequestData: Partial<JobRequestData>
  ) => {
    if (!id) {
      console.error("Error: Job Request ID is undefined or null.");
      return Promise.reject(new Error("Invalid Job Request ID"));
    }

    setError(null);
    try {
      const { data } = await axios.put(
        `${apiUrl}/api/job-requests/${id}`,
        jobRequestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the job requests list to ensure we have the latest data
      await fetchJobRequests();
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update job request";
      setError(errorMessage);
      console.error("Failed to update job request:", error);
      throw error;
    }
  };

  // Update just the status of a job request
  const updateStatus = async (id: string, status: JobRequest["status"]) => {
    if (!id) {
      console.error("Error: Job Request ID is undefined or null.");
      return Promise.reject(new Error("Invalid Job Request ID"));
    }

    setError(null);
    try {
      const { data } = await axios.put(
        `${apiUrl}/api/job-requests/${id}`,
        { status },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local state with the new status
      setJobRequests((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status } : job))
      );

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      setError(errorMessage);
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  // Add a comment to a job request
  const addComment = async (
    jobRequestId: string,
    content: string,
    userId: string
  ) => {
    if (!jobRequestId) {
      console.error("Error: Job Request ID is undefined or null.");
      return Promise.reject(new Error("Invalid Job Request ID"));
    }

    setError(null);
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/job-requests/${jobRequestId}/comments`,
        { content, userId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the job requests to get the updated comments
      await fetchJobRequests();
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add comment";
      setError(errorMessage);
      console.error("Failed to add comment:", error);
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
        updateJobRequest,
        updateStatus,
        addComment,
      }}
    >
      {children}
    </JobRequestContext.Provider>
  );
};
