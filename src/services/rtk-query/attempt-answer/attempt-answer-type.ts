export interface AttemptAnswer {
  attemptId: string;
  questionId: string;
  userId: string;
  selectedOptionIds: string[];
  timeSpentIncrementSec: number;
}
export type AttemptAnswerPayload = Omit<AttemptAnswer, "attemptId">;

export interface AttemptAnswerResponse extends AttemptAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  isCorrect: boolean;
  pointsAwarded: number;
}
