import type { AxiosError, AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  status: number | string;
  message?: string;
  token?: string;
}

export interface CustomAxiosResponse<T> extends AxiosResponse {
  data: ApiResponse<T>;
}

interface ErrorResponse {
  message?: string;
}

export class ApiError extends Error {
  public status: number;

  public message: string;

  public responseData?: any; // To capture detailed error response data

  public originalMessage: string; // To store the original error message from AxiosError

  constructor(error: AxiosError) {
    super(error.message);
    this.status = error.response?.status || 500;
    this.originalMessage = error.message;
    this.responseData = error.response?.data;
    const errorResponse = error.response?.data as ErrorResponse;
    this.message = errorResponse?.message || error.message || 'An unknown error occurred';
  }
}
