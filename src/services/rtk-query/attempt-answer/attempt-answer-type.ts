export interface AttemptAnswer {
  attemptId: string;
  questionId: string;
  userId: string;
  selectedOptionIds: string[];
  timeSpentIncrementSec?: number;
}
export type AttemptAnswerPayload = Omit<AttemptAnswer, "attemptId">;

export interface AttemptAnswerResponse {
  id: string;
  userId?: string;
  attemptId: string;
  questionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  selectedOptionIds: string[];
  createdAt: string;
  updatedAt: string;
  timeSpentIncrementSec?: number;
}
