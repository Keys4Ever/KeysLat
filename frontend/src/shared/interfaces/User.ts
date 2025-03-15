export interface User{
    authenticated: boolean;
    data: UserData | null;
}

interface UserData{
        user_id: string;
        email: string;
        username: string;
        profile_picture: string;
}