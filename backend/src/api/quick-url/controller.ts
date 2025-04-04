import type { Request, Response } from "express";
import HTTP_STATUS from "../../constants/HttpStatus";
import { QuickUrlService } from "./service";
import { apiResponse } from "../../utils/apiResponse.utils";
import HttpError from "../../utils/httpError.utils";
import { StatsService } from "../stats/service";
import type { UrlStats } from "../stats/entity";

export class QuickUrlController {
    static async createQuickUrl(req: Request, res: Response): Promise<void> {
        try {
            const { original_url } = req.body;

            if (!original_url) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("URL original requerida", "MISSING_ORIGINAL_URL", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

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

    static async connectQuickUrl(req: Request, res: Response): Promise<void> {
        try {
            const { secret_key } = req.body;
            const userId = req.user?.user_id;

            if (!secret_key) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Clave secreta requerida", "MISSING_SECRET_KEY", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Usuario no autenticado", "UNAUTHORIZED", HTTP_STATUS.UNAUTHORIZED)
                    })
                );
                return;
            }

            const url = await QuickUrlService.connectQuickUrl(userId, secret_key);
            url.stats = await StatsService.getOrCreateStats(url.id) as UrlStats;
            url.tags = [];
            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: {
                        url: url
                    }
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
                    payload: new HttpError("Error al conectar URL rápida", "QUICK_URL_CONNECT_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
}
