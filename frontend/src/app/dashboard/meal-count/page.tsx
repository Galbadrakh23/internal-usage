import MealCount from "@/components/features/meal-count/MealCount";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout_components/Header";

export default function MealCountPage() {
  return (
    <div className="mt-8">
      <Header />
      <div className="p-8 border border-blue-50 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Хоолны тооцоо</h1>
          </div>
          <MealCount />
        </div>
      </div>
    </div>
  );
}
