import type { Url } from '../url/entity';

export interface QuickUrl {
    id: number;
    short_url: string;
    secret_key: string;
    url?: Url;
}
