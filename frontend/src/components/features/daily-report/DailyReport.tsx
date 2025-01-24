"use client";
import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save } from "lucide-react";

const DailyReport = () => {
  const [reports, setReports] = useState([
    { id: 1, content: "", author: "Б.Болд", timestamp: new Date() },
  ]);

  const addNewReport = () => {
    setReports([
      ...reports,
      { id: Date.now(), content: "", author: "Б.Болд", timestamp: new Date() },
    ]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Өдрийн тайлан</h1>
        <Button onClick={addNewReport} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Шинэ тайлан
        </Button>
      </div>

      {reports.map((report) => (
        <Card key={report.id} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Тайлан #{report.id}</CardTitle>
            <div className="text-sm text-gray-500">
              {report.timestamp.toLocaleDateString("mn-MN")}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Тайлангийн агуулга..."
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500"></div>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Хадгалах
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailyReport;
