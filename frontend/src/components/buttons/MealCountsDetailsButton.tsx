"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MealCountsDetailModal } from "@/components/modals/MealCountsDetail";
import type { MealCount } from "@/interfaces/interface";
import { Eye } from "lucide-react";

interface MealCountsDetailsButtonProps {
  mealCounts: MealCount;
}

export function MealCountsDetailButton({
  mealCounts,
}: MealCountsDetailsButtonProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => setIsViewOpen(true)}>
        <Eye className="h-5 w-5 text-gray-500 mr-1" />
        Харах
      </Button>
      <MealCountsDetailModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        meal={mealCounts}
      />
    </div>
  );
}
