"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
import type { DailyReport } from "@/interface";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateReportModal } from "../create-report/CreateReportModal";

interface DailyReportListProps {
  dailyReports: DailyReport[];
}

export function DailyReportList({ dailyReports }: DailyReportListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = dailyReports.filter((report) =>
    report.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Өдрийн тайлангийн жагсаалт
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Хайх..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CreateReportModal />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Огноо</TableHead>
                <TableHead>Гарчиг</TableHead>
                <TableHead>Үйлдэл</TableHead>
                <TableHead>Үүсгэсэн ажилтан</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.content}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>{report.id}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Дэлгэрэнгүй</DropdownMenuItem>
                        <DropdownMenuItem>Засах</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Устгах
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
