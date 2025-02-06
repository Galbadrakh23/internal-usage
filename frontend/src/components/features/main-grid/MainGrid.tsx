"use client";

import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import {
  ClipboardList,
  Clock,
  Utensils,
  Shield,
  ShoppingCart,
  Users,
  ArrowRight,
} from "lucide-react";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { ReportContext } from "@/context/ReportProvider";
// Quick stats type
type QuickStat = {
  title: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  link: string;
  color: string;
};
const MainGrid = () => {
  const { employees } = useContext(EmployeeContext);
  const { dailyReports, hourlyReports } = useContext(ReportContext);

  // Quick stats data
  const quickStats: QuickStat[] = [
    {
      title: "Өдрийн тайлан",
      value: `${dailyReports.length}`,
      label: "тайлан",
      icon: <ClipboardList className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/daily-report",
      color: "bg-gray-50",
    },
    {
      title: "Цагийн тайлан",
      value: `${hourlyReports.length}`,
      label: "тайлан",
      icon: <Clock className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/time-report",
      color: "bg-gray-50",
    },
    {
      title: "Өнөөдрийн хоол",
      value: "156",
      label: "хүн",
      icon: <Utensils className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/meal-count",
      color: "bg-gray-50",
    },
    {
      title: "Patrol CheckPoint",
      value: "8",
      label: "цэг",
      icon: <Shield className="h-6 w-6 text-gray-600" />,
      link: "/dashboard",
      color: "bg-gray-50",
    },
    {
      title: "Ажил бүртгэл",
      value: "5",
      label: "захиалга",
      icon: <ShoppingCart className="h-6 w-6 text-gray-600" />,
      link: "/dashboard",
      color: "bg-gray-50",
    },
    {
      title: "Ажилтны мэдээлэл",
      value: `${employees.length}`,
      label: "ажилтан",
      icon: <Users className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/employee-table",
      color: "bg-gray-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickStats.map((stat, index) => (
        <Link href={stat.link} key={index}>
          <Card className="border border-gray-100 hover:border-gray-300 cursor-pointer transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="p-2">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MainGrid;
