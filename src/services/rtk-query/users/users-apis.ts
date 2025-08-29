import { appApi } from "@/services/rtk-base-api-service";
import { User } from "./users-type";

const userApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["User"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllUsers: build.query<User[], void>({
        providesTags: [{ type: "User", id: "all-users" }],
        query: () => ({
          url: `/users`,
          method: "GET",
        }),
      }),
      getAllUsersDropdown: build.query<User[], void>({
        providesTags: [{ type: "User", id: "all-users" }],
        query: () => ({
          url: `/users/dropdown/users`,
          method: "GET",
        }),
      }),
      userById: build.query<User, string | undefined>({
        providesTags: [{ type: "User", id: "user" }],
        query: (id) => ({
          url: `/users/${id}`,
          method: "GET",
        }),
      }),
      saveUser: build.mutation<User, any>({
        query: (payload) => ({
          url: `/users`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "User", id: "save-user" }],
      }),
      loginUser: build.mutation<User, { email: string; password: string }>({
        query: (payload) => ({
          url: `/users/login`,
          method: "POST",
          body: payload,
        }),
      }),
    }),
  });

export const {
  useGetAllUsersQuery,
  useLoginUserMutation,
  useGetAllUsersDropdownQuery,
} = userApi;
