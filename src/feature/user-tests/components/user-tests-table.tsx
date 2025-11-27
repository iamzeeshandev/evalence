"use client";

import Table from "@/components/core/table/table";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/hooks/use-table-state";
import { useAuth } from "@/lib/auth";
import { useGetUserAccessibleTestsQuery } from "@/services/rtk-query";
import { formatDate } from "@/lib/date-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Play, Calendar, Clock, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: any[];
  batteryId?: string;
  batteryName?: string;
  weight?: number;
}

export function UserTestsTable() {
  const router = useRouter();
  const { authData } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const tableState = useTableState();

  const { data: tests, isLoading } = useGetUserAccessibleTestsQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    // Get user data from auth context
    if (authData.user && authData.user.id) {
      setUserId(authData.user.id);
    } else {
      // Fallback: Check localStorage directly
      try {
        const storedAuthData = localStorage.getItem("evalence_user");
        if (storedAuthData) {
          const parsedUser = JSON.parse(storedAuthData);
          if (parsedUser.user && parsedUser.user.id) {
            setUserId(parsedUser.user.id);
          }
        }
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
      }
    }
  }, [authData.user]);

  const handleTakeTest = (id: string, title: string) => {
    // Pass test ID and title for direct test access
    router.push(`/take-test/details/${id}?name=${encodeURIComponent(title)}&mode=test`);
  };

  const columnHelper = createColumnHelper<Test>();
  const columns = [
    columnHelper.accessor("title", {
      header: "Test Title",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-blue-600" />
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
    columnHelper.accessor("questions", {
      header: "Questions",
      cell: ({ getValue }) => {
        const questions = getValue();
        const count = questions && Array.isArray(questions) ? questions.length : 0;
        return (
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {count} questions
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("duration", {
      header: "Duration",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">{getValue()} min</span>
        </div>
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
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {formatDate(getValue())}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {formatDate(getValue())}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const test = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTakeTest(test.id, test.title)}
              disabled={!test.isActive}
              title={test.isActive ? "Take test" : "Test is inactive"}
              className={`h-8 px-3 ${
                test.isActive
                  ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  : "text-gray-400"
              }`}
            >
              <Play className="h-4 w-4 mr-1" />
              {test.isActive ? "Take Test" : "Inactive"}
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div className="w-full">
      <div className="py-3">
        <Table
          columns={columns}
          data={tests || []}
          totalCount={tests?.length || 0}
          loading={isLoading}
          tableState={tableState}
          heading="My Tests"
          emptyText="No tests available at the moment"
        />
      </div>
    </div>
  );
}

