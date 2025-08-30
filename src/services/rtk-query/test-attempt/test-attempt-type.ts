import { AttemptAnswerResponse } from "../attempt-answer/attempt-answer-type";
import { TestResponse } from "../tests/tests-type";

export interface StartTestAttemptPayload {
  testId: string;
  userId: string;
  userAssignmentId?: string;
}

export interface SubmitTestAttemptPayload {
  attemptId: string;
  finalTimeSpentSec: number;
}

export interface TestAttemptResponse {
  id: string;
  testId: string;
  userId: string;
  userAssignmentId?: string;
  status: "in_progress" | "submitted" | "expired";
  totalPoints: number;
  awardedPoints: number;
  percentage: number;
  correctCount: number;
  questionCount: number;
  timeSpentSec: number;
  isTimedOut: boolean;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  test: TestResponse;
  attemptAnswers: AttemptAnswerResponse[];
}
