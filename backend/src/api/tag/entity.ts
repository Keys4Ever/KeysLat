import type { User } from '../user/entity';
import type { Url } from '../url/entity';

export interface Tag {
    id: string;
    name: string;
    description?: string;
    user_id: string;
    user?: User;
    urls?: Url[];
}
