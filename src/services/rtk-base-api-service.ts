import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";
export const appApi = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl }),
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NDViMTkzOC1kZjIxLTQyOTUtYjI3MS1iY2JlZjBiOTc3MDMiLCJlbWFpbCI6ImpvaG4uZG9lQGNvbXBhbnkuY29tIiwicm9sZSI6ImNvbXBhbnlfYWRtaW4iLCJjb21wYW55SWQiOiIyMTNkNmQyMy00MjQyLTRmNTAtOThiYS00MTAxZGNiZGZlYjEiLCJpYXQiOjE3NTg3MDQ0MTcsImV4cCI6MTc1ODcwODAxN30.4Xh9qynLWwqI1JJBAdspyIRsliW9_0Utaqp9i8rtb00";
      if (token && endpoint !== "/auth/login") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
