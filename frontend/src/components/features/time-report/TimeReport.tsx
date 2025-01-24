"use client";
import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, UserPlus } from "lucide-react";

const TimeReport = () => {
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      employeeName: "Б.Болд",
      startTime: "09:00",
      endTime: "18:00",
      date: new Date(),
      department: " ",
    },
  ]);

  const addNewEntry = () => {
    setTimeEntries([
      ...timeEntries,
      {
        id: Date.now(),
        employeeName: "",
        startTime: "",
        endTime: "",
        date: new Date(),
        department: "",
      },
    ]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Цагийн бүртгэл</h1>
        <Button onClick={addNewEntry} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Шинэ бүртгэл
        </Button>
      </div>

      {timeEntries.map((entry) => (
        <Card key={entry.id} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              <Clock className="h-5 w-5 inline mr-2" />
              {entry.employeeName || "Шинэ бүртгэл"}
            </CardTitle>
            <div className="text-sm text-gray-500">
              {entry.date.toLocaleDateString("mn-MN")}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Ажилтны нэр</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ажилтны нэр"
                  value={entry.employeeName}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Хэлтэс</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Хэлтэс"
                  value={entry.department}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Эхэлсэн цаг</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-lg"
                  value={entry.startTime}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Дууссан цаг</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-lg"
                  value={entry.endTime}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TimeReport;
