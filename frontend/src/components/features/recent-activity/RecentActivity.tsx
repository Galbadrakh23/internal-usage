"use client";

import { useContext, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportContext } from "@/context/ReportProvider";
import { Clock, FileText, AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
type Activity = {
  title: string;
  type: "daily" | "hourly";
  createdAt: Date;
  updatedAt: Date;
  user: { name: string };
};

const RecentActivity = () => {
  const { dailyReports, hourlyReports } = useContext(ReportContext);

  const activities = useMemo(() => {
    const allActivities: Activity[] = [
      ...(dailyReports?.map((report) => ({
        ...report,
        type: "daily" as const,
      })) || []),
      ...(hourlyReports?.map((report) => ({
        ...report,
        type: "hourly" as const,
      })) || []),
    ];

    return allActivities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 7);
  }, [dailyReports, hourlyReports]);

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

const ActivityItem = ({ activity }: { activity: Activity }) => (
  <li className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
    <ActivityIcon type={activity.type} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {activity.title}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <ActivityBadge type={activity.type} />
        <RelativeTime date={activity.createdAt} />
      </div>
    </div>
    <UserInfo name={activity.user.name} />
  </li>
);

const ActivityIcon = ({ type }: { type: "daily" | "hourly" }) => (
  <div className="flex-shrink-0">
    <div className="p-2 rounded-full bg-gray-100">
      {type === "hourly" ? (
        <Clock className="h-5 w-5 text-gray-600" />
      ) : (
        <FileText className="h-5 w-5 text-gray-600" />
      )}
    </div>
  </div>
);

const ActivityBadge = ({ type }: { type: "daily" | "hourly" }) => (
  <Badge
    variant={type === "daily" ? "default" : "secondary"}
    className="text-xs"
  >
    {type === "daily" ? "Өдрийн" : "Цагийн"}
  </Badge>
);

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
