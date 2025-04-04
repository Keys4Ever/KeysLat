import type { Request, Response } from "express";
import HTTP_STATUS from "../../constants/HttpStatus";
import { TagService } from "./service";
import { apiResponse } from "../../utils/apiResponse.utils";
import HttpError from "../../utils/httpError.utils";

export class TagController {
    static async createTag(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const userId = req.user?.user_id;

            if (!name) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Nombre de etiqueta requerido", "MISSING_TAG_NAME", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

            const tag = await TagService.createTag({
                name,
                user_id: userId!
            });

            res.status(HTTP_STATUS.CREATED).json(
                apiResponse({
                    success: true,
                    payload: tag
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
                    payload: new HttpError("Error al crear etiqueta", "TAG_CREATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async associateTagToUrl(req: Request, res: Response): Promise<void> {
        try {
            const { tagId, urlId } = req.params;
            const userId = req.user?.user_id;

            await TagService.associateTagToUrl(tagId, urlId, userId!);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { message: "Etiqueta asociada correctamente" }
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
                    payload: new HttpError("Error al asociar etiqueta", "TAG_ASSOCIATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async getUserTags(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.user_id;
            const tags = await TagService.getUserTags(userId!);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: tags
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al obtener etiquetas", "TAG_GET_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async getTag(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.user_id;

            const tag = await TagService.getTag(id, userId!);

            if (!tag) {
                res.status(HTTP_STATUS.NOT_FOUND).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Etiqueta no encontrada", "TAG_NOT_FOUND", HTTP_STATUS.NOT_FOUND)
                    })
                );
                return;
            }

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: tag
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error al obtener etiqueta", "TAG_GET_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async updateTag(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const userId = req.user?.user_id;

            if (!name) {
                res.status(HTTP_STATUS.BAD_REQUEST).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Nombre de etiqueta requerido", "MISSING_TAG_NAME", HTTP_STATUS.BAD_REQUEST)
                    })
                );
                return;
            }

            const tag = await TagService.updateTag(id, { name }, userId!);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: tag
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
                    payload: new HttpError("Error al actualizar etiqueta", "TAG_UPDATE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async deleteTag(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user?.user_id;

            await TagService.deleteTag(id, userId!);

            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { message: "Etiqueta eliminada correctamente" }
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
                    payload: new HttpError("Error al eliminar etiqueta", "TAG_DELETE_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
}
