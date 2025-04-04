import { query } from "../../config/db";
import { UrlService } from "../url/service";
import type { UrlStats } from "./entity";

export class StatsService {
    static async getUrlStats(urlId: string): Promise<UrlStats | null> {
        console.log('Getting stats for urlId:', urlId);
        const result = await query(
            "SELECT * FROM url_stats WHERE url_id = $1",
            [urlId]
        );
        // Si no existe, crear la relación con las stats
        if(!result) {
            await query(
                "INSERT INTO url_stats (url_id, clicks, access_date) VALUES ($1, 0, CURRENT_TIMESTAMP)",
                [urlId]
            );
        }
        return result.rows.length > 0 ? result.rows[0] : 0;
    }

    static async getUrlStatsByShortUrl(shortUrl: string): Promise<UrlStats | null> {
        console.log('Getting stats for shortUrl:', shortUrl);
        const result = await query(
            "SELECT * FROM url_stats WHERE short_url = $1",
            [shortUrl]
        );
        
        return result.rows.length > 0 ? result.rows[0] : 0;
    }


    static async incrementClicks(urlId: string): Promise<void> {
        await query(
            "UPDATE url_stats SET clicks = clicks + 1, access_date = CURRENT_TIMESTAMP WHERE url_id = $1",
            [urlId]
        );
    }

    static async incrementClicksByShortUrl(shortUrl: string): Promise<void> {

        const url = await UrlService.getUrlByShortUrl(shortUrl);

        if (!url) {
            return;
        }

        await query(
            "UPDATE url_stats SET clicks = clicks + 1, access_date = CURRENT_TIMESTAMP WHERE url_id = $1",
            [url.id]
        );
    }


    static async getClickCount(urlId: string): Promise<number> {
        const result = await query(
            "SELECT clicks FROM url_stats WHERE url_id = $1",
            [urlId]
        );
        
        return result.rows.length > 0 ? result.rows[0].clicks : 0;
    }

    static async createStats(urlId: string): Promise<UrlStats> {
        const result = await query(
            "INSERT INTO url_stats (url_id, clicks, access_date) VALUES ($1, 0, CURRENT_TIMESTAMP) RETURNING *",
            [urlId]
        );
        
        return result.rows[0];
    }

    static async createStatsByShortUrl(shortUrl: string): Promise<UrlStats> {

        const url = await UrlService.getUrlByShortUrl(shortUrl);

        const result = await query(
            "INSERT INTO url_stats (url_id, clicks, access_date) VALUES ($1, 0, CURRENT_TIMESTAMP) RETURNING *",
            [url?.id]
        );
        
        return result.rows[0];
    }

    static async deleteStats(urlId: number): Promise<void> {
        await query(
            "DELETE FROM url_stats WHERE url_id = $1",
            [urlId]
        );
    }

    static async getOrCreateStats(urlId: string): Promise<Partial<UrlStats>> {
        let stats = await this.getUrlStats(urlId);
        
        if (!stats) {
            stats = await this.createStats(urlId);
        }
        
        return {
            url_id: stats.url_id,
            clicks: stats.clicks,
            access_date: stats.access_date
        };
    }
    static async getOrCreateStatsByShortUrl(shortUrl: string): Promise<Partial<UrlStats>> {
        let stats = await this.getUrlStatsByShortUrl(shortUrl);
        
        if (!stats) {
            stats = await this.createStats(shortUrl);
        }
        
        return {
            url_id: stats.url_id,
            clicks: stats.clicks,
            access_date: stats.access_date
        };
    }
}
