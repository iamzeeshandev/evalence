"use client";

import Table from "@/components/core/table/table";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/hooks/use-table-state";
import { useGetAllBatteriesQuery, useDeleteBatteryMutation } from "@/services/rtk-query";
import { Battery } from "@/services/rtk-query/battery/battery-type";
import { formatDate } from "@/lib/date-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function BatteryTable() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const tableState = useTableState();
  
  const { data: batteries, isLoading } = useGetAllBatteriesQuery();

  const [deleteBattery] = useDeleteBatteryMutation();

  const handleEdit = (id: string) => {
    router.push(`/battery/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBattery(id).unwrap();
    } catch (error) {
      console.error("Failed to delete battery:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    router.push("/battery/create");
  };

  const columnHelper = createColumnHelper<Battery>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "No description"}
        </span>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={`rounded-sm px-2 py-1 text-sm font-semibold ${
            getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getValue() ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelper.accessor("tests", {
      header: "Tests Count",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue?.length || 0} tests
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {formatDate(getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const battery = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(battery.id)}
              title="Edit battery"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(battery.id)}
              title="Delete battery"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={deletingId === battery.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  const actions = [
    {
      label: "Add New Battery",
      onClick: handleAddNew,
      variant: "primary" as const,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="py-3">
        <Table
          columns={columns}
          data={batteries || []}
          totalCount={batteries?.length || 0}
          loading={isLoading}
          actions={actions}
          tableState={tableState}
          heading="Battery Management"
        />
      </div>
    </div>
  );
}
