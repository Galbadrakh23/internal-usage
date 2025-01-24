"use client";
import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

const MealCount = () => {
  const [mealData, setMealData] = useState({
    date: new Date().toISOString().split("T")[0],
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            Хоолны тооцоо
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Огноо</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={mealData.date}
                onChange={(e) =>
                  setMealData({ ...mealData, date: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Өглөөний цай
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={mealData.breakfast}
                  onChange={(e) =>
                    setMealData({
                      ...mealData,
                      breakfast: parseInt(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Өдрийн хоол</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={mealData.lunch}
                  onChange={(e) =>
                    setMealData({
                      ...mealData,
                      lunch: parseInt(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Оройн хоол</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={mealData.dinner}
                  onChange={(e) =>
                    setMealData({
                      ...mealData,
                      dinner: parseInt(e.target.value),
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="pt-4">
              <div className="text-lg font-semibold mb-2">
                Нийт: {mealData.breakfast + mealData.lunch + mealData.dinner}{" "}
                хүн
              </div>
              <Button className="w-full">Хадгалах</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealCount;
