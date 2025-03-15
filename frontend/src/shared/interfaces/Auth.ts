import { User } from "./User";

export interface AuthContextType {
    auth: User;
    loading: boolean;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshAuth: () => Promise<void>;
}
  
