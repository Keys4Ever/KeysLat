import { ApiResponse } from "./api.interface";

interface AuthData {
  access_token?: string;
  user?: {
    user_id: string;
    username: string;
    email: string;
    profile_picture: string;
  };
}

export interface AuthResponse extends ApiResponse<AuthData> {}
