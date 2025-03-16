import { ApiResponse } from "../interfaces/Response";
import httpClient from "../utils/httpClient"

interface createShortUrlResponse extends ApiResponse{
    shortUrl: string;
    originalUrl: string;
    tags: Array<number>;
    description: string;
}

const createShortUrl = async (url: string, tags?: Array<number>, description?: string) => {
    return httpClient.post<createShortUrlResponse>('/url/create', { url, tags, description });
};

const getOriginalUrl = async (shortUrl: string) => {
    return httpClient.get(`/url/${shortUrl}`);
};

const getAllUrls = async (userId: string) => {
    return httpClient.get(`/url/all/${userId}`);
};

const getUrl = async (urlId: string) => {
    return httpClient.get(`/url/${urlId}`);
};

const deleteUrl = async (urlId: string) => {
    return httpClient.delete(`/url/${urlId}`);
};

const updateUrl = async ( urlId: string, newUrl: string, newTags: Array<number>, newDescription: string) => {
    return httpClient.put(`/url/${urlId}`, { newUrl, newTags, newDescription });
};

const UrlService = {
    createShortUrl,
    getOriginalUrl,
    getAllUrls,
    getUrl,
    deleteUrl,
    updateUrl
};

export default UrlService;