import { appApi } from "@/services/rtk-base-api-service";
import {
  CompanyPayload,
  CompanyResponse,
  CompanyListResponse,
} from "./company-type";

const companyApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Company"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCompanyById: build.query<CompanyResponse, string>({
        query: (id) => ({
          url: `/companies/${id}`,
          method: "GET",
        }),
        providesTags: (_result, _error, id) => [{ type: "Company", id }],
      }),
      getAllCompanies: build.query<CompanyListResponse, void>({
        query: () => ({
          url: `/companies/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Company", id: "companies-list" }],
      }),
      getCompaniesDropdown: build.query<CompanyListResponse, void>({
        query: () => ({
          url: `/companies/dropdown/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Company", id: "companies-dropdown" }],
      }),
      saveCompany: build.mutation<CompanyResponse, CompanyPayload>({
        query: (payload) => ({
          url: `/companies`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Company", id: "companies-list" }],
      }),
      updateCompany: build.mutation<CompanyResponse, CompanyPayload>({
        query: ({ id, ...payload }) => ({
          url: `/companies/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: () => [
          { type: "Company", id: "companies-list" },
          { type: "Company", id: "companies-dropdown" },
        ],
      }),
      deleteCompany: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/companies/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: () => [
          { type: "Company", id: "companies-list" },
          { type: "Company", id: "companies-dropdown" },
        ],
      }),
    }),
  });

export const {
  useGetCompanyByIdQuery,
  useGetAllCompaniesQuery,
  useGetCompaniesDropdownQuery,
  useSaveCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
