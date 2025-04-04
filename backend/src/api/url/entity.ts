import type { User } from '../user/entity';
import type { Tag } from '../tag/entity';
import type { QuickUrl } from '../quick-url/entity';
import type { UrlStats } from '../stats/entity';

export interface Url  {
    id: string;
    user_id: string;
    user?: User;
    short_id: string;
    original_url: string;
    description?: string;
    is_temporary: boolean;
    created_at: Date;
    expires_at?: Date;
    status?: string;
    quick_url?: QuickUrl;
    stats?: UrlStats;
    tags?: Tag[];
}
