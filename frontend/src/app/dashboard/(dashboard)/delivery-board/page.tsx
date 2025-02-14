"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import { useContext } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";
import DeliveryModal from "@/components/modals/NewDeliveryModal";
import { TrackingItem } from "@/interface";

export default function DeliveryPage() {
  const { deliveries } = useContext(DeliveryContext);
  return (
    <div className="flex-1 space-y-6 p-2 pt-2">
      <div className="flex items-center justify-between space-y-2">
        <div className="mb-2 flex items-center gap-4"></div>
        <div className="flex items-center space-x-2">
          <DeliveryModal />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нийт илгээмж</CardTitle>
            <Package className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Хүлээгдэж буй</CardTitle>
            <Truck className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                deliveries.filter(
                  (delivery) => delivery.status === "IN_TRANSIT"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Хүлээлгэж өгсөн
            </CardTitle>
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                deliveries.filter((delivery) => delivery.status === "DELIVERED")
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>
      <DataTable
        columns={columns}
        data={deliveries as unknown as TrackingItem[]}
      />
    </div>
  );
}
