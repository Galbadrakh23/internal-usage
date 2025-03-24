"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your button component
import { DeliveryDetailsModal } from "@/components/modals/DeliveryDetailModal";
import type { TrackingItem } from "@/interfaces/interface";
import { Eye } from "lucide-react";

interface DeliveryDetailsButtonProps {
  delivery: TrackingItem;
}

export function DeliveryDetailsButton({
  delivery,
}: DeliveryDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Eye className="h-5 w-5 text-gray-500" />
        Харах
      </Button>
      <DeliveryDetailsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        delivery={delivery}
      />
    </>
  );
}
