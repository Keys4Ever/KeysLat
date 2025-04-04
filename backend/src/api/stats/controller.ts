import type { Request, Response } from "express";
import HTTP_STATUS from "../../constants/HttpStatus";
import { StatsService } from "./service";
import { apiResponse } from "../../utils/apiResponse.utils";
import HttpError from "../../utils/httpError.utils";

export class StatsController {
    static async getUrlStats(req: Request, res: Response): Promise<void> {
        try {
            const { urlId } = req.params;

            const stats = await StatsService.getUrlStats(urlId);

            if (!stats) {
                res.status(HTTP_STATUS.NOT_FOUND).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Estadísticas no encontradas", "STATS_NOT_FOUND", HTTP_STATUS.NOT_FOUND)
                    })
                );
                return;
            }

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: stats
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al obtener estadísticas", "STATS_GET_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async incrementClicks(req: Request, res: Response): Promise<void> {
        try {
            const { urlId } = req.params;
            
            // Primero aseguramos que existan las estadísticas
            await StatsService.getOrCreateStats(urlId);
            
            // Luego incrementamos los clicks
            await StatsService.incrementClicks(urlId);

            const updatedStats = await StatsService.getUrlStats(urlId);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: updatedStats
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al actualizar estadísticas", "STATS_UPDATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
}
