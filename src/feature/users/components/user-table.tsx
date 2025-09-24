"use client";

import Table from "@/components/core/table/table";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/hooks/use-table-state";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/services/rtk-query";
import { User, UserRole } from "@/services/rtk-query/users/users-type";
import { formatDate } from "@/lib/date-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, Plus, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-red-100 text-red-800";
    case UserRole.COMPANY_ADMIN:
      return "bg-blue-100 text-blue-800";
    case UserRole.EMPLOYEE:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "Admin";
    case UserRole.COMPANY_ADMIN:
      return "Company Admin";
    case UserRole.EMPLOYEE:
      return "Employee";
    default:
      return role;
  }
};

export function UserTable() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const tableState = useTableState();
  
  const { data: users, isLoading } = useGetAllUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const handleEdit = (id: string) => {
    router.push(`/company-management/users/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    router.push("/company-management/users/create");
  };

  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("firstName", {
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ getValue }) => (
        <span
          className={`rounded-sm px-2 py-1 text-sm font-semibold ${getRoleBadgeColor(getValue())}`}
        >
          {getRoleLabel(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "No phone"}
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
    columnHelper.accessor("lastLoginAt", {
      header: "Last Login",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() ? formatDate(getValue() as string) : "Never"}
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
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(user.id)}
              title="Edit user"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(user.id)}
              title="Delete user"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={deletingId === user.id}
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
      label: "Add New User",
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
          data={users || []}
          totalCount={users?.length || 0}
          loading={isLoading}
          actions={actions}
          tableState={tableState}
          heading="User Management"
        />
      </div>
    </div>
  );
}
