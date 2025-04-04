// LIBRARIES
import type { Response, Request, NextFunction } from "express";
import { type AnyZodObject, type ZodTypeAny, ZodError } from "zod";
// CONSTANTS
import HTTP_STATUS from "../constants/HttpStatus";
import { apiResponse } from "../utils/apiResponse.utils";
import HttpError from "../utils/httpError.utils";

const schemaValidator = (
    schema: AnyZodObject | null,
    paramsSchema: ZodTypeAny | null
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (schema) {
                schema.parse(req.body);
            }

            if (paramsSchema) {
                if (req.params.id) {
                    paramsSchema.parse(req.params.id);
                } else if (req.params.token) {
                    paramsSchema.parse(req.params.token);
                }
            }
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const response = apiResponse({
                    success: false,
                    payload: error.issues.map((issue) => ({
                        path: issue.path[0],
                        message: issue.message,
                    }))
                });
                res.status(HTTP_STATUS.BAD_REQUEST).json(response);
                return;
            }
            const response = apiResponse({
                success: false,
                payload: new HttpError("Internal server error", "SERVER_ERROR", HTTP_STATUS.SERVER_ERROR)
            });
            res.status(HTTP_STATUS.SERVER_ERROR).json(response);
            return;
        }
    };
};

export default schemaValidator;
