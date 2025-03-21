"use client";

import { useDashboard } from "@/context/MainStatusProvider"; // Import the provider
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  CalendarCheck,
  Utensils,
  Shield,
  Construction,
  Users,
  ArrowRight,
  Box,
} from "lucide-react";

const MainGrid = () => {
  const { dashboardStats, isLoading } = useDashboard(); // Use data from provider

  const quickStats = [
    {
      title: "Хүргэлтийн мэдээлэл",
      value: isLoading ? "..." : dashboardStats.deliveries.toString(),
      label: "Илгээмж",
      icon: <Box className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/delivery-board",
      color: "bg-gray-50",
    },
    {
      title: "Ажил бүртгэл",
      value: isLoading ? "..." : dashboardStats.jobRequests.toString(),
      label: "Ажлын захиалга",
      icon: <Construction className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/job-request",
      color: "bg-gray-50",
    },
    {
      title: "Ажилтны мэдээлэл",
      value: isLoading ? "..." : dashboardStats.employees.toString(),
      label: "Ажилтан",
      icon: <Users className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/employee-table",
      color: "bg-gray-50",
    },
    {
      title: "Нийт тайлан",
      value: isLoading ? "..." : dashboardStats.reports.toString(),
      label: "Илгээсэн тайлан",
      icon: <CalendarCheck className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/report-board",
      color: "bg-gray-50",
    },
    {
      title: "Хоолны тоо",
      value: isLoading ? "..." : dashboardStats.mealCounts.toString(),
      label: "Нийт хоол",
      icon: <Utensils className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/meal-count",
      color: "bg-gray-50",
    },
    {
      title: "Патрол чек",
      value: isLoading ? "..." : dashboardStats.patrols.toString(),
      label: "Патрол бүртгэл",
      icon: <Shield className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/patrol-check",
      color: "bg-gray-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickStats.map((stat, index) => (
        <Link href={stat.link} key={index}>
          <Card className="relative border hover:border-gray-300 hover:shadow-lg cursor-pointer transition-all duration-200 group backdrop-blur-sm bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full transition-colors duration-200 bg-muted/50 group-hover:bg-muted">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-semibold text-foreground transition-colors duration-200">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                    {stat.label}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MainGrid;
