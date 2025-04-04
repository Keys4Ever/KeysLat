import type { Url } from '../url/entity';

export interface UrlStats {
    url_id: number;
    clicks: number;
    access_date: Date;
    url?: Url;
}
