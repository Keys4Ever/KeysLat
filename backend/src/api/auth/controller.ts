import type { Request, Response } from "express";
import HTTP_STATUS from "../../constants/HttpStatus";
import { sign } from "jsonwebtoken";
import { apiResponse } from "../../utils/apiResponse.utils";
import { config } from "../../config/enviroment.config";
import HttpError from "../../utils/httpError.utils";
import { UserService } from "../user/service";
import { BcryptUtils } from "../../utils/bcrypt.utils";
import type { AuthUser, JwtPayload } from "./entity";

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Credenciales inválidas", "INVALID_CREDENTIALS", HTTP_STATUS.UNAUTHORIZED)
                    })
                );
                return;
            }
            
            // Necesitamos asegurarnos de que el usuario tenga un password para verificar
            const authUser = user as AuthUser;
            if (!authUser.password) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Método de autenticación no válido", "INVALID_AUTH_METHOD", HTTP_STATUS.UNAUTHORIZED)
                    })
                );
                return;
            }
            
            const validPassword = await BcryptUtils.comparePasswords(password, authUser.password);
            if (!validPassword) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Credenciales inválidas", "INVALID_CREDENTIALS", HTTP_STATUS.UNAUTHORIZED)
                    })
                );
                return;
            }
    
            const tokenPayload: JwtPayload = {
                user_id: user.user_id,
                email: user.email,
                username: user.username || '',
                profile_picture: user.profile_picture || '',
                role: user.role
            };
    
            const token = sign(tokenPayload, config.JWT_SECRET, { expiresIn: "1h" });
            
            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { token, user: tokenPayload }
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error interno del servidor", "INTERNAL_SERVER_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
    
    static async register(req: Request, res: Response) {
        try {
            const { email, password, username } = req.body;
            
            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                res.status(HTTP_STATUS.CONFLICT).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("Usuario ya existe", "USER_EXISTS", HTTP_STATUS.CONFLICT)
                    })
                );
                return;
            }
            console.log('Password:', password);
            const hashedPassword = await BcryptUtils.createHash(password);
            console.log('Hashed password:', hashedPassword);
            // Crear usuario base con la información del perfil
            const newUser = await UserService.createUser({ 
                email, 
                username,
                profile_picture: "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png",
                password: hashedPassword
            });
    
            // Generar JWT después de la creación del usuario
            const tokenPayload: JwtPayload = {
                user_id: newUser.user_id,
                email: newUser.email,
                username: newUser.username || '',
                profile_picture: newUser.profile_picture || '',
                role: newUser.role
            };
    
            const token = sign(tokenPayload, config.JWT_SECRET, { expiresIn: "1h" });
    
            res.status(HTTP_STATUS.CREATED).json(
                apiResponse({
                    success: true,
                    payload: { 
                        token,
                        user: tokenPayload
                    }
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error interno del servidor", "INTERNAL_SERVER_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {
            const user = req.user;

            if(!user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json(
                    apiResponse({
                        success: false,
                        payload: new HttpError("No autorizado", "UNAUTHORIZED", HTTP_STATUS.UNAUTHORIZED)
                    })
                );
                return;
            }

            // Crear el payload del token como en login y register
            const tokenPayload: JwtPayload = {
                user_id: user.user_id,
                email: user.email,
                username: user.username || '',
                profile_picture: user.profile_picture || '',
                role: user.role
            };
            
            // Regenerar el token para mantener la sesión actualizada
            const token = sign(tokenPayload, config.JWT_SECRET, { expiresIn: "1h" });
            
            // Responder con el mismo formato que login y register
            res.status(HTTP_STATUS.OK).json(
                apiResponse({
                    success: true,
                    payload: { token, user: tokenPayload }
                })
            );
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).json(
                apiResponse({
                    success: false,
                    payload: new HttpError("Error interno del servidor", "INTERNAL_SERVER_ERROR", HTTP_STATUS.SERVER_ERROR)
                })
            );
        }
    }
}