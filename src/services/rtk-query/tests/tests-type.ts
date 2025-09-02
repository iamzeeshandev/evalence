import { QuestionPayload } from "../questions/questions-type";
import { TestAssignmentResponse } from "../test-assignment/test-assignment-type";
import { User } from "../users/users-type";

export interface TestPayload {
  title: string;
  description: string;
  isActive: boolean;
  duration: number;

  questions: QuestionPayload[];
}

export interface TestResponse {
  id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface UserTestResponse {
  id: string;
  assignmentId: string;
  userId: string;
  maxAttempts: number;
  dueAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  assignment: TestAssignmentResponse;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
  questionNo: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
