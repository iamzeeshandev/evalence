export interface Company {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string;
  companyPhone: string;
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  companyName: string;
  companyPhone: string;
};

export type UpdateCompanyPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyName: string;
  companyPhone: string;
};
