import bcrypt from "bcrypt";
import type { AuthUser } from "../api/auth/entity";
import HttpError from "./httpError.utils";

export class BcryptUtils {
    static async createHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
