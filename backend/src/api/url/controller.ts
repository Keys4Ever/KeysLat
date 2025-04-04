import type { Request, Response } from "express";
import HTTP_STATUS from "../../constants/HttpStatus";
import { UrlService } from "./service";
import { apiResponse } from "../../utils/apiResponse.utils";
import HttpError from "../../utils/httpError.utils";
import { StatsService } from "../stats/service";
import { TagService } from "../tag/service";
import { QuickUrlService } from "../quick-url/service";
import type { UrlStats } from "../stats/entity";
import { RedisService } from "../redis/service";

export class UrlController {

    static async createUrl(req: Request, res: Response): Promise<void> {
        const frontend_routes = ['dashboard', 'callback', '404', 'login', 'register']
        try {
            const { original_url, description, tags, short_url }: { original_url: string, description: string, tags: string[], short_url: string } = req.body;
            const userId = req.user?.user_id


            if(frontend_routes.includes(short_url.toLowerCase())){
                console.log('INCLUYE: ', short_url);
                console.log('Frontend routes: ', frontend_routes);
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("URL no disponible", "INVALID_SHORT_URL", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

            console.log('Req user',)
            console.log("userId", userId);
            if (!original_url) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("URL original requerida", "MISSING_URL", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

            
            const url = await UrlService.createUrl({
                original_url,
                short_url,
                description,
                user_id: userId,
                tags
            });
            
            const urlStats = await StatsService.getOrCreateStats(url.id);
            url.stats = urlStats as UrlStats;
            await RedisService.setUrl(short_url, original_url, 604800);
            
            res.status(HTTP_STATUS.CREATED).json(
                apiResponse({
                    success: true,
                    payload: url
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al crear URL", "URL_CREATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

 
    static async getUrl(req: Request, res: Response): Promise<void> {
        try {
            const { shortUrl } = req.params;
            
            if (!shortUrl) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("URL corta no proporcionada", "SHORT_URL_MISSING", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }
            
            let originalUrl = await RedisService.getOriginalUrl(shortUrl);
            
            if (!originalUrl) {
                const urlData = await UrlService.getUrlByShortUrl(shortUrl);
                
                if (!urlData || !urlData.original_url) {
                    res.status(HTTP_STATUS.NOT_FOUND).json(
                        apiResponse({
                            success: false,
                            payload: new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND)
                        })
                    );
                    return;
                }
                
                originalUrl = urlData.original_url;
                
                await RedisService.setUrl(shortUrl, originalUrl, 604800);
            }
            
            try {
                await StatsService.incrementClicksByShortUrl(shortUrl);
            } catch (statsError) {
                console.error('Error al actualizar estadísticas:', statsError);
            }
            
            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { original_url: originalUrl }
                })
            );
            return;
        } catch (error) {
            console.error('Error en getUrl:', error);
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al obtener URL", "URL_GET_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
            return; // Usar return sin valor
        }
    }

    static async getUrls(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.user_id;
            const urls = await UrlService.getUrls(userId);
            console.log('-------------------AAAAAAAAAAAAAA----------------------');
            console.log('Urls', urls);
            console.log('------------------AAAAAAAAAAAAAAA-----------------------');

            urls.forEach(async url => {
                url.stats = (await StatsService.getOrCreateStats(url.id)) as UrlStats;
                url.tags = await TagService.getTagsForUrl(url.id) ?? undefined;
            });
            
            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: urls
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al obtener URLs", "URL_GET_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async updateUrl(req: Request, res: Response): Promise<void> {
        try {
            const { urlId } = req.params;
            const { newDescription, newTags, newShortUrl, newLongUrl } = req.body;
            const userId = req.user?.user_id;

            const url = await UrlService.updateUrl(urlId, {
                new_original_url: newLongUrl,
                new_short_url: newShortUrl,
                new_description: newDescription,
                new_tags: newTags ? await TagService.getTagsByNames(newTags, userId!) : undefined
            });

            if (!url) {
                res.status(HTTP_STATUS.NOT_FOUND).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND)
                    })
                );
                return;
            }

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: url
                })
            );
        } catch (error) {
            console.log('Error: ',error)
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al actualizar URL", "URL_UPDATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async deleteUrl(req: Request, res: Response): Promise<void> {
        try {
            const { urlId } = req.params;
            const userId = req.user?.user_id;

            await UrlService.deleteUrl(urlId, userId);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { message: "URL eliminada correctamente" }
                })
            );
        } catch (error) {
            if (error instanceof HttpError) {
                res.status(error.status).json(
                    apiResponse({
                        success: false,
                        payload: error
                    })
                );
                return;
            }

            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al eliminar URL", "URL_DELETE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async createQuickUrl(req: Request, res: Response): Promise<void> {
        try {
            const { original_url } = req.body;
            const quickUrl = await QuickUrlService.createQuickUrl(original_url);

            res.status(HTTP_STATUS.CREATED).json(
                apiResponse({
                    success: true,
                    payload: quickUrl
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al crear URL rápida", "QUICK_URL_CREATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
}
