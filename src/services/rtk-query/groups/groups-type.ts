export interface Company {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  industry?: string;
  size?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  users: GroupUser[];
  company?: Company;
}

export interface GroupDropdown {
  id: string;
  name: string;
}

export interface GroupPayload {
  name: string;
  description?: string;
  isActive: boolean;
  userIds: string[];
  companyId?: string;
}

export type GroupResponse = Group

export type GroupListResponse = Group[];
export type GroupDropdownResponse = GroupDropdown[];
