export interface Test {
  id: string;
  title: string;
  description?: string;
  duration: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Battery {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tests: Test[];
}

export interface BatteryDropdown {
  id: string;
  name: string;
}

export interface BatteryPayload {
  name: string;
  description?: string;
  isActive: boolean;
  testIds: string[];
}

export type BatteryResponse = Battery

export type BatteryListResponse = Battery[];
export type BatteryDropdownResponse = BatteryDropdown[];
