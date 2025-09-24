"use client";

import { TestResultsPage } from "@/feature/result/result-view";
import { useGetUsersDropdownQuery } from "@/services/rtk-query";

export default function Page() {
  const {
    data: employees,
    isLoading: isEmployeeLoading,
    isFetching: isEmployeeFetching,
  } = useGetUsersDropdownQuery();

  return (
    <TestResultsPage
      users={employees}
      loading={isEmployeeLoading || isEmployeeFetching}
    />
  );
}
