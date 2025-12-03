import { OptionPayload } from "../options/options-type";

export interface QuestionPayload {
  text: string;
  type: string;
  points?: number;
  questionNo: number;
  imageUrl?: string;
  options?: OptionPayload[]; // Optional for psychometric tests
  // Psychometric-specific fields
  orientation?: "straight" | "reverse"; // For backward compatibility
  questionOrientation?: "STRAIGHT" | "REVERSE"; // For psychometric tests
  dimension?: string;
}
