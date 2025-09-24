import { appApi } from "@/services/rtk-base-api-service";
import {
  UserPayload,
  UserResponse,
  UserListResponse,
  UserDropdownResponse,
} from "./users-type";

const usersApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Users"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUserById: build.query<UserResponse, string>({
        query: (id) => ({
          url: `/users/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Users", id }],
      }),
      getAllUsers: build.query<UserListResponse, void>({
        query: () => ({
          url: `/users/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Users", id: "users-list" }],
      }),
      getUsersDropdown: build.query<UserDropdownResponse, void>({
        query: () => ({
          url: `/users/dropdown`,
          method: "GET",
        }),
        providesTags: [{ type: "Users", id: "users-dropdown" }],
      }),
      getUsersByCompany: build.query<UserListResponse, string>({
        query: (companyId) => ({
          url: `/users/company/${companyId}`,
          method: "GET",
        }),
        providesTags: [{ type: "Users", id: "users-list" }],
      }),
      saveUser: build.mutation<UserResponse, UserPayload>({
        query: (payload) => ({
          url: `/users/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [
          { type: "Users", id: "users-list" },
          { type: "Users", id: "users-dropdown" },
        ],
      }),
      updateUser: build.mutation<UserResponse, UserPayload>({
        query: ({ id, ...payload }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: () => [
          { type: "Users", id: "users-list" },
          { type: "Users", id: "users-dropdown" },
        ],
      }),
      deleteUser: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/users/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: () => [
          { type: "Users", id: "users-list" },
          { type: "Users", id: "users-dropdown" },
        ],
      }),
    }),
  });

export const {
  useGetUserByIdQuery,
  useGetAllUsersQuery,
  useGetUsersDropdownQuery,
  useGetUsersByCompanyQuery,
  useSaveUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
