"use client";

import { UserTestsTable } from "./components/user-tests-table";

export function UserTestsView() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <UserTestsTable />
    </div>
  );
}
