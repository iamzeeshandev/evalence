export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  industry: string;
  size: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type CompanyPayload = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
};
