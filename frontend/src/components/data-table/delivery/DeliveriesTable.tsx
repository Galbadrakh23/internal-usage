"use client";
import {
  DynamicTable,
  TableColumn,
} from "@/components/data-table/DynamicTable";
import { Delivery, DeliveryTableProps } from "@/interfaces/interface";
import NewDeliveryModal from "@/components/modals/NewDeliveryModal";
import DeliveryStatusUpdater from "@/components/data-table/delivery/Delivery-Status";
import { DeliveryDetailsButton } from "@/components/buttons/DeliveryDetailsButton";

export function DeliveryTable({ data }: DeliveryTableProps) {
  // Status translations
  const statusTranslations = {
    DELIVERED: "Хүргэгдсэн",
    PENDING: "Хүлээгдэж буй",
  };

  const columns: TableColumn<Delivery>[] = [
    {
      id: "createdAt",
      header: "Огноо",
      accessorFn: (row) => new Date(row.createdAt).toLocaleDateString("en-CA"),
    },
    {
      id: "itemName",
      header: "Илгээмжийн нэр",
      accessorFn: (row) => row.itemName,
      searchable: true,
    },
    {
      id: "status",
      header: "Төлөв",
      accessorFn: (row) => row.status,
      cell: (value) => {
        const colorMap: Record<string, string> = {
          DELIVERED: "bg-emerald-500 text-white",
          IN_TRANSIT: "bg-amber-500 text-white",
          PENDING: "bg-amber-500 text-white",
        };

        return (
          <span
            className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${
              colorMap[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusTranslations[value as keyof typeof statusTranslations] ||
              "Тодорхойгүй"}
          </span>
        );
      },
    },
    {
      id: "receiverName",
      header: "Хүлээн авагч",
      accessorFn: (row) => row.receiverName,
      searchable: true,
    },
    {
      id: "senderName",
      header: "Илгээгч",
      accessorFn: (row) => row.senderName,
      searchable: true,
    },
    {
      id: "detail",
      header: "Дэлгэрэнгүй",
      accessorFn: (row) => row,
      cell: (row: Delivery) => <DeliveryDetailsButton delivery={row} />,
    },
    {
      id: "actions",
      header: "Төлөв өөрчлөх",
      accessorFn: (row) => row,
      cell: (row: Delivery) => <DeliveryStatusUpdater delivery={row.id} />,
    },
  ];

  return (
    <>
      <DynamicTable
        data={data}
        columns={columns}
        idField="trackingNo"
        actionComponents={<NewDeliveryModal />}
        pageSize={20}
      />
    </>
  );
}
