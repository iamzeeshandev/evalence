export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status?: string;
  token?: string;
  data: any;
}
