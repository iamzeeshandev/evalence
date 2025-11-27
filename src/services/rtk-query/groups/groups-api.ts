import { appApi } from "@/services/rtk-base-api-service";
import { GroupPayload, GroupResponse, GroupListResponse, GroupDropdownResponse } from "./groups-type";

const groupsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Groups"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getGroupById: build.query<GroupResponse, string>({
        query: (id) => ({
          url: `/groups/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Groups", id }],
      }),
      getAllGroups: build.query<GroupListResponse, void>({
        query: () => ({
          url: `/groups/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Groups", id: "groups-list" }],
      }),
      getGroupsDropdown: build.query<GroupDropdownResponse, void>({
        query: () => ({
          url: `/groups/dropdown/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Groups", id: "groups-dropdown" }],
      }),
      saveGroup: build.mutation<GroupResponse, GroupPayload>({
        query: (payload) => ({
          url: `/groups/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Groups", id: "groups-list" }, { type: "Groups", id: "groups-dropdown" }],
      }),
      updateGroup: build.mutation<GroupResponse, { id: string; payload: GroupPayload }>({
        query: ({ id, payload }) => ({
          url: `/groups/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Groups", id },
          { type: "Groups", id: "groups-list" },
          { type: "Groups", id: "groups-dropdown" },
        ],
      }),
      deleteGroup: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/groups/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: "Groups", id },
          { type: "Groups", id: "groups-list" },
          { type: "Groups", id: "groups-dropdown" },
        ],
      }),
    }),
  });

export const {
  useGetGroupByIdQuery,
  useGetAllGroupsQuery,
  useGetGroupsDropdownQuery,
  useSaveGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi;
