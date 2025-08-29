import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";
export const appApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: [
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
