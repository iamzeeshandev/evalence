import { appApi } from "..";

const userApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["User"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      userById: build.query<unknown, string | undefined>({
        providesTags: [{ type: "User", id: "user" }],
        query: (id) => ({
          url: `/users`,
          method: "GET",
        }),
      }),

      saveUser: build.mutation<unknown, any>({
        query: (payload) => ({
          url: `/users`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "User", id: "save-user" }],
      }),
    }),
  });

export const {} = userApi;
