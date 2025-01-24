import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Сүүлийн үйл ажиллагаа</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Activity items */}
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b pb-4 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">Б.Болд өдрийн тайлан нэмсэн</p>
                  <p className="text-sm text-gray-500">2 цагийн өмнө</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivity;
