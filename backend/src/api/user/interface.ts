import type { AuthProvider } from "../../constants/AuthProvider";
import type { Roles } from "../../constants/Roles";

export interface IUser {
    user_id: string;
    
    email: string;
    
    password?: string;

    role: Roles;
    
    username?: string;
    
    profile_picture?: string;
    
    provider_id?: string;
    
    auth_provider: AuthProvider;
    
    //urls: Url[];
    
    //tags: Tag[];
}