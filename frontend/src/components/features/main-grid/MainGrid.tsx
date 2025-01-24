import React from "react";
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
// Quick stats type
type QuickStat = {
  title: string;
  value: string;
  icon: React.ReactNode;
  link: string;
};
const MainGrid = async () => {
  // Quick stats data
  const quickStats: QuickStat[] = [
    {
      title: "Өдрийн тайлан",
      value: "12 тайлан",
      icon: <ClipboardList className="h-6 w-6" />,
      link: "/daily-report",
    },
    {
      title: "Цагийн тайлан",
      value: "24 ажилтан",
      icon: <Clock className="h-6 w-6" />,
      link: "/time-report",
    },
    {
      title: "Өнөөдрийн хоол",
      value: "156 хүн",
      icon: <Utensils className="h-6 w-6" />,
      link: "/meal-count",
    },
    {
      title: "Patrol CheckPoint",
      value: "8 цэг",
      icon: <Shield className="h-6 w-6" />,
      link: "/#",
    },
    {
      title: "Ажил бүртгэл",
      value: "5 захиалга",
      icon: <ShoppingCart className="h-6 w-6" />,
      link: "/#",
    },
    {
      title: "Ажилтны мэдээлэл",
      value: `5 ажилтан`,
      icon: <Users className="h-6 w-6" />,
      link: "/employee-table",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickStats.map((stat, index) => (
        <Link href={stat.link} key={index}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default MainGrid;
