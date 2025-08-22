import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from './base-api-service';

const axiosBaseQuery =
  () =>
  async ({
    url,
    method = 'GET',
    data,
    params,
  }: {
    url: string;
    method?: string;
    data?: any;
    params?: any;
  }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });
      return { data: result.data.data };
    } catch (axiosError: any) {
      const err = axiosError.response ? axiosError.response.data : axiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: err,
        },
      };
    }
  };

export const appApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['PrivateChat', 'Consult', 'Notification'],
  endpoints: () => ({}),
});
