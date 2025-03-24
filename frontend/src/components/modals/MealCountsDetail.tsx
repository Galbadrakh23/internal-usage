"use client";

import type React from "react";
import { CalendarIcon, Coffee, UtensilsCrossed, Moon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface MealItem {
  id: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

interface MealCountsDetailModalProps {
  open: boolean;
  onClose: () => void;
  meal: MealItem | null;
}

export function MealCountsDetailModal({
  open,
  onClose,
  meal,
}: MealCountsDetailModalProps) {
  if (!meal) return null;

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("mn-MN");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Хоолны тооны дэлгэрэнгүй
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="default"
              className="text-md font-semibold px-3 py-1.5"
              aria-label="Meal ID"
            >
              ID: {meal.id}
            </Badge>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{formatDate(meal.date)}</span>
            </div>
          </div>
          <Separator />

          <div className="space-y-5">
            <MealCountRow
              icon={Coffee}
              label="Өглөөний хоол"
              value={meal.breakfast.toString()}
            />
            <MealCountRow
              icon={UtensilsCrossed}
              label="Өдрийн хоол"
              value={meal.lunch.toString()}
            />
            <MealCountRow
              icon={Moon}
              label="Оройн хоол"
              value={meal.dinner.toString()}
            />
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Нийт хоолны тоо:{" "}
              <span className="font-semibold">
                {meal.breakfast + meal.lunch + meal.dinner}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Хаах</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MealCountRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}
