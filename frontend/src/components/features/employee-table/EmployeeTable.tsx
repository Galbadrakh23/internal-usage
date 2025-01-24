"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Employee {
  id: number;
  name: string | null;
  position: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

const TableStatic: React.FC<{ data: Employee[] }> = ({ data }) => {
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const filteredData = selectedDepartment
    ? data.filter((employee) => employee.department === selectedDepartment)
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const departments = Array.from(
    new Set(data.map((employee) => employee.department))
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {`${startIndex + 1}-${Math.min(
            endIndex,
            filteredData.length
          )} ажилтан харуулж байна (Нийт: ${filteredData.length})`}
        </div>
        <select
          className="border rounded p-2"
          value={selectedDepartment || ""}
          onChange={(e) => setSelectedDepartment(e.target.value || null)}
        >
          <option value="">Бүх алба хэлтэс</option>
          {departments.map((department) => (
            <option key={department} value={department || ""}>
              {department}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full rounded-lg shadow-lg border bg-[#F4F4F5]">
        <thead className="bg-[#F4F4F5]">
          <tr className="text-left">
            {[
              "№",
              "Ажилтны нэр",
              "Албан тушаал",
              "Имэйл",
              "Алба хэлтэс",
              "Утасны дугаар",
            ].map((header, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-xs font-semibold text-gray-700 border border-[#E4E4E7] ${
                  index === 0
                    ? "rounded-tl-lg"
                    : index === 5
                    ? "rounded-tr-lg"
                    : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {currentData.map((employee, index) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="text-center px-4 py-2 text-sm font-medium text-gray-700 border border-[#E4E4E7]">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900 border border-[#E4E4E7]">
                {employee.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border border-[#E4E4E7]">
                {employee.position}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border border-[#E4E4E7]">
                {employee.email}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border border-[#E4E4E7]">
                {employee.department}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border border-[#E4E4E7]">
                {employee.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableStatic;
