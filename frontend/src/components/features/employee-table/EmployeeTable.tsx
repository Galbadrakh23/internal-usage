"use client";

import { useContext, useState, useMemo } from "react";
import { EmployeeContext } from "@/context/EmployeeProvider";
import {
  DynamicTable,
  type TableColumn,
} from "@/components/data-table/DynamicTable";
import type { Employee } from "@/interface";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Pagination from "@/components/features/pagination/Pagination";

export default function EmployeeInformationPanel() {
  const { employees, addEmployee, fetchEmployees } =
    useContext(EmployeeContext);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm] = useState<string>("");
  const pageSize = 25;

  const companies = Array.from(
    new Set(employees.map((employee) => employee.company.name))
  ).sort();

  const filteredEmployees = useMemo(() => {
    const companyFiltered =
      selectedCompany === "all"
        ? [...employees]
        : employees.filter(
            (employee) => employee.company.name === selectedCompany
          );

    const searchFiltered = searchTerm
      ? companyFiltered.filter((employee) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            employee.name.toLowerCase().includes(searchLower) ||
            employee.position.toLowerCase().includes(searchLower) ||
            employee.company.name.toLowerCase().includes(searchLower) ||
            (employee.phone && employee.phone.includes(searchLower))
          );
        })
      : companyFiltered;

    return searchFiltered.sort((a, b) => b.name.localeCompare(a.name));
  }, [employees, selectedCompany, searchTerm]);

  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredEmployees.slice(startIndex, endIndex);

  const columns: TableColumn<Employee>[] = [
    {
      id: "name",
      header: "Нэр",
      accessorFn: (employee) => employee.name,
      searchable: true,
    },
    {
      id: "position",
      header: "Албан тушаал",
      accessorFn: (employee) => employee.position,
      searchable: true,
    },
    {
      id: "department",
      header: "Хэлтэс",
      accessorFn: (employee) => employee.company.name,
      searchable: true,
    },
    {
      id: "phone",
      header: "Утас",
      accessorFn: (employee) => employee.phone,
      searchable: true,
    },
  ];

  const handleCompanyChange = (value: string) => {
    console.log("Selected company changed to:", value);
    setSelectedCompany(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionComponents = (
    <div className="flex items-center gap-4">
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchEmployees();
          setIsModalOpen(false);
        }}
        selectedCompanyId={selectedCompany}
        companies={companies.map((company) => ({ id: company, name: company }))}
        addEmployee={addEmployee}
      />
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <Plus className="h-5 w-5" />
        Ажилтан нэмэх
      </Button>
    </div>
  );

  const selectCompany = (
    <Select
      value={selectedCompany}
      onValueChange={(value) => handleCompanyChange(value)}
    >
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Компани сонгох" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Бүгд</SelectItem>
        {companies.map((company) => (
          <SelectItem key={company} value={company}>
            {company}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <DynamicTable
        data={currentItems}
        columns={columns}
        idField="id"
        isLoading={false}
        pageSize={pageSize}
        searchPlaceholder="Ажилтан хайх..."
        noDataMessage="Ажилтны мэдээлэл олдсонгүй"
        loadingMessage="Ажилтны мэдээлэл ачааллаж байна..."
        actionComponents={actionComponents}
        selectCompany={selectCompany}
        showSearch={true}
      />
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
