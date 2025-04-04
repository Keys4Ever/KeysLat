import type { Tag } from "../tag/entity";
import type { User } from "../user/entity";

export interface IUrl {
    id: number;
    user_id?: string;
    user?: User;
    short_url: string;
    original_url: string;
    description?: string;
    created_at: Date;
    tags?: Tag[];
}

export interface IUrlStats {
    url_id: number;
    clicks: number;
    access_date: Date;
}

export interface IQuickUrl {
    id: number;
    short_url: string;
    secret_key: string;
}
