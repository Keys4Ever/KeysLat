import redisClient from "../../config/redis";
import HTTP_STATUS from "../../constants/HttpStatus";
import HttpError from "../../utils/httpError.utils";
import { StatsService } from "../stats/service";
import { UrlService } from "../url/service";

export class RedisService {

    static async getOriginalUrl(shortUrl: string): Promise<string | null> {
        try {
            const response = await redisClient.get(shortUrl);
            if (!response) {
                return null;
            }
            const url = await UrlService.getUrlByShortUrl(shortUrl);
            if(!url) {
                throw new Error("URL no encontrada");
            }
            StatsService.incrementClicks(url.id);

            return JSON.parse(response);
        } catch (error: any) {
            throw new HttpError(error.message, "REDIS_ERROR", HTTP_STATUS.SERVER_ERROR);
        }
    }

    static async setUrl(key: string, value: string, ttl: number): Promise<void> {
        try {
            await redisClient.set(key, JSON.stringify(value), {
                EX: ttl,
            });
        } catch (error: any) {
            throw new HttpError(error.message, "REDIS_ERROR", HTTP_STATUS.SERVER_ERROR);
        }
    }
}