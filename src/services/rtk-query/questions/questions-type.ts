import { OptionPayload } from "../options/options-type";

export interface QuestionPayload {
  text: string;
  type: string;
  points: number;
  imageUrl?: string;
  options: OptionPayload[];
}
