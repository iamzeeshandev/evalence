import { appApi } from "@/services/rtk-base-api-service";
import { LoginRequest, LoginResponse } from "./auth-type";

const authApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Auth"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      login: build.mutation<LoginResponse | any, LoginRequest>({
        query: (payload) => ({
          url: "/auth/login",
          body: payload,
          method: "Post",
        }),
      }),
    }),
  });

export const { useLoginMutation } = authApi;
