import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Initialize an empty api service that we'll inject endpoints into later as needed
const baseUrl = "http://localhost:3020/";
export const appApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["Company", "Options", "Questions", "Tests", "Users"],
  endpoints: () => ({}),
});

export * from "./company/company-apis";
export * from "./options/options-apis";
export * from "./questions/questions-apis";
export * from "./tests/tests-apis";
export * from "./users/users-apis";
