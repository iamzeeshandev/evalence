import { Question } from "../tests/tests-type";

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
  questions?: Question[];
}

export interface BatteryTest {
  id: string;
  batteryId: string;
  testId: string;
  weight: string;
  createdAt: string;
  updatedAt: string;
  test: Test;
}

export interface Battery {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  batteryTests: BatteryTest[];
}

export interface BatteryDropdown {
  id: string;
  name: string;
}

export interface BatteryTestPayload {
  testId: string;
  weight: number;
}

export interface BatteryPayload {
  name: string;
  description?: string;
  isActive: boolean;
  tests: BatteryTestPayload[];
}

export type BatteryResponse = Battery

export type BatteryListResponse = Battery[];
export type BatteryDropdownResponse = BatteryDropdown[];
