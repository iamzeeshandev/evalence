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
  percentage: string;
  correctCount: number;
  questionCount: number;
  timeSpentSec: number;
  isTimedOut: boolean;
  startedAt: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
