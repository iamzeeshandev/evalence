import type { AxiosError } from "axios";
import axios from "axios";
import axiosInstance from "./base-api-service";
import {
  ApiError,
  ApiResponse,
  CustomAxiosResponse,
} from "@/types/common/common-types";

class ApiService {
  static async get<T, U = undefined>(
    url: string,
    params?: U
  ): Promise<ApiResponse<T>> {
    try {
      const response: CustomAxiosResponse<T> = await axiosInstance.get(url, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new ApiError(error as AxiosError);
    }
  }

  static async post<T, U = undefined>(
    url: string,
    payload?: U
  ): Promise<ApiResponse<T>> {
    try {
      const response: CustomAxiosResponse<T> = await axiosInstance.post(
        url,
        payload
      );
      return response.data;
    } catch (error) {
      // Capture important details from AxiosError and pass them to ApiError
      if (axios.isAxiosError(error)) {
        // Add status code, response, and message for better debugging
        if (error.response) {
          return error.response;
        }
        throw new ApiError(error);
      }
      throw new Error("Unexpected error occurred");
    }
  }

  static async put<T, U>(url: string, payload: U): Promise<ApiResponse<T>> {
    try {
      const response: CustomAxiosResponse<T> = await axiosInstance.put(
        url,
        payload
      );
      return response.data;
    } catch (error) {
      throw new ApiError(error as AxiosError);
    }
  }

  static async patch<T, U>(url: string, payload: U): Promise<ApiResponse<T>> {
    try {
      const response: CustomAxiosResponse<T> = await axiosInstance.patch(
        url,
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return error.response;
        }
        throw new ApiError(error); // You may want to throw a more detailed error
      } else {
        throw new ApiError(error as AxiosError);
      }
    }
  }

  static async delete<T, U>(url: string, params?: U): Promise<ApiResponse<T>> {
    try {
      const response: CustomAxiosResponse<T> = await axiosInstance.delete(url, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new ApiError(error as AxiosError);
    }
  }
}

export default ApiService;
