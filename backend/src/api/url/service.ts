import { query } from "../../config/db";
import type { Url } from "./entity";
import { nanoid } from "nanoid";
import HttpError from "../../utils/httpError.utils";
import HTTP_STATUS from "../../constants/HttpStatus";
import type { Tag } from "../tag/entity";
import { TagService } from "../tag/service";
import { StatsService } from "../stats/service";

export class UrlService {
    static async createUrl(data: {
        original_url: string;
        description?: string;
        user_id?: string;
        tags?: string[];
        short_url?: string;
    }): Promise<Url> {
        const { original_url, description, user_id, tags, short_url } = data;
        const id = Math.floor(Date.now() * Math.random()).toString();
        
        if(short_url && await this.alreadyExists(short_url)) {
            throw new HttpError("Short URL ya existe", "SHORT_URL_EXISTS", HTTP_STATUS.BAD_REQUEST);
        }

        let shortUrl = short_url || nanoid(8);
        while(await this.alreadyExists(shortUrl)) {
            shortUrl = nanoid(8);
        }

        const urlResult = await query(
            "INSERT INTO urls (id, original_url, description, user_id, short_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id, original_url, description, user_id, shortUrl]
        );

        let savedUrl = urlResult.rows[0];

        if (tags && tags.length > 0 && user_id) {
            const existingTags = await TagService.getTagsByNames(tags, user_id);
            
            // Asociar las etiquetas a la URL utilizando el id de la etiqueta (no tag_id)
            for (const tag of existingTags) {
                await query(
                    "INSERT INTO url_tags (url_id, tag_id) VALUES ($1, $2)",
                    [savedUrl.id, tag.id]
                );
            }
            
            // Obtener la URL con las etiquetas asociadas
            const urlWithTagsResult = await query(
                `SELECT u.*, 
                  (SELECT json_agg(t.*) FROM tags t 
                   JOIN url_tags ut ON t.id = ut.tag_id 
                   WHERE ut.url_id = u.id) as tags
                 FROM urls u WHERE u.id = $1`,
                [savedUrl.id]
            );
            
            if (urlWithTagsResult.rows.length > 0) {
                savedUrl = urlWithTagsResult.rows[0];
            }
        }

        const stats = await StatsService.createStats(savedUrl.id);
        savedUrl.stats = stats;

        return savedUrl;
    }

    static async getUrls(userId?: string): Promise<Url[]> {
        let sql = `
            SELECT u.*, 
              (SELECT json_agg(t.*) FROM tags t 
               JOIN url_tags ut ON t.id = ut.tag_id 
               WHERE ut.url_id = u.id) as tags,
              (SELECT row_to_json(s.*) FROM url_stats s 
               WHERE s.url_id = u.id) as stats
            FROM urls u`;
        
        const params: any[] = [];
        
        if (userId) {
            sql += " WHERE u.user_id = $1";
            params.push(userId);
        }

        const result = await query(sql, params);
        return result.rows;
    }

    static async getUrlByShortUrl(shortUrl: string): Promise<Url | null> {
        const result = await query(
            `SELECT u.*, 
              (SELECT row_to_json(s.*) FROM url_stats s 
               WHERE s.url_id = u.id) as stats
            FROM urls u 
            WHERE u.short_url = $1`,
            [shortUrl]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    static async updateUrl(urlId: string, data: {
        new_short_url?: string;
        new_original_url?: string;
        new_description?: string;
        new_tags?: Tag[];
    }): Promise<Url> {
        // Verificar si la URL existe
        const urlResult = await query("SELECT * FROM urls WHERE id = $1", [urlId]);
        if (urlResult.rows.length === 0) {
            console.log('No se encontró url con el id: ', urlId);
            throw new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }
        if(!data.new_short_url && !data.new_original_url && !data.new_description && !data.new_tags) {
            throw new HttpError("No se proporcionaron datos para actualizar", "NO_DATA_PROVIDED", HTTP_STATUS.BAD_REQUEST);
        }
        if(urlResult.rows[0].short_url == data.new_short_url && urlResult.rows[0].original_url == data.new_original_url && urlResult.rows[0].description == data.new_description && urlResult.rows[0].tags == data.new_tags) {
            throw new HttpError("No hay cambios", "NO_CHANGES", HTTP_STATUS.BAD_REQUEST);
        }
        
        // Iniciar una transacción
        try {
            await query("BEGIN");
            
            // Actualizar la descripción si se proporciona
            if (data.new_description !== undefined) {
                await query("UPDATE urls SET description = $1 WHERE id = $2", [data.new_description, urlId]);
            }
            
            // Actualizar la URL original si se proporciona
            if (data.new_original_url !== undefined) { 
                await query("UPDATE urls SET original_url = $1 WHERE id = $2", [data.new_original_url, urlId]);
            }
            
            // Actualizar la URL corta si se proporciona
            if (data.new_short_url !== undefined) {
                await query("UPDATE urls SET short_url = $1 WHERE id = $2", [data.new_short_url, urlId]);
            }
            
            // Actualizar las etiquetas si se proporcionan
            if (data.new_tags && data.new_tags.length > 0) {
                await query("DELETE FROM url_tags WHERE url_id = $1", [urlId]);
                for (const tag of data.new_tags) {
                    await query("INSERT INTO url_tags (url_id, tag_id) VALUES ($1, $2)", [urlId, tag.id]);
                }
            }
            
            // Confirmar la transacción
            await query("COMMIT");
            
        } catch (error) {
            await query("ROLLBACK");
            throw new HttpError("Error actualizando la URL", "UPDATE_FAILED", HTTP_STATUS.SERVER_ERROR);
        }
        
        // Obtener la URL actualizada con sus etiquetas
        const updatedUrlResult = await query(
            `SELECT u.*, 
              (SELECT json_agg(t.*) FROM tags t 
               JOIN url_tags ut ON t.id = ut.tag_id 
               WHERE ut.url_id = u.id) as tags
             FROM urls u WHERE u.id = $1`,
            [urlId]
        );

        let finalUrl = {
            ...updatedUrlResult.rows[0],
            tags: updatedUrlResult.rows[0].tags
        }
        
        const stats = await StatsService.getUrlStats(urlId);
        finalUrl.stats = stats;

        return finalUrl;
    }
    

    static async deleteUrl(urlId: string, userId?: string): Promise<void> {
        // Verificar si la URL existe
        const urlResult = await query(
            "SELECT * FROM urls WHERE id = $1",
            [urlId]
        );
        
        if (urlResult.rows.length === 0) {
            throw new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }
        
        const url = urlResult.rows[0];
        
        // Verificar autorización si se proporciona userId
        if (userId && url.user_id !== userId) {
            throw new HttpError("No autorizado para eliminar esta URL", "UNAUTHORIZED", HTTP_STATUS.UNAUTHORIZED);
        }
        
        // Eliminar la URL (las relaciones se eliminarán automáticamente por ON DELETE CASCADE)
        await query(
            "DELETE FROM urls WHERE id = $1",
            [urlId]
        );
    }

    static async alreadyExists(shortUrl: string): Promise<boolean> {
        const result = await query(
            "SELECT * FROM urls WHERE short_url = $1",
            [shortUrl]
        );
        return result.rows.length > 0;
    }
}
