"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import CreatePatrolModal from "@/components/modals/NewPatrolModal";
import { PatrolDetailsButton } from "@/components/buttons/PatrolDetailsButton";
import PatrolStatusUpdater from "@/components/data-table/patrol/Patrol-Status";
import { Patrol } from "@/interfaces/interface";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-300";

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
  const translateStatus = (status: string) => {
    if (!status) return "Тодорхойгүй";

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

type TableProps = {
  patrols: Patrol[];
  isLoading: boolean;
  fetchPatrols: () => Promise<void>;
};

const PatrolTable: React.FC<TableProps> = ({ patrols, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  const getCheckpointTotal = (propertyName: string | undefined) => {
    if (!propertyName) return 0;

    const propertyNameLower = propertyName.toLowerCase();
    if (propertyNameLower === "БльюМон".toLowerCase()) return 54;
    if (propertyNameLower === "архив") return 24;
    return 0;
  };

  const propertyOptions = useMemo(() => {
    const properties = Array.from(
      new Set(patrols.map((p) => p.property?.name).filter(Boolean))
    );
    return ["", ...properties];
  }, [patrols]);

  // Sort patrols by creation date, newest first
  const sortedPatrols = useMemo(() => {
    return [...patrols].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [patrols]);

  // Apply property filter to the sorted patrols
  const filteredPatrols = useMemo(() => {
    if (!selectedProperty) return sortedPatrols;
    return sortedPatrols.filter(
      (patrol) => patrol.property?.name === selectedProperty
    );
  }, [sortedPatrols, selectedProperty]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatCheckpoints = (
    checkpoints: number,
    propertyName: string | undefined
  ) => {
    const total = getCheckpointTotal(propertyName);
    return `${checkpoints || 0} / ${total}`;
  };

  const columns: TableColumn<Patrol>[] = [
    {
      id: "createdAt",
      header: "Он сар",
      accessorFn: (patrol) => patrol.createdAt,
      cell: (value) => formatDate(value),
      searchable: true,
    },
    {
      id: "property",
      header: "Барилга",
      accessorFn: (patrol) => patrol.property?.name || "N/A",
      searchable: true,
    },
    {
      id: "user",
      header: "Ажилтан",
      accessorFn: (patrol) => patrol.checkedBy || "N/A",
      searchable: true,
    },
    {
      id: "checkpoints",
      header: "Нийт шалгасан",
      accessorFn: (patrol) => patrol.totalCheckPoint,
      cell: (value, patrol) => formatCheckpoints(value, patrol.property?.name),
    },
    {
      id: "status",
      header: "Төлөв",
      accessorFn: (patrol) => patrol.status,
      cell: (value) => <StatusBadge status={value} />,
      searchable: true,
    },
    {
      id: "detail",
      header: "Дэлгэрэнгүй",
      accessorFn: (patrol) => patrol,
      cell: (patrol: Patrol) => <PatrolDetailsButton patrol={patrol} />,
    },
    {
      id: "actions",
      header: "Төлөв өөрчлөх",
      accessorFn: (patrol) => patrol.id,
      cell: (patrol: Patrol) => <PatrolStatusUpdater patrol={patrol} />,
    },
  ];

  const actionComponents = (
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={() => setIsModalOpen(true)} variant="outline">
        <PlusIcon className="mr-1 h-4 w-4" /> Патрол бүртгэх
      </Button>
    </div>
  );
  const selectProperty = (
    <select
      className="py-2 px-2  border border-gray-200 rounded-md bg-white"
      value={selectedProperty}
      onChange={(e) => setSelectedProperty(e.target.value)}
      aria-label="Filter by property"
    >
      <option value="">Бүх барилга</option>
      {propertyOptions.map(
        (property) =>
          property && (
            <option key={property} value={property}>
              {property}
            </option>
          )
      )}
    </select>
  );

  return (
    <div className="space-y-4">
      <DynamicTable
        data={filteredPatrols}
        columns={columns}
        idField="id"
        isLoading={isLoading}
        selectProperty={selectProperty}
        pageSize={10}
        searchPlaceholder="Хайх..."
        noDataMessage="Эргүүлийн мэдээлэл олдсонгүй"
        loadingMessage="Ачааллаж байна..."
        actionComponents={actionComponents}
      />

      {/* Modals */}
      <CreatePatrolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PatrolTable;
