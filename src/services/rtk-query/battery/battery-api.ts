import { appApi } from "@/services/rtk-base-api-service";
import { BatteryPayload, BatteryResponse, BatteryListResponse, BatteryDropdownResponse } from "./battery-type";

const batteryApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Battery"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBatteryById: build.query<BatteryResponse, string>({
        query: (id) => ({
          url: `/batteries/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Battery", id }],
      }),
      getAllBatteries: build.query<BatteryListResponse, void>({
        query: () => ({
          url: `/batteries/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Battery", id: "battery-list" }],
      }),
      getBatteriesDropdown: build.query<BatteryDropdownResponse, void>({
        query: () => ({
          url: `/batteries/dropdown`,
          method: "GET",
        }),
        providesTags: [{ type: "Battery", id: "battery-dropdown" }],
      }),
      saveBattery: build.mutation<BatteryResponse, BatteryPayload>({
        query: (payload) => ({
          url: `/batteries`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Battery", id: "battery-list" }, { type: "Battery", id: "battery-dropdown" }],
      }),
      updateBattery: build.mutation<BatteryResponse, { id: string; payload: BatteryPayload }>({
        query: ({ id, payload }) => ({
          url: `/batteries/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Battery", id },
          { type: "Battery", id: "battery-list" },
          { type: "Battery", id: "battery-dropdown" },
        ],
      }),
      deleteBattery: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/batteries/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, id) => [
          { type: "Battery", id },
          { type: "Battery", id: "battery-list" },
          { type: "Battery", id: "battery-dropdown" },
        ],
      }),
    }),
  });

export const {
  useGetBatteryByIdQuery,
  useGetAllBatteriesQuery,
  useGetBatteriesDropdownQuery,
  useSaveBatteryMutation,
  useUpdateBatteryMutation,
  useDeleteBatteryMutation,
} = batteryApi;
