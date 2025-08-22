import { appApi } from "..";

const testsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Tests"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      saveTest: build.mutation<unknown, any>({
        query: (payload) => ({
          url: `/tests`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),

      allTests: build.query<unknown, void>({
        query: () => ({
          url: `/tests`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),

      testById: build.query<unknown, string>({
        query: (id) => ({
          url: `/tests/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Tests", id }],
      }),

      updateTest: build.mutation<unknown, { id: string; payload: any }>({
        query: ({ id, payload }) => ({
          url: `/tests/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Tests", id },
          { type: "Tests", id: "tests-list" },
        ],
      }),

      deleteTest: build.mutation<unknown, string>({
        query: (id) => ({
          url: `/tests/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),
    }),
  });

export const {} = testsApi;
