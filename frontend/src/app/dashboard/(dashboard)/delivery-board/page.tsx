"use client";
import { useContext, useEffect } from "react";
import { DeliveryContext } from "@/context/DeliveryProvider";
import { DeliveryTable } from "@/components/data-table/data-table";
import PageHeader from "@/components/layout_components/PageHeader";
import Pagination from "@/components/features/pagination/Pagination";

export default function DeliveryPage() {
  const { deliveries, pagination, fetchDeliveries } =
    useContext(DeliveryContext);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= pagination.totalPages) {
      fetchDeliveries(newPage);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Хүргэлтийн мэдээлэл" />
      </div>
      <DeliveryTable
        data={deliveries}
        onPageChange={handlePageChange}
        fetchDeliveries={fetchDeliveries}
      />
      <div className="flex items-center justify-center">
        {pagination.totalPages > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}
