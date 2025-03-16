import { User, UserData } from "./User";

export interface AuthContextType {
    auth: User;
    loading: boolean;
    login: (formData: FormData) => Promise<{ success: boolean; error?: undefined; } | { success: boolean; error: string; }>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAuth: () => Promise<void>;
    register: (FormData: FormData) => Promise<{ success: boolean; error?: undefined; } | { success: boolean; error: string; }>;
}

export interface FormData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: UserData;
}