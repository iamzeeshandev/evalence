import { QuestionPayload } from "../questions/questions-type";
import { TestAssignmentResponse } from "../test-assignment/test-assignment-type";
import { User } from "../users/users-type";

export interface TestPayload {
  title: string;
  type: string;
  description: string;
  isActive: boolean;
  duration: number;
  questions: QuestionPayload[];
  // Psychometric test configuration
  psychometricConfig?: {
    scoringStandard?: string;
    defaultOptions?: Array<{
      text: string;
      score: number;
    }>;
  };
}

export interface TestResponse {
  id: string;
  title: string;
  type: string;
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
  points?: number;
  questionNo: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  options: Option[];
  // Psychometric-specific fields
  orientation?: "straight" | "reverse";
  dimension?: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  score?: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
