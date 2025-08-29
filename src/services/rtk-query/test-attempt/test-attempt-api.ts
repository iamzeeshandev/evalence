import { appApi } from "@/services/rtk-base-api-service";
import {
  StartTestAttemptPayload,
  SubmitTestAttemptPayload,
  TestAttemptResponse,
} from "./test-attempt-type";

const testAttemptsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["TestAttempts"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      startTestAttempt: build.mutation<
        TestAttemptResponse,
        StartTestAttemptPayload
      >({
        query: (payload) => ({
          url: `/test-attempts/start`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { testId, userId }) => [
          { type: "TestAttempts", id: `${testId}-${userId}` },
        ],
      }),

      submitTestAttempt: build.mutation<
        TestAttemptResponse,
        SubmitTestAttemptPayload
      >({
        query: (payload) => ({
          url: `/test-attempts/submit`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { attemptId }) => [
          { type: "TestAttempts", id: attemptId },
        ],
      }),

      getTestAttemptById: build.query<TestAttemptResponse, string>({
        query: (id) => ({
          url: `/test-attempts/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "TestAttempts", id }],
      }),

      getUserTestAttemptListById: build.query<TestAttemptResponse[], string>({
        query: (id) => ({
          url: `/test-attempts/user-list/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [
          { type: "TestAttempts", id: `list-${id}` },
        ],
      }),

      getTestAttemptsCount: build.query<number, unknown>({
        query: () => ({
          url: `/test-attempts/attempt/counts`,
          method: "GET",
        }),
        providesTags: [{ type: "TestAttempts", id: `test-counts` }],
      }),
    }),
  });

export const {
  useStartTestAttemptMutation,
  useSubmitTestAttemptMutation,
  useGetTestAttemptsCountQuery,
  useLazyGetUserTestAttemptListByIdQuery,
  useGetTestAttemptByIdQuery,
} = testAttemptsApi;
