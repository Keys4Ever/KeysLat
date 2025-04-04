import jwt from "jsonwebtoken";
import HTTP_STATUS from "../constants/HttpStatus";
import { apiResponse } from "../utils/apiResponse.utils";
import HttpError from "../utils/httpError.utils";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config/enviroment.config";
import type { JwtPayload } from "../api/auth/entity";

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('Request: ', req);
    if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            apiResponse({
                success: false,
                payload: new HttpError("Token requerido", "TOKEN_REQUIRED", HTTP_STATUS.UNAUTHORIZED)
            })  
        );
        return;
    }

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        // Adjuntar la información del usuario decodificada al objeto de solicitud
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            apiResponse({
                success: false,
                payload: new HttpError("Token inválido", "INVALID_TOKEN", HTTP_STATUS.UNAUTHORIZED)
            })
        );
    }
}
