"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Clock,
  Utensils,
  Shield,
  Construction,
  Users,
  ArrowRight,
  Box,
} from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useReports } from "@/hooks/useReports";
import { useDeliveries } from "@/hooks/useDeliveries";
import type { QuickStat } from "@/interface";
import { usePatrols } from "@/hooks/usePatrols";
import { useTheme } from "next-themes";
import { useMeals } from "@/hooks/useMeals";

// Glow effect variants
const glowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  hover: {
    opacity: 1,
    scale: 1.1,
    transition: {
      opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.4, type: "spring", stiffness: 200, damping: 25 },
    },
  },
};

// Define gradients for different card types
const gradients =
  "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)";
const MainGrid = () => {
  const { employees } = useEmployees();
  const { Reports } = useReports();
  const { deliveries } = useDeliveries();
  const { patrols } = usePatrols();
  const { theme } = useTheme();
  const { mealCounts } = useMeals();
  console.log(mealCounts);

  const quickStats: (QuickStat & { gradient: string })[] = [
    {
      title: "Хүлээн авсан илгээмжүүд",
      value: `${deliveries.length}`,
      label: "Илгээмж",
      icon: <Box className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/delivery-board",
      color: "bg-gray-50",
      gradient: gradients,
    },
    {
      title: "Нийт тайлан",
      value: `${Reports.length}`,
      label: "Илгээсэн тайлан",
      icon: <Clock className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/report-board",
      color: "bg-gray-50",
      gradient: gradients,
    },
    {
      title: "Өнөөдрийн хоол",
      value: `${mealCounts.length}`,
      label: "Нийт хоол",
      icon: <Utensils className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/meal-count",
      color: "bg-gray-50",
      gradient: gradients,
    },
    {
      title: "Patrol CheckPoint",
      value: `${patrols?.length}`,
      label: "Патрол бүртгэл",
      icon: <Shield className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/patrol-check",
      color: "bg-gray-50",
      gradient: gradients,
    },
    {
      title: "Ажил бүртгэл",
      value: "5",
      label: "Ажлын захиалга",
      icon: <Construction className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/job-request",
      color: "bg-gray-50",
      gradient: gradients,
    },
    {
      title: "Ажилтны мэдээлэл",
      value: `${employees.length}`,
      label: "Ажилтан",
      icon: <Users className="h-6 w-6 text-gray-600" />,
      link: "/dashboard/employee-table",
      color: "bg-gray-50",
      gradient: gradients,
    },
  ];

  const isDarkTheme = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickStats.map((stat, index) => (
        <Link href={stat.link} key={index}>
          <motion.div initial="initial" whileHover="hover" className="relative">
            <motion.div
              className="absolute -inset-1 rounded-2xl z-0"
              variants={glowVariants}
              style={{
                background: stat.gradient,
                filter: isDarkTheme ? "brightness(1.2)" : "none",
              }}
            />
            <Card className="relative border border-gray-100/20 hover:border-gray-300/20 hover:shadow-lg cursor-pointer transition-all duration-200 group backdrop-blur-sm bg-background/80">
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
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default MainGrid;
