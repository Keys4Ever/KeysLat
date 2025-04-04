import { query } from "../../config/db";
import type { Url } from "../url/entity";
import { nanoid } from "nanoid";
import HttpError from "../../utils/httpError.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import type { QuickUrl } from "./entity";

export class QuickUrlService {
    static async createQuickUrl(original_url: string): Promise<{ short_url: string; secret_key: string }> {
        const shortUrl = nanoid(8);
        const secretKey = nanoid(12);

        // Crear URL temporal sin usuario
        let id = Math.floor(Date.now() * Math.random()).toString();
        const urlResult = await query(
            "INSERT INTO urls (original_url, short_url, id) VALUES ($1, $2, $3) RETURNING *",
            [original_url, shortUrl, id]
        );

        const savedUrl = urlResult.rows[0];

        // Crear entrada de QuickUrl
        id = Math.floor(Date.now() * Math.random()).toString();
        await query(
            "INSERT INTO quick_urls (short_url, secret_key, id) VALUES ($1, $2, $3)",
            [shortUrl, secretKey, id]
        );

        return {
            short_url: shortUrl,
            secret_key: secretKey
        };
    }

    static async connectQuickUrl(userId: string, secretKey: string): Promise<Url> {
        // Buscar QuickUrl por secretKey y obtener la URL relacionada
        const quickUrlResult = await query(
            `SELECT q.*, u.* 
             FROM quick_urls q 
             JOIN urls u ON q.short_url = u.short_url 
             WHERE q.secret_key = $1`,
            [secretKey]
        );

        if (quickUrlResult.rows.length === 0) {
            throw new HttpError("URL rápida no encontrada", "QUICK_URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        const quickUrl = quickUrlResult.rows[0];

        // Actualizar la URL con el usuario y marcarla como no temporal
        
        const urlUpdateResult = await query(
            "UPDATE urls SET user_id = $1 WHERE short_url = $2 RETURNING *",
            [userId, quickUrl.short_url]
        );

        if (urlUpdateResult.rows.length === 0) {
            throw new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }
        
        // Eliminar la entrada de QuickUrl ya que ya no es necesaria
        await query(
            "DELETE FROM quick_urls WHERE secret_key = $1",
            [secretKey]
        );

        return urlUpdateResult.rows[0];
    }
}
