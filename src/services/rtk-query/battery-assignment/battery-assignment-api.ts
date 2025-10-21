import { appApi } from "@/services/rtk-base-api-service";
import {
  BatteryAssignment,
  BatteryAssignmentPayload,
  MultipleBatteryAssignmentPayload,
  BatteryAssignmentResponse,
  BatteryAssignmentListResponse,
  BatteryAssignmentParams,
} from "./battery-assignment-type";

const batteryAssignmentApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["BatteryAssignment"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
    // Get all battery assignments with pagination and filters
    getBatteryAssignments: build.query<
      BatteryAssignmentListResponse,
      BatteryAssignmentParams
    >({
      query: (params) => ({
        url: "/battery-assignments/list",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "BatteryAssignment", id: "battery-assignment-list" }],
    }),

    // Get single battery assignment by ID
    getBatteryAssignmentById: build.query<BatteryAssignmentResponse, string>({
      query: (id) => ({
        url: `/battery-assignments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BatteryAssignment", id }],
    }),

    // Create single battery assignment
    createBatteryAssignment: build.mutation<
      BatteryAssignmentResponse,
      BatteryAssignmentPayload
    >({
      query: (payload) => ({
        url: "/battery-assignments/save",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "BatteryAssignment", id: "battery-assignment-list" },
      ],
    }),

    // Create multiple battery assignments
    createMultipleBatteryAssignments: build.mutation<
      BatteryAssignmentResponse[],
      MultipleBatteryAssignmentPayload
    >({
      query: (payload) => ({
        url: "/battery-assignments/assign-multiple",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "BatteryAssignment", id: "battery-assignment-list" },
      ],
    }),

    // Update battery assignment
    updateBatteryAssignment: build.mutation<
      BatteryAssignmentResponse,
      { id: string; payload: Partial<BatteryAssignmentPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/battery-assignments/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "BatteryAssignment", id },
        { type: "BatteryAssignment", id: "battery-assignment-list" },
      ],
    }),

    // Delete battery assignment
    deleteBatteryAssignment: build.mutation<void, string>({
      query: (id) => ({
        url: `/battery-assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "BatteryAssignment", id },
        { type: "BatteryAssignment", id: "battery-assignment-list" },
      ],
    }),

    // Get battery assignments by battery ID
    getBatteryAssignmentsByBatteryId: build.query<
      BatteryAssignmentResponse[],
      string
    >({
      query: (batteryId) => ({
        url: `/battery-assignments/battery/${batteryId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, batteryId) => [
        { type: "BatteryAssignment", id: `battery-${batteryId}` },
      ],
    }),

    // Get battery assignments by group ID
    getBatteryAssignmentsByGroupId: build.query<
      BatteryAssignmentResponse[],
      string
    >({
      query: (groupId) => ({
        url: `/battery-assignments/group/${groupId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "BatteryAssignment", id: `group-${groupId}` },
      ],
    }),

    // Get battery assignments with groups by battery ID
    getBatteryAssignmentsWithGroups: build.query<
      BatteryAssignmentResponse[],
      string
    >({
      query: (batteryId) => ({
        url: `/battery-assignments/battery/${batteryId}/groups`,
        method: "GET",
      }),
      providesTags: (_result, _error, batteryId) => [
        { type: "BatteryAssignment", id: `battery-groups-${batteryId}` },
      ],
    }),

    // Get user accessible batteries
    getUserAccessibleBatteries: build.query<
      any[],
      string
    >({
      query: (userId) => ({
        url: `/battery-assignments/user/${userId}/accessible-batteries`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "BatteryAssignment", id: `user-${userId}-batteries` },
      ],
    }),

    // Get user accessible tests
    getUserAccessibleTests: build.query<
      any[],
      string
    >({
      query: (userId) => ({
        url: `/battery-assignments/user/${userId}/accessible-tests`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "BatteryAssignment", id: `user-${userId}-tests` },
      ],
    }),
  }),
});

export const {
  useGetBatteryAssignmentsQuery,
  useGetBatteryAssignmentByIdQuery,
  useCreateBatteryAssignmentMutation,
  useCreateMultipleBatteryAssignmentsMutation,
  useUpdateBatteryAssignmentMutation,
  useDeleteBatteryAssignmentMutation,
  useGetBatteryAssignmentsByBatteryIdQuery,
  useGetBatteryAssignmentsByGroupIdQuery,
  useGetBatteryAssignmentsWithGroupsQuery,
  useGetUserAccessibleBatteriesQuery,
  useGetUserAccessibleTestsQuery,
} = batteryAssignmentApi;
