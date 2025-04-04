import type { User } from '../user/entity';

export interface AuthUser extends User {
  password?: string;
  auth_provider?: string;
  provider_id?: string;
}

export interface JwtPayload {
  user_id: string;
  email: string;
  username: string;
  profile_picture: string;
  role?: string;
}
