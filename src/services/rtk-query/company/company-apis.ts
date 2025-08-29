import { appApi } from "@/services/rtk-base-api-service";
import { Company, CompanyPayload } from "./company-type";

const companyApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Company"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllCompanies: build.query<Company[], void>({
        providesTags: [{ type: "Company", id: "all-companies" }],
        query: () => ({
          url: `/companies`,
          method: "GET",
        }),
      }),
      companyById: build.query<Company, string | undefined>({
        providesTags: [{ type: "Company", id: "company" }],
        query: (id) => ({
          url: `/companies/${id}`,
          method: "GET",
        }),
      }),

      saveCompany: build.mutation<CompanyPayload, any>({
        query: (payload) => ({
          url: `/companies`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Company", id: "save-company" }],
      }),
      updateCompany: build.mutation<
        CompanyPayload,
        { id: string; data: CompanyPayload }
      >({
        query: ({ id, data }) => ({
          url: `/companies/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: [{ type: "Company", id: "update-company" }],
      }),
      deleteCompany: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/companies/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Company", id: "delete-company" }],
      }),
    }),
  });

export const {
  useGetAllCompaniesQuery,
  useSaveCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
