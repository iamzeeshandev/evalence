import { appApi } from "..";

const companyApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Company"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      companyById: build.query<unknown, string | undefined>({
        providesTags: [{ type: "Company", id: "company" }],
        query: (id) => ({
          url: `/companies/${id}`,
          method: "GET",
        }),
      }),

      saveCompany: build.mutation<unknown, any>({
        query: (payload) => ({
          url: `/companies`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Company", id: "save-company" }],
      }),
    }),
  });

export const {} = companyApi;
