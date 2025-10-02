export interface BatteryAssignment {
  id: string;
  batteryId: string;
  groupId: string;
  status: "active" | "inactive" | "expired";
  assignedAt: string;
  expiresAt: string;
  notes?: string;
  battery?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
  group?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
  assignedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BatteryAssignmentPayload {
  batteryId: string;
  groupId: string;
  status: "active" | "inactive";
  expiresAt: string;
  notes?: string;
}

export interface MultipleBatteryAssignmentPayload {
  batteryId: string;
  groups: {
    groupId: string;
    expiresAt: string;
    notes?: string;
  }[];
}

export interface BatteryAssignmentResponse {
  id: string;
  batteryId: string;
  groupId: string;
  status: "active" | "inactive" | "expired";
  assignedAt: string;
  expiresAt: string;
  notes?: string;
  battery?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
  group?: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
  };
  assignedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BatteryAssignmentListResponse {
  data: BatteryAssignmentResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface BatteryAssignmentParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "expired";
  batteryId?: string;
  groupId?: string;
}
