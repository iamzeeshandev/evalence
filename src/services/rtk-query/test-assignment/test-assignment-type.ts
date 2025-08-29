import { Company } from "../company/company-type";
import { TestResponse } from "../tests/tests-type";
import { User } from "../users/users-type";

export interface TestAssignmentPayload {
  testId: string;
  companyId: string;
  maxAttempts?: number;
  dueAt?: string | null;
}

export interface AssignToUserPayload extends TestAssignmentPayload {
  userId: string;
}

export interface TestAssignmentResponse {
  id: string;
  testId: string;
  companyId: string;
  userId?: string;
  maxAttempts: number;
  dueAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  test: TestResponse;
  company: Company;
}

export interface UserTestAssignmentResponse {
  id: string;
  testId: string;
  userId: string;
  maxAttempts: number;
  dueAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  test: TestResponse;
  assignment: TestAssignmentResponse;
  user: User;
}



