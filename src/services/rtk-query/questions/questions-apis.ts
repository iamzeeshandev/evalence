import { appApi } from "@/services/rtk-base-api-service";

const questionsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Questions"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      saveQuestion: build.mutation<unknown, { testId: string; payload: any }>({
        query: ({ testId, payload }) => ({
          url: `/tests/${testId}/questions`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Questions", id: "questions-list" }],
      }),

      allQuestions: build.query<unknown, string>({
        query: (testId) => ({
          url: `/tests/${testId}/questions`,
          method: "GET",
        }),
        providesTags: [{ type: "Questions", id: "questions-list" }],
      }),

      questionById: build.query<unknown, { testId: string; id: string }>({
        query: ({ testId, id }) => ({
          url: `/tests/${testId}/questions/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, { id }) => [{ type: "Questions", id }],
      }),

      updateQuestion: build.mutation<
        unknown,
        { testId: string; id: string; payload: any }
      >({
        query: ({ testId, id, payload }) => ({
          url: `/tests/${testId}/questions/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Questions", id },
          { type: "Questions", id: "questions-list" },
        ],
      }),

      deleteQuestion: build.mutation<unknown, { testId: string; id: string }>({
        query: ({ testId, id }) => ({
          url: `/tests/${testId}/questions/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Questions", id: "questions-list" }],
      }),
    }),
  });

export const {} = questionsApi;
