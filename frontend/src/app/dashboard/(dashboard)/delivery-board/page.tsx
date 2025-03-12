"use client";

import { useMemo, useContext, useState, useEffect } from "react";
import { Package, CheckCircle } from "lucide-react";
import { DeliveryContext } from "@/context/DeliveryProvider";
import DeliveryModal from "@/components/modals/NewDeliveryModal";
import { DeliveryTable } from "@/components/data-table/data-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/buttons/PageHeader";

export default function DeliveryPage() {
  const { deliveries, fetchDeliveries } = useContext(DeliveryContext);
  const [selectedStat, setSelectedStat] = useState("total");

  // Fetch data when the component mounts
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const stats = useMemo(() => {
    const inTransit = deliveries.filter(
      (delivery) => delivery.status === "PENDING"
    ).length;
    const delivered = deliveries.filter(
      (delivery) => delivery.status === "DELIVERED"
    ).length;

    return {
      total: deliveries.length,
      inTransit,
      delivered,
    };
  }, [deliveries]);

  const statsConfig = {
    total: { label: "Бүгд", icon: Package, value: stats.total },
    pending: { label: "Үлдээсэн", icon: Package, value: stats.inTransit },
    delivered: { label: "Хүргэсэн", icon: CheckCircle, value: stats.delivered },
  };

  const filteredDeliveries = useMemo(() => {
    if (selectedStat === "total") return deliveries;
    return deliveries.filter(
      (delivery) => delivery.status.toUpperCase() === selectedStat.toUpperCase()
    );
  }, [selectedStat, deliveries]);

  return (
    <main className="flex-1 space-y-8">
      <div className="flex flex-col gap-6">
        <PageHeader title="Хүргэлтийн мэдээлэл" />
        <div className="flex justify-between">
          <DeliveryModal />
          <div className="w-full md:w-36">
            <Select value={selectedStat} onValueChange={setSelectedStat}>
              <SelectTrigger>
                <SelectValue placeholder="Select statistic" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(statsConfig).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <DeliveryTable data={filteredDeliveries} />
      </div>
    </main>
  );
}
