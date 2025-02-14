import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Employee, PaginationProps } from "@/interface";
import { Button } from "@/components/ui/button";

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
  const [selectedCompany, setSelectedDepartment] = useState<string | null>(
    null
  );

  const filteredData = selectedCompany
    ? data.filter((employee) => employee.company.name === selectedCompany)
    : data;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const company = Array.from(
    new Set(data.map((employee) => employee.company.name))
  );
  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-4">
        <select
          className="border rounded p-2"
          value={selectedCompany || ""}
          onChange={(e) => setSelectedDepartment(e.target.value || null)}
        >
          <option value="">Бүх алба хэлтэс</option>
          {company.map((companyName, index) => (
            <option
              key={`company-${index}-${companyName}`}
              value={companyName || ""}
            >
              {companyName}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          className="hover:bg-gray-100 transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Хэвлэх
        </Button>
      </div>
      <table className="w-full rounded-lg shadow-lg border bg-[#F4F4F5]">
        <thead className="bg-[#F4F4F5]">
          <tr className="text-center">
            {[
              "№",
              "Ажилтны нэр",
              "Албан тушаал",
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
                {employee.company.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 border border-[#E4E4E7]">
                {employee.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-sm text-gray-600 mt-6">
        {`${startIndex + 1}-${Math.min(
          endIndex,
          filteredData.length
        )} ажилтан харуулж байна (Нийт: ${filteredData.length})`}
      </div>
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
