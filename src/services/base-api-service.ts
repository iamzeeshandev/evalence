import { getSafeSession } from "@/hooks/use-session";
import { ApiResponse, CustomAxiosResponse } from "@/types/common/common-types";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance for API requests
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // To include cookies
});

// Axios request interceptor to add Authorization header
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSafeSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session?.token}`;
  }
  return config;
});

// Axios response interceptor for handling 401 status
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Create a new object that includes necessary AxiosResponse properties
    const transformedResponse: ApiResponse<any> = {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
    // Return the transformed response
    return {
      ...response,
      data: transformedResponse,
    } as CustomAxiosResponse<any>;
  },
  async (error) => {
    // Handle 401 error by signing out and redirecting to sign-in
    if (
      error.response?.status === 401 &&
      error.request.path !== "/api/Account/login"
    ) {
      await signOut({ callbackUrl: "/auth/login" });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
