"use client";

import Table from "@/components/core/table/table";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/hooks/use-table-state";
import { useGetAllCompaniesQuery, useDeleteCompanyMutation } from "@/services/rtk-query";
import { Company } from "@/services/rtk-query/company/company-type";
import { formatDate } from "@/lib/date-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Trash2, Plus, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function CompanyTable() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const tableState = useTableState();
  
  const { data: companies, isLoading } = useGetAllCompaniesQuery();

  const [deleteCompany] = useDeleteCompanyMutation();

  const handleEdit = (id: string) => {
    router.push(`/company-management/companies/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCompany(id).unwrap();
    } catch (error) {
      console.error("Failed to delete company:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNew = () => {
    router.push("/company-management/companies/create");
  };

  const columnHelper = createColumnHelper<Company>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Company Name",
      cell: ({ getValue, row }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{getValue()}</div>
              <div className="text-sm text-muted-foreground">{company.email}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "No description"}
        </span>
      ),
    }),
    columnHelper.accessor("industry", {
      header: "Industry",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "Not specified"}
        </span>
      ),
    }),
    columnHelper.accessor("size", {
      header: "Size",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() || "Not specified"}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const isActive = status === "active" || status === "approved";
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              isActive
                ? "bg-green-100 text-green-800"
                : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status === "pending" ? "Pending" : isActive ? "Active" : "Inactive"}
          </span>
        );
      },
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
        const company = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(company.id)}
              title="Edit company"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(company.id)}
              title="Delete company"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={deletingId === company.id}
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
      label: "Add New Company",
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
          data={companies || []}
          totalCount={companies?.length || 0}
          loading={isLoading}
          actions={actions}
          tableState={tableState}
          heading="Company Management"
        />
      </div>
    </div>
  );
}
