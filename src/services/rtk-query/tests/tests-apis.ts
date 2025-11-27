import { appApi } from "@/services/rtk-base-api-service";
import { TestPayload, TestResponse } from "./tests-type";

const testsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Tests"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTestById: build.query<TestResponse, string>({
        query: (id) => ({
          url: `/tests/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Tests", id }],
      }),
      getAccessibleTestById: build.query<TestResponse, string>({
        query: (id) => ({
          url: `/tests/accessible/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Tests", id }],
      }),
      getAllTests: build.query<TestResponse[], void>({
        query: () => ({
          url: `/tests/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      getAllCompanyTests: build.query<TestResponse[], string | undefined>({
        query: (companyId) => ({
          url: `/tests/company/${companyId}`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      getAllUserTests: build.query<TestResponse[], string | undefined>({
        query: (userId) => ({
          url: `/tests/user/${userId}`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      saveTest: build.mutation<TestResponse, TestPayload>({
        query: (payload) => ({
          url: `/tests/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      updateTest: build.mutation<
        TestResponse,
        { id: string; payload: TestPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/tests/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Tests", id },
          { type: "Tests", id: "tests-list" },
        ],
      }),
      deleteTest: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/tests/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),
    }),
  });

export const {
  useGetTestByIdQuery,
  useGetAccessibleTestByIdQuery,
  useGetAllTestsQuery,
  useGetAllCompanyTestsQuery,
  useGetAllUserTestsQuery,
  useSaveTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = testsApi;
