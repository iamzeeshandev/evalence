import { appApi } from "@/services/rtk-base-api-service";
import {
  AttemptAnswerPayload,
  AttemptAnswerResponse,
} from "./attempt-answer-type";

const attemptAnswerApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["AttemptAnswer"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      saveAttemptAnswer: build.mutation<
        AttemptAnswerResponse,
        AttemptAnswerPayload
      >({
        query: (payload) => ({
          url: `/attempt-answers/save`,
          method: "POST",
          body: payload,
        }),
      }),
    }),
  });

export const { useSaveAttemptAnswerMutation } = attemptAnswerApi;
