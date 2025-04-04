import { query } from "../../config/db";
import type { User } from "./entity";
import type { AuthUser } from "../auth/entity";

export class UserService {
    static async getUserByEmail(email: string): Promise<User | null> {
        const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    static async createUser(userData: Partial<User & AuthUser>): Promise<User> {
        let { email, username, profile_picture = "", role = "user", password, auth_provider="local" } = userData;
        const user_id = Math.floor(Math.random() * Date.now()).toString();
        
        // Aquí solo insertamos los campos que existen en la tabla users
        const result = await query(
            `INSERT INTO users 
             (user_id, email, username, profile_picture, role, auth_provider, password) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING user_id, username, email, profile_picture, role`,
            [user_id, email, username, profile_picture, role, auth_provider, password]
        );
        
        return result.rows[0];
    }

    static async updateUser(user: User): Promise<User> {
        const { user_id, email, username, profile_picture, role } = user;
        
        const result = await query(
            `UPDATE users SET 
             email = $1, 
             username = $2, 
             profile_picture = $3, 
             role = $4
             WHERE user_id = $5 
             RETURNING *`,
            [email, username, profile_picture, role, user_id]
        );
        
        return result.rows[0];
    }

    static async deleteUser(userId: string): Promise<void> {
        await query(
            "DELETE FROM users WHERE user_id = $1",
            [userId]
        );
    }
}