"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCcw } from "lucide-react";
import Pagination from "@/components/features/pagination/Pagination";
import CreatePatrolModal from "@/components/modals/NewPatrolModal";
import { PlusIcon } from "@radix-ui/react-icons";
import { PatrolDetailsModal } from "@/components/modals/PatrolDetailModal";
import { Patrol } from "@/interface";

type TableProps = {
  patrols: Patrol[];
  isLoading: boolean;
  fetchPatrols: () => Promise<void>;
  onViewDetails?: (patrol: Patrol) => void;
};

// Status badge component with Mongolian translation
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-300"; // Default color for undefined status

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "missed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "issues_found":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Translate status to Mongolian
  const translateStatus = (status: string) => {
    if (!status) return "Тодорхойгүй"; // Default translation for undefined status

    switch (status.toLowerCase()) {
      case "completed":
        return "Дууссан";
      case "pending":
        return "Хийгдэж байна";
      case "missed":
        return "Хүлээгдэж байна";
      case "issues_found":
        return "Зөрчил гарсан";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {translateStatus(status)}
    </span>
  );
};

const PatrolTable: React.FC<TableProps> = ({
  patrols,
  isLoading,
  fetchPatrols,
}) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Patrol | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const ITEMS_PER_PAGE = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatrol, setSelectedPatrol] = useState<Patrol | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getCheckpointTotal = (propertyName: string | undefined) => {
    if (!propertyName) return 0;

    const propertyNameLower = propertyName.toLowerCase();
    if (propertyNameLower === "bluemon") return 54;
    if (propertyNameLower === "архив") return 24;
    return 0; // Default for other properties
  };

  // Property options
  const propertyOptions = useMemo(() => {
    const properties = Array.from(
      new Set(patrols.map((p) => p.property?.name).filter(Boolean))
    );
    return ["", ...properties];
  }, [patrols]);

  // Handle sorting
  const handleSort = (field: keyof Patrol) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered and sorted data
  const filteredAndSortedPatrols = useMemo(() => {
    let result = [...patrols];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (patrol) =>
          patrol.property?.name?.toLowerCase().includes(term) ||
          patrol.user?.name?.toLowerCase().includes(term)
      );
    }

    // Filter by property
    if (selectedProperty && selectedProperty !== "") {
      result = result.filter(
        (patrol) => patrol.property?.name === selectedProperty
      );
    }

    return result;
  }, [patrols, searchTerm, selectedProperty]);

  // Pagination
  const totalPages = useMemo(
    () =>
      Math.max(1, Math.ceil(filteredAndSortedPatrols.length / ITEMS_PER_PAGE)),
    [filteredAndSortedPatrols.length]
  );

  const displayedPatrols = useMemo(() => {
    return filteredAndSortedPatrols.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredAndSortedPatrols, currentPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProperty]);

  // Handle page change
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Format checkpoint display
  const formatCheckpoints = (
    checkpoints: number,
    propertyName: string | undefined
  ) => {
    const total = getCheckpointTotal(propertyName);
    return `${checkpoints || 0} / ${total}`;
  };

  // Update the onViewDetails handler
  const handleViewDetails = (patrol: Patrol) => {
    setSelectedPatrol(patrol);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-8 px-3"
          size="sm"
          variant="outline"
        >
          <PlusIcon /> New Patrol
        </Button>
        <CreatePatrolModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <Button
          onClick={fetchPatrols}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="h-8 px-3"
          aria-label="Refresh data"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-1">Refresh</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            aria-label="Filter by property"
          >
            <option value="">Бүх барилга</option>
            {propertyOptions.map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading & Empty State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-lg text-gray-500">Loading data...</span>
        </div>
      ) : filteredAndSortedPatrols.length === 0 ? (
        <div className="bg-gray-50 rounded-lg py-16 text-center">
          <p className="text-gray-500 mb-2">No patrol records found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th
                  className="border-b p-3 text-left font-medium cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Он сар
                </th>
                <th
                  className="border-b p-3 text-left font-medium cursor-pointer"
                  onClick={() => handleSort("property")}
                >
                  Барилга
                </th>
                <th
                  className="border-b p-3 text-left font-medium cursor-pointer"
                  onClick={() => handleSort("user")}
                >
                  Ажилтан
                </th>
                <th
                  className="border-b p-3 text-center font-medium cursor-pointer"
                  onClick={() => handleSort("totalCheckPoint")}
                >
                  Нийт шалгасан
                </th>
                <th
                  className="border-b p-3 text-left font-medium cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Төлөв
                </th>
                <th className="border-b p-3 text-left font-medium"> Бусад </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displayedPatrols.map((patrol) => (
                <tr
                  key={patrol.createdAt}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{formatDate(patrol.createdAt)}</td>
                  <td className="p-3 font-medium">
                    {patrol.property?.name || "N/A"}
                  </td>
                  <td className="p-3">{patrol.user?.name || "N/A"}</td>
                  <td className="p-3 text-center font-medium">
                    {formatCheckpoints(
                      patrol.totalCheckPoint,
                      patrol.property?.name
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={patrol.status} />
                  </td>
                  <td className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(patrol)}
                      className="text-xs"
                    >
                      Дэлгэрэнгүй
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Patrol Details Modal */}
      {selectedPatrol && (
        <PatrolDetailsModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          patrols={selectedPatrol}
        />
      )}

      {/* Summary and Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <div className="text-sm text-gray-500">
          Нийт {filteredAndSortedPatrols.length} -аас {displayedPatrols.length}{" "}
          харуулаж байна.
        </div>
        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="flex justify-center items-center mt-2"></div>
    </div>
  );
};

export default PatrolTable;
