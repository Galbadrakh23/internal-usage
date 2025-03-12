"use client";

import { useContext, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportContext } from "@/context/ReportProvider";
import { DeliveryContext } from "@/context/DeliveryProvider";
import { PatrolContext } from "@/context/PatrolProvider";
import { Clock, AlertCircle, User, Truck, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Activity = {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string };
  type: "report" | "delivery" | "patrol";
};

const RecentActivity = () => {
  const { Reports } = useContext(ReportContext);
  const { deliveries } = useContext(DeliveryContext);
  const { patrols } = useContext(PatrolContext);

  const activities = useMemo(() => {
    const allActivities: Activity[] = [
      ...(Reports?.map((report) => ({
        ...report,
        type: "report" as const,
        createdAt: new Date(report.createdAt),
      })) || []),
      ...(deliveries?.map((delivery) => ({
        ...delivery,
        title: delivery.itemName,
        updatedAt: new Date(),
        createdAt: new Date(delivery.createdAt),
        type: "delivery" as const,
      })) || []),
      ...(patrols?.map((patrol) => ({
        ...patrol,
        title: patrol.property.name,
        updatedAt: new Date(),
        createdAt: new Date(patrol.createdAt),
        type: "patrol" as const,
      })) || []),
    ];

    return allActivities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);
  }, [Reports, deliveries, patrols]);

  return (
    <Card className="mt-8">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-6 text-lg font-medium text-gray-800">
          <Clock className="h-5 w-5" />
          Cүүлд болсон үйл ажиллагаа
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <EmptyState />
        ) : (
          <ActivityList activities={activities} />
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <Alert className="m-4 bg-gray-50 text-gray-600 border-gray-200">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Одоогоор ямар нэгэн үйл ажиллагаа бүртгэгдээгүй байна
    </AlertDescription>
  </Alert>
);

const ActivityList = ({ activities }: { activities: Activity[] }) => (
  <ul className="divide-y divide-gray-100">
    {activities.map((activity, i) => (
      <ActivityItem key={i} activity={activity} />
    ))}
  </ul>
);

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "delivery":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "patrol":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "report":
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <li className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <RelativeTime date={activity.createdAt} />
          <span className="text-xs text-gray-400">•</span>
          <ActivityType type={activity.type} />
        </div>
      </div>
      <UserInfo name={activity.user.name} />
    </li>
  );
};

const ActivityType = ({ type }: { type: Activity["type"] }) => {
  const typeLabels = {
    daily: "Өдрийн тайлан",
    delivery: "Хүргэлт",
    patrol: "Эргүүл",
    report: "Тайлан",
  };

  return <span className="text-xs text-gray-500">{typeLabels[type]}</span>;
};

const RelativeTime = ({ date }: { date: Date }) => {
  const getRelativeTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Огноо буруу байна";
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

    if (minutes < 60) return `${minutes} минутын өмнө`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} цагийн өмнө`;
    return `${Math.floor(minutes / 1440)} өдрийн өмнө`;
  };

  return <p className="text-xs text-gray-500">{getRelativeTime(date)}</p>;
};

const UserInfo = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2">
    <User className="h-4 w-4 text-gray-400" />
    <span className="text-sm font-medium text-gray-700">{name}</span>
  </div>
);

export default RecentActivity;
