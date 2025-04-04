import { AuthProvider } from '../../constants/AuthProvider';
import { Roles } from '../../constants/Roles';
import type { Url } from '../url/entity';
import type { Tag } from '../tag/entity';

export interface User {
  user_id: string;
  email: string;
  username?: string;
  profile_picture?: string;
  role?: string;
  urls?: Url[];
  tags?: Tag[];
}