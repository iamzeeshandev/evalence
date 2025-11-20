"use client";

import Table from "@/components/core/table/table";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/hooks/use-table-state";
import { useGetAllGroupsQuery, useDeleteGroupMutation } from "@/services/rtk-query";
import { Group } from "@/services/rtk-query/groups/groups-type";
import { formatDate } from "@/lib/date-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function GroupTable() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const tableState = useTableState();
  
  const { data: groups, isLoading } = useGetAllGroupsQuery();

  const [deleteGroup] = useDeleteGroupMutation();

  const handleEdit = (id: string) => {
    router.push(`/company-management/groups/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGroup(id).unwrap();
    } catch (error) {
      console.error("Failed to delete group:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    router.push("/company-management/groups/create");
  };

  const columnHelper = createColumnHelper<Group>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Group Name",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "No description"}
        </span>
      ),
    }),
    columnHelper.accessor("users", {
      header: "Members",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue()?.length || 0} members
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
        const group = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(group.id)}
              title="Edit group"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(group.id)}
              title="Delete group"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={deletingId === group.id}
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
      label: "Add New Group",
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
          data={groups || []}
          totalCount={groups?.length || 0}
          loading={isLoading}
          actions={actions}
          tableState={tableState}
          heading="Group Management"
        />
      </div>
    </div>
  );
}
