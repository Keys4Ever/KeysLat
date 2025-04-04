import { query } from "../../config/db";
import type { Tag } from "./entity";
import HttpError from "../../utils/httpError.utils";
import HTTP_STATUS from "../../constants/HttpStatus";

export class TagService {
    static async createTag({ name, user_id }: { name: string; user_id: string }): Promise<Tag> {
        // Verificar si la etiqueta ya existe
        const existingTagResult = await query(
            "SELECT * FROM tags WHERE name = $1 AND user_id = $2",
            [name, user_id]
        );

        if (existingTagResult.rows.length > 0) {
            throw new HttpError("La etiqueta ya existe", "TAG_EXISTS", HTTP_STATUS.CONFLICT);
        }
        let id = String(Math.floor(Math.random() * Date.now()));
        // Crear la etiqueta
        const result = await query(
            "INSERT INTO tags (name, user_id, id) VALUES ($1, $2, $3) RETURNING *",
            [name, user_id, id]
        );

        return result.rows[0];
    }

    static async getTagsForUrl(urlId: string): Promise<Tag[]> {
        const result = await query(
            `SELECT t.*
             FROM tags t
             JOIN url_tags ut ON ut.tag_id = t.id
             WHERE ut.url_id = $1`,
            [urlId]
        );
        return result.rows;
    }

    static async getTagsByNames(ids: string[], userId: string): Promise<Tag[]> {
        const tags: Tag[] = [];
        console.log('Names: ', ids);

        for (const id of ids) {
            // Buscar la etiqueta
            console.log('Name: ', id);
            console.log('User ID: ', userId);
            const tagResult = await query(
                "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
                [id, userId]
            );

            let tag: Tag;
            if (tagResult.rows.length === 0) {
                // Crear la etiqueta si no existe <--- Es esto necesario? no. Borrar.
                const newTagResult = await query(
                    "INSERT INTO tags (id, user_id) VALUES ($1, $2) RETURNING *",
                    [id, userId]
                );
                tag = newTagResult.rows[0];
            } else {
                tag = tagResult.rows[0];
            }

            tags.push(tag);
        }

        return tags;
    }

    static async getUserTags(userId: string): Promise<Tag[]> {
        const result = await query(
            `SELECT t.*, 
             (SELECT json_agg(u.*) FROM urls u 
              JOIN url_tags ut ON u.id = ut.url_id 
              WHERE ut.tag_id = t.id) as urls
             FROM tags t 
             WHERE t.user_id = $1`,
            [userId]
        );

        return result.rows;
    }

    static async getTag(id: string, userId: string): Promise<Tag | null> {
        const result = await query(
            "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    }

    static async updateTag(id: string, { name }: { name: string }, userId: string): Promise<Tag> {
        // Verificar si la etiqueta existe
        const tagResult = await query(
            "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        if (tagResult.rows.length === 0) {
            throw new HttpError("Etiqueta no encontrada", "TAG_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Verificar si ya existe otra etiqueta con el mismo nombre
        const existingTagResult = await query(
            "SELECT * FROM tags WHERE name = $1 AND user_id = $2 AND id != $3",
            [name, userId, id]
        );

        if (existingTagResult.rows.length > 0) {
            throw new HttpError("Ya existe una etiqueta con ese nombre", "TAG_EXISTS", HTTP_STATUS.CONFLICT);
        }

        // Actualizar la etiqueta
        const result = await query(
            "UPDATE tags SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [name, id, userId]
        );

        return result.rows[0];
    }

    static async associateTagToUrl(tagId: string, urlId: string, userId: string): Promise<void> {
        // Verificar si la etiqueta existe
        const tagResult = await query(
            "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
            [tagId, userId]
        );

        if (tagResult.rows.length === 0) {
            throw new HttpError("Etiqueta no encontrada", "TAG_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Verificar si la URL existe
        const urlResult = await query(
            "SELECT * FROM urls WHERE id = $1 AND user_id = $2",
            [urlId, userId]
        );

        if (urlResult.rows.length === 0) {
            throw new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Verificar si ya existe la asociación
        const associationResult = await query(
            "SELECT * FROM url_tags WHERE url_id = $1 AND tag_id = $2",
            [urlId, tagId]
        );

        if (associationResult.rows.length === 0) {
            // Crear la asociación si no existe
            await query(
                "INSERT INTO url_tags (url_id, tag_id) VALUES ($1, $2)",
                [urlId, tagId]
            );
        }
    }

    static async disassociateTagFromUrl(tagId: string, urlId: string, userId: string): Promise<void> {
        // Verificar si la etiqueta existe
        const tagResult = await query(
            "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
            [tagId, userId]
        );

        if (tagResult.rows.length === 0) {
            throw new HttpError("Etiqueta no encontrada", "TAG_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Verificar si la URL existe
        const urlResult = await query(
            "SELECT * FROM urls WHERE id = $1 AND user_id = $2",
            [urlId, userId]
        );

        if (urlResult.rows.length === 0) {
            throw new HttpError("URL no encontrada", "URL_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Eliminar la asociación
        await query(
            "DELETE FROM url_tags WHERE url_id = $1 AND tag_id = $2",
            [urlId, tagId]
        );
    }

    static async deleteTag(id: string, userId: string): Promise<void> {
        // Verificar si la etiqueta existe
        const tagResult = await query(
            "SELECT * FROM tags WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        if (tagResult.rows.length === 0) {
            throw new HttpError("Etiqueta no encontrada", "TAG_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
        }

        // Eliminar la etiqueta (las asociaciones se eliminarán automáticamente por la restricción ON DELETE CASCADE)
        await query(
            "DELETE FROM tags WHERE id = $1 AND user_id = $2",
            [id, userId]
        );
    }
}
