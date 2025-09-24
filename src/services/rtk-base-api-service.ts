import { getStoredToken } from "@/lib/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";
export const appApi = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl }),
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { endpoint }) => {
      const token = getStoredToken();
      if (token && endpoint !== "/auth/login") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Company",
    "Options",
    "Questions",
    "Tests",
    "Users",
    "File",
    "TestAssignments",
    "TestAttempts",
  ],
  endpoints: () => ({}),
});
