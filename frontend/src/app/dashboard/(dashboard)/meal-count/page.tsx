"use client";

import { useContext, useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { MealCountContext } from "@/context/MealCountProvider";
import PageHeader from "@/components/buttons/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Coffee,
  UtensilsCrossed,
  Moon,
  Info,
  Save,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function MealCountPage() {
  const { employees } = useContext(EmployeeContext);
  const {
    mealCounts,
    createMealCount,
    updateMealCount,
    incrementMealCount,
    getMealCountByDate,
    isLoading: contextLoading,
  } = useContext(MealCountContext);

  const [date, setDate] = useState<Date>(new Date());
  const [currentCount, setCurrentCount] = useState<{
    breakfast: number;
    lunch: number;
    dinner: number;
  }>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [inputMode, setInputMode] = useState<"new" | "increment">("new");
  const { toast } = useToast();

  // Highlight dates with meal counts
  const highlightedDates =
    mealCounts?.map((count) => new Date(count.date)) || [];

  // Fetch data for the selected date
  useEffect(() => {
    if (!mealCounts) return;

    const existingData = getMealCountByDate(format(date, "yyyy-MM-dd"));

    if (existingData) {
      setCurrentCount({
        breakfast: existingData.breakfast,
        lunch: existingData.lunch,
        dinner: existingData.dinner,
      });
      // Default to increment mode when an existing entry is found
      setInputMode("increment");
    } else {
      setCurrentCount({
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      });
      // Default to new mode when no entry exists
      setInputMode("new");
    }
  }, [date, mealCounts, getMealCountByDate]);

  // Handle input changes
  const handleCountChange = (
    meal: "breakfast" | "lunch" | "dinner",
    value: string
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 0) {
      setCurrentCount({
        ...currentCount,
        [meal]: numValue,
      });
    }
  };

  // Increment or decrement count
  const adjustCount = (
    meal: "breakfast" | "lunch" | "dinner",
    amount: number
  ) => {
    const newValue = Math.max(0, currentCount[meal] + amount);
    setCurrentCount({
      ...currentCount,
      [meal]: newValue,
    });
  };

  // Save the current counts
  const saveMealCount = async () => {
    setIsLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const existingData = getMealCountByDate(dateStr);

      if (existingData && existingData.id) {
        if (inputMode === "increment") {
          // Use the increment function to add to existing counts
          await incrementMealCount(dateStr, currentCount);

          toast({
            title: "Successfully incremented",
            description: `Meal counts for ${dateStr} have been incremented.`,
            variant: "default",
          });

          // Reset input fields after incrementing
          setCurrentCount({
            breakfast: 0,
            lunch: 0,
            dinner: 0,
          });
        } else {
          // Replace existing data
          await updateMealCount(existingData.id, {
            ...currentCount,
          });

          toast({
            title: "Successfully updated",
            description: `Meal counts for ${dateStr} have been updated.`,
            variant: "default",
          });
        }
      } else {
        // Create new meal count if no existing data
        await createMealCount({
          date: dateStr,
          ...currentCount,
        });

        toast({
          title: "Successfully saved",
          description: `Meal counts for ${dateStr} have been saved.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error saving meal count:", error);
      toast({
        title: "Error occurred",
        description: "Failed to save meal counts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get weekly total based on selected date with more detailed breakdown
  const getWeeklyTotal = () => {
    if (!mealCounts)
      return {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        total: 0,
        dailyBreakdown: [],
      };

    const endDate = new Date(date);
    const startDate = subDays(endDate, 6); // 7 days including the selected date

    const weekData = mealCounts.filter((count) => {
      const countDate = new Date(count.date);
      return countDate >= startDate && countDate <= endDate;
    });

    const totals = weekData.reduce(
      (acc, count) => {
        return {
          breakfast: acc.breakfast + count.breakfast,
          lunch: acc.lunch + count.lunch,
          dinner: acc.dinner + count.dinner,
          total: acc.total + count.breakfast + count.lunch + count.dinner,
        };
      },
      { breakfast: 0, lunch: 0, dinner: 0, total: 0 }
    );

    // Create daily breakdown sorted by date
    const dailyBreakdown = weekData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((count) => ({
        date: count.date,
        total: count.breakfast + count.lunch + count.dinner,
        breakfast: count.breakfast,
        lunch: count.lunch,
        dinner: count.dinner,
      }));

    return { ...totals, dailyBreakdown };
  };

  const weeklyTotals = getWeeklyTotal();

  if (!employees || employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg">Ажилтнуудын мэдээлэл ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 space-y-4">
      <PageHeader title="Хоолны талон" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Огноо сонгох</span>
              {getMealCountByDate(format(date, "yyyy-MM-dd")) && (
                <Badge variant="success" className="bg-primary/10 text-primary">
                  Хадгалагдсан
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Хоолны тоо харах эсвэл шинэчлэх огноог сонгоно уу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="flex justify-center rounded-md border w-full"
              modifiers={{
                highlighted: highlightedDates,
              }}
              modifiersStyles={{
                highlighted: {
                  backgroundColor: "rgba(var(--primary), 0.1)",
                  borderRadius: "100%",
                },
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 pt-4 border-t">
            <div className="w-full">
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span>7 хоногийн дэлгэрэнгүй мэдээлэл</span>
                <Badge variant="success" className="bg-primary/10 text-primary">
                  {format(subDays(date, 7), "MM/dd")} - {format(date, "MM/dd")}
                </Badge>
              </h3>
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* Meal Type Totals */}
                <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
                  <Coffee className="h-4 w-4 mb-1 text-amber-600" />
                  <span className="text-xs text-muted-foreground">
                    Өглөөний
                  </span>
                  <span className="font-medium">{weeklyTotals.breakfast}</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
                  <UtensilsCrossed className="h-4 w-4 mb-1 text-green-600" />
                  <span className="text-xs text-muted-foreground">Өдрийн</span>
                  <span className="font-medium">{weeklyTotals.lunch}</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center">
                  <Moon className="h-4 w-4 mb-1 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Оройн</span>
                  <span className="font-medium">{weeklyTotals.dinner}</span>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Нийт</span>
                  <span className="font-bold text-lg">
                    {weeklyTotals.total}
                  </span>
                </div>
              </div>

              {/* Daily Breakdown */}
              <div className="mt-4">
                <h4 className="text-xs text-muted-foreground mb-2">
                  Өдөр тутмын дэлгэрэнгүй
                </h4>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {weeklyTotals.dailyBreakdown.map((day, index) => (
                    <div
                      key={`${day.date}-${index}`}
                      className="bg-muted/30 p-2 rounded-lg text-center"
                    >
                      <div className="font-medium">
                        {format(new Date(day.date), "MM/dd")}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-amber-600">{day.breakfast}</span>
                        <span className="text-green-600">{day.lunch}</span>
                        <span className="text-blue-600">{day.dinner}</span>
                      </div>
                      <div className="font-bold mt-1">{day.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Right Column - Tabs for Input and History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Хоолны тоо {format(date, "yyyy-MM-dd")}</CardTitle>
                <CardDescription>
                  Хоолны төрөл бүрт ажилтны тоог оруулна уу
                </CardDescription>
              </div>
              {getMealCountByDate(format(date, "yyyy-MM-dd")) && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="input-mode" className="text-sm">
                    Оруулах горим:
                  </Label>
                  <select
                    id="input-mode"
                    className="text-sm p-1 border rounded"
                    value={inputMode}
                    onChange={(e) =>
                      setInputMode(e.target.value as "new" | "increment")
                    }
                  >
                    <option value="new">Шинэчлэх</option>
                    <option value="increment">Нэмэх</option>
                  </select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="input">Хоолны тоо оруулах</TabsTrigger>
                <TabsTrigger value="history">Сүүлийн түүх</TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  {/* Breakfast */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Coffee className="h-5 w-5 text-amber-600" />
                        </div>
                        <Label
                          htmlFor="breakfast"
                          className="text-lg font-medium"
                        >
                          Өглөөний цай
                        </Label>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Өглөөний цайны тоо</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("breakfast", -1)}
                        disabled={
                          currentCount.breakfast <= 0 ||
                          isLoading ||
                          contextLoading
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="breakfast"
                        type="number"
                        min="0"
                        value={currentCount.breakfast || ""}
                        onChange={(e) =>
                          handleCountChange("breakfast", e.target.value)
                        }
                        disabled={isLoading || contextLoading}
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("breakfast", 1)}
                        disabled={isLoading || contextLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <UtensilsCrossed className="h-5 w-5 text-green-600" />
                        </div>
                        <Label htmlFor="lunch" className="text-lg font-medium">
                          Өдрийн хоол
                        </Label>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Өдрийн хоолны тоо</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("lunch", -1)}
                        disabled={
                          currentCount.lunch <= 0 || isLoading || contextLoading
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="lunch"
                        type="number"
                        min="0"
                        value={currentCount.lunch || ""}
                        onChange={(e) =>
                          handleCountChange("lunch", e.target.value)
                        }
                        disabled={isLoading || contextLoading}
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("lunch", 1)}
                        disabled={isLoading || contextLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Moon className="h-5 w-5 text-blue-600" />
                        </div>
                        <Label htmlFor="dinner" className="text-lg font-medium">
                          Оройн хоол
                        </Label>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Оройн хоолны тоо</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("dinner", -1)}
                        disabled={
                          currentCount.dinner <= 0 ||
                          isLoading ||
                          contextLoading
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="dinner"
                        type="number"
                        min="0"
                        value={currentCount.dinner || ""}
                        onChange={(e) =>
                          handleCountChange("dinner", e.target.value)
                        }
                        disabled={isLoading || contextLoading}
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => adjustCount("dinner", 1)}
                        disabled={isLoading || contextLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between bg-primary/10 p-4 rounded-md">
                    <div>
                      <h3 className="font-medium">Өдрийн нийлбэр</h3>
                      <p className="text-sm text-muted-foreground">
                        Нийт хоол:{" "}
                        <span className="font-medium">
                          {currentCount.breakfast +
                            currentCount.lunch +
                            currentCount.dinner}
                        </span>
                      </p>
                      {inputMode === "increment" &&
                        getMealCountByDate(format(date, "yyyy-MM-dd")) && (
                          <p className="text-xs text-primary mt-1">
                            Одоогийн утгад нэмэгдэх болно
                          </p>
                        )}
                    </div>
                    <Button
                      onClick={saveMealCount}
                      disabled={
                        isLoading ||
                        contextLoading ||
                        (inputMode === "increment" &&
                          currentCount.breakfast === 0 &&
                          currentCount.lunch === 0 &&
                          currentCount.dinner === 0)
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading || contextLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Хадгалж байна...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {inputMode === "increment" ? "Нэмэх" : "Хадгалах"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Огноо</th>
                        <th className="text-center py-2 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Coffee className="h-4 w-4" />
                            <span>Өглөөний</span>
                          </div>
                        </th>
                        <th className="text-center py-2 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <UtensilsCrossed className="h-4 w-4" />
                            <span>Өдрийн</span>
                          </div>
                        </th>
                        <th className="text-center py-2 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Moon className="h-4 w-4" />
                            <span>Оройн</span>
                          </div>
                        </th>
                        <th className="text-center py-2 px-4">Нийт</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mealCounts && mealCounts.length > 0 ? (
                        mealCounts
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .slice(0, 7)
                          .map((count) => (
                            <tr
                              key={count.date}
                              className="border-b hover:bg-muted/50 cursor-pointer"
                              onClick={() => {
                                setDate(new Date(count.date));
                                setActiveTab("input");
                              }}
                            >
                              <td className="py-3 px-4">
                                {format(new Date(count.date), "yyyy-MM-dd")}
                              </td>
                              <td className="text-center py-3 px-4">
                                {count.breakfast}
                              </td>
                              <td className="text-center py-3 px-4">
                                {count.lunch}
                              </td>
                              <td className="text-center py-3 px-4">
                                {count.dinner}
                              </td>
                              <td className="text-center py-3 px-4 font-medium">
                                {count.breakfast + count.lunch + count.dinner}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Info className="h-8 w-8 text-muted-foreground/60" />
                              <p>Сүүлийн хоолны тоо байхгүй байна</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
