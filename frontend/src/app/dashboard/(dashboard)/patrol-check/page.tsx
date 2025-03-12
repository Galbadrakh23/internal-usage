"use client";

import { useContext, useEffect } from "react";
import PageHeader from "@/components/buttons/PageHeader";
import PatrolTable from "@/components/patrol/PatrolTable";
import { PatrolContext } from "@/context/PatrolProvider";

export default function PatrolCheckPage() {
  const { patrols = [], isLoading, fetchPatrols } = useContext(PatrolContext);

  useEffect(() => {
    fetchPatrols();
  }, [fetchPatrols]);

  return (
    <main className="flex-1 space-y-8">
      <div className="flex flex-col gap-2">
        <PageHeader title="Патрол" />
        <PatrolTable
          patrols={patrols || []}
          isLoading={isLoading}
          fetchPatrols={fetchPatrols}
        />
      </div>
    </main>
  );
}
