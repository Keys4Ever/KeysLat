import { useEffect, useState } from "react";
import UrlService, { Url } from "../shared/services/UrlService";

const useUrls = () => {
    const [urls, setUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await UrlService.getAllUrls();
            setUrls(response.urls);
        } catch (error) {
            setError("Error al cargar las URLs.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createUrl = async (url: string, tags?: number[], description?: string) => {
        try {
            await UrlService.createShortUrl(url, tags, description);
            fetchUrls();
        } catch (error) {
            console.error("Error al crear URL:", error);
        }
    };

    const updateUrlData = async (urlId: number, newUrl: string, newTags: number[], newDescription: string) => {
        try {
            await UrlService.updateUrl(urlId, newUrl, newTags, newDescription);
            fetchUrls();
        } catch (error) {
            console.error("Error al actualizar URL:", error);
        }
    };

    const deleteUrlById = async (urlId: number) => {
        try {
            await UrlService.deleteUrl(urlId);
            setUrls((prev) => prev.filter((url) => url.id !== urlId));
        } catch (error) {
            console.error("Error al eliminar URL:", error);
        }
    };

    return { urls, loading, error, createUrl, updateUrlData, deleteUrlById };
};

export { useUrls, UrlService };