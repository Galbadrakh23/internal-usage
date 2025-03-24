"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { PatrolDetailsModal } from "@/components/modals/PatrolDetailModal";
import type { Patrol } from "@/interfaces/interface";
import { Eye } from "lucide-react";

interface PatrolDetailsButtonProps {
  patrol: Patrol;
}

export function PatrolDetailsButton({ patrol }: PatrolDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="h-5 w-5 text-gray-500" />
        Харах
      </Button>
      <PatrolDetailsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        patrols={patrol}
      />
    </>
  );
}
