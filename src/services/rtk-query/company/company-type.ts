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
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export interface CompanyPayload {
  id?: string;
  name: string;
  description?: string;
  email?: string;
  adminPassword: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  industry?: string;
  size?: string;
  firstName?: string;
  lastName?: string;
}

export type CompanyResponse = Company

export type CompanyListResponse = Company[];
