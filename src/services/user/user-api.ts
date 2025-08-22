import { ApiResponse } from "@/types/common/common-types";
import ApiService from "../api-service";
import { appApi } from "../rtk-base-api-service";
import type {
  User,
  UserResponse,
  GetUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "./user-type";

export const userApi = appApi
  .enhanceEndpoints({ addTagTypes: ["User"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserById: builder.query<ApiResponse<User>, number>({
        query: (id) => ({
          url: `/user-by-id`,
          method: "GET",
          params: { id },
        }),
        providesTags: (result, error, id) => [{ type: "User", id }],
      }),

      getUserList: builder.query<ApiResponse<UserResponse>, GetUserRequest>({
        query: (payload) => ({
          url: `/all-users`,
          method: "GET",
          params: payload,
        }),
        providesTags: [{ type: "User", id: "Users" }],
      }),

      createUser: builder.mutation<ApiResponse<number>, CreateUserRequest>({
        query: (payload) => ({
          url: `/register-user`,
          method: "POST",
          data: payload,
        }),
        invalidatesTags: [{ type: "User", id: "Users" }],
      }),

      updateUser: builder.mutation<ApiResponse<User>, UpdateUserRequest>({
        query: (payload) => ({
          url: `/user-update`,
          method: "PUT",
          data: payload,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
      }),

      deleteUser: builder.mutation<ApiResponse<number>, number>({
        query: (id) => ({
          url: `/user-delete`,
          method: "DELETE",
          params: { id },
        }),
        invalidatesTags: () => [{ type: "User", id: "Users" }],
      }),
    }),
  });

export const {
  useGetUserByIdQuery,
  useGetUserListQuery,
  useLazyGetUserListQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
