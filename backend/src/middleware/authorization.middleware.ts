import type { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "../constants/HttpStatus";
import { apiResponse } from "../utils/apiResponse.utils";
import HttpError from "../utils/httpError.utils";
import { Roles } from "../constants/Roles";

export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Usuario no autenticado", "NOT_AUTHENTICATED", HTTP_STATUS.FORBIDDEN)
                })
            );
        }
        
        const userRole = req.user.role;
        
        if (roles.includes(userRole) || userRole === Roles.ADMIN) {
            next();
        } else {
            res.status(HTTP_STATUS.FORBIDDEN).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("No autorizado", "UNAUTHORIZED", HTTP_STATUS.FORBIDDEN)
                })
            );
        }
    };
};
