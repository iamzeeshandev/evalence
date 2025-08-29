"use client";

import { TestResultsPage } from "@/feature/user/user-view";
import { useGetAllUsersDropdownQuery } from "@/services/rtk-query";

export default function Page() {
  const {
    data: employees,
    isLoading: isEmployeeLoading,
    isFetching: isEmployeeFetching,
  } = useGetAllUsersDropdownQuery();

  return (
    <TestResultsPage
      users={employees}
      loading={isEmployeeLoading || isEmployeeFetching}
    />
  );
}
