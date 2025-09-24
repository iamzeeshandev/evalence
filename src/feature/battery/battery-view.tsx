"use client";

import { BatteryTable } from "./components/battery-table";

export function BatteryView() {
  return (
    <div className="container mx-auto p-6">
      <BatteryTable />
    </div>
  );
}
