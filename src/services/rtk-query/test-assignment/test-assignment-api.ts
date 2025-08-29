import { appApi } from "@/services/rtk-base-api-service";
import {
  TestAssignmentPayload,
  AssignToUserPayload,
  TestAssignmentResponse,
} from "./test-assignment-type";

const testAssignmentsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["TestAssignments"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTestAssignmentById: build.query<TestAssignmentResponse, string>({
        query: (id) => ({
          url: `/test-assignments/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "TestAssignments", id }],
      }),
      getAllTestAssignments: build.query<TestAssignmentResponse[], void>({
        query: () => ({
          url: `/test-assignments`,
          method: "GET",
        }),
        providesTags: () => [
          { type: "TestAssignments", id: `all-assignments` },
        ],
      }),
      getTestAssignmentByCompanyId: build.query<
        TestAssignmentResponse[],
        string
      >({
        query: (companyId) => ({
          url: `/test-assignments/company/${companyId}`,
          method: "GET",
        }),
        providesTags: (result, error, companyId) => [
          { type: "TestAssignments", id: `company-${companyId}` },
        ],
      }),
      getUserTestAssignmentByCompanyId: build.query<
        TestAssignmentResponse[],
        { companyId: string; userId: string }
      >({
        query: ({ companyId, userId }) => ({
          url: `/test-assignments/user/${userId}/${companyId}`,
          method: "GET",
        }),
        providesTags: (result, error, { userId }) => [
          { type: "TestAssignments", id: `user-${userId}` },
        ],
      }),
      assignToCompany: build.mutation<
        TestAssignmentResponse,
        TestAssignmentPayload
      >({
        query: (payload) => ({
          url: `/test-assignments/assign-to-company`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { companyId }) => [
          { type: "TestAssignments", id: `company-${companyId}` },
        ],
      }),

      assignToUser: build.mutation<TestAssignmentResponse, AssignToUserPayload>(
        {
          query: (payload) => ({
            url: `/test-assignments/assign-to-user`,
            method: "POST",
            body: payload,
          }),
          invalidatesTags: (result, error, { userId }) => [
            { type: "TestAssignments", id: `user-${userId}` },
          ],
        }
      ),
    }),
  });

export const {
  useGetAllTestAssignmentsQuery,
  useGetTestAssignmentByCompanyIdQuery,
  useGetUserTestAssignmentByCompanyIdQuery,
  useAssignToCompanyMutation,
  useAssignToUserMutation,
} = testAssignmentsApi;
