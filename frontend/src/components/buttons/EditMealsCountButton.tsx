"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditMealCountModal } from "@/components/modals/EditMealCountModal";
import type { MealCount } from "@/interfaces/interface";
import { Edit2Icon } from "lucide-react";

interface MealCountsDetailsButtonProps {
  mealCounts: MealCount;
}

export function EditMealsCountButton({
  mealCounts,
}: MealCountsDetailsButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => setIsEditOpen(true)}>
        <Edit2Icon className="h-5 w-5 text-blue-500" />
      </Button>
      <EditMealCountModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mealCount={mealCounts}
      />
    </div>
  );
}
