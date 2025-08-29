import { appApi } from "@/services/rtk-base-api-service";
const optionsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Options"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      saveOption: build.mutation<unknown, { questionId: string; payload: any }>(
        {
          query: ({ questionId, payload }) => ({
            url: `/questions/${questionId}/options`,
            method: "POST",
            body: payload,
          }),
          invalidatesTags: [{ type: "Options", id: "options-list" }],
        }
      ),

      allOptions: build.query<unknown, string>({
        query: (questionId) => ({
          url: `/questions/${questionId}/options`,
          method: "GET",
        }),
        providesTags: [{ type: "Options", id: "options-list" }],
      }),

      optionById: build.query<unknown, { questionId: string; id: string }>({
        query: ({ questionId, id }) => ({
          url: `/questions/${questionId}/options/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, { id }) => [{ type: "Options", id }],
      }),

      updateOption: build.mutation<
        unknown,
        { questionId: string; id: string; payload: any }
      >({
        query: ({ questionId, id, payload }) => ({
          url: `/questions/${questionId}/options/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Options", id },
          { type: "Options", id: "options-list" },
        ],
      }),

      deleteOption: build.mutation<unknown, { questionId: string; id: string }>(
        {
          query: ({ questionId, id }) => ({
            url: `/questions/${questionId}/options/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: [{ type: "Options", id: "options-list" }],
        }
      ),
    }),
  });

export const {} = optionsApi;
